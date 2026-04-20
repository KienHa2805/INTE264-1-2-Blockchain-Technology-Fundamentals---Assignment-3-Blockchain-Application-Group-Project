import { ethers } from 'ethers';
import { ITIL_CONFIG, ITIL_TOKEN_ABI, ITIL_LEDGER_ABI } from './config';

/**
 * Checks if MetaMask is installed and available
 */
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

/**
 * Connects to MetaMask wallet
 */
export const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts[0];
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('User denied wallet connection');
    }
    throw error;
  }
};

/**
 * Gets the current connected account
 */
export const getConnectedAccount = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    throw new Error('Failed to get connected account');
  }
};

/**
 * Switches to Sepolia network
 */
export const switchToSepolia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: ITIL_CONFIG.CHAIN_ID }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      // Network not added, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: ITIL_CONFIG.CHAIN_ID,
            chainName: 'Sepolia',
            rpcUrls: [ITIL_CONFIG.RPC_URL],
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
};

/**
 * Gets a provider instance
 */
export const getProvider = () => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum);
};

/**
 * Gets a signer instance
 */
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

/**
 * Gets the ITIL Ledger contract instance
 */
export const getITILLedgerContract = async (readOnly = false) => {
  if (!ITIL_CONFIG.ITIL_LEDGER_ADDRESS) {
    throw new Error('ITIL Ledger contract address not configured');
  }

  const provider = getProvider();
  const signer = readOnly ? provider : await getSigner();
  
  return new ethers.Contract(
    ITIL_CONFIG.ITIL_LEDGER_ADDRESS,
    ITIL_LEDGER_ABI,
    signer
  );
};

/**
 * Gets the ITIL Token contract instance
 */
export const getITILTokenContract = async (readOnly = false) => {
  if (!ITIL_CONFIG.ITIL_TOKEN_ADDRESS) {
    throw new Error('ITIL Token contract address not configured');
  }

  const provider = getProvider();
  const signer = readOnly ? provider : await getSigner();
  
  return new ethers.Contract(
    ITIL_CONFIG.ITIL_TOKEN_ADDRESS,
    ITIL_TOKEN_ABI,
    signer
  );
};

/**
 * Submits a new IoC (Indicator of Compromise)
 */
export const submitIoC = async (threatIndicator, category) => {
  const contract = await getITILLedgerContract();
  const tx = await contract.submitIoC(threatIndicator, category);
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Votes on an IoC
 */
export const voteOnIoC = async (iocId, isApproved) => {
  const contract = await getITILLedgerContract();
  const tx = await contract.voteOnIoC(iocId, isApproved);
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Gets pending IoCs
 */
export const getPendingIoCs = async () => {
  const contract = await getITILLedgerContract(true);
  return await contract.getPendingIoCs();
};

/**
 * Gets verified IoCs
 */
export const getVerifiedIoCs = async () => {
  try {
    const contract = await getITILLedgerContract(true);
    const count = await contract.getIoCCount();
    const totalCount = Number(count); // Convert BigNumber to number
    const verifiedIoCs = [];

    for (let i = 0; i < totalCount; i++) {
      try {
        const details = await contract.getIoC(i.toString());
        // Status 1 = Verified (convert to number for proper comparison)
        const statusValue = Number(details[4]);  // Status is now at index 4
        if (statusValue === 1) {
          verifiedIoCs.push({
            id: details[0].toString(),
            threatIndicator: details[1],
            category: details[2],  // Category is now at index 2
            submitterAddress: details[3],  // Submitter is now at index 3
            status: statusValue,
            approvals: details[5].toString(),  // Approvals is now at index 5
            rejections: details[6].toString(),  // Rejections is now at index 6
            createdAt: details[7].toString(),  // CreatedAt is now at index 7
            verifiedAt: details[8].toString(),  // VerifiedAt is now at index 8
          });
        }
      } catch (err) {
        console.error(`Error fetching IoC ${i}:`, err);
        // Continue to next IoC if one fails
        continue;
      }
    }

    console.log(`Found ${verifiedIoCs.length} verified IoCs out of ${totalCount} total`);
    return verifiedIoCs;
  } catch (error) {
    console.error('Failed to fetch verified IoCs:', error);
    throw error;
  }
};

/**
 * Gets details of an IoC
 */
export const getIoCDetails = async (iocId) => {
  const contract = await getITILLedgerContract(true);
  const details = await contract.getIoC(iocId);
  return {
    id: details[0].toString(),
    threatIndicator: details[1],
    category: details[2],  // New: Category field
    submitter: details[3],  // Index shifted from 2 to 3
    status: details[4], // Index shifted from 3 to 4: 0 = Pending, 1 = Verified, 2 = Rejected
    approvalCount: details[5].toString(),  // Index shifted from 4 to 5
    rejectionCount: details[6].toString(),  // Index shifted from 5 to 6
    createdAt: details[7].toString(),  // Index shifted from 6 to 7
    verifiedAt: details[8].toString(),  // Index shifted from 7 to 8
  };
};

/**
 * Gets total IoC count
 */
export const getIoCCount = async () => {
  const contract = await getITILLedgerContract(true);
  const count = await contract.getIoCCount();
  return count.toString();
};

/**
 * Checks if user has voted on an IoC
 */
export const hasUserVoted = async (iocId, userAddress) => {
  const contract = await getITILLedgerContract(true);
  return await contract.hasVoted(iocId, userAddress);
};

/**
 * Gets the user's token balance
 */
export const getUserTokenBalance = async (userAddress) => {
  const contract = await getITILTokenContract(true);
  const balance = await contract.balanceOf(userAddress);
  return ethers.formatUnits(balance, 18); // 18 decimals for the token
};

/**
 * Gets the user's current network
 */
export const getUserNetwork = async () => {
  const provider = getProvider();
  const network = await provider.getNetwork();
  return {
    chainId: network.chainId,
    name: network.name,
  };
};

/**
 * Listens for account changes
 */
export const onAccountChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
};

/**
 * Listens for network changes
 */
export const onNetworkChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback);
  }
};

/**
 * Removes listeners
 */
export const removeListener = (event, callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.removeListener(event, callback);
  }
};
