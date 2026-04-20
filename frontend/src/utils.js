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
export const submitIoC = async (threatIndicator) => {
  const contract = await getITILLedgerContract();
  const tx = await contract.submitIoC(threatIndicator);
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
 * Gets details of an IoC
 */
export const getIoCDetails = async (iocId) => {
  const contract = await getITILLedgerContract(true);
  const details = await contract.getIoC(iocId);
  return {
    id: details[0].toString(),
    threatIndicator: details[1],
    submitter: details[2],
    status: details[3], // 0 = Pending, 1 = Verified, 2 = Rejected
    approvalCount: details[4].toString(),
    rejectionCount: details[5].toString(),
    createdAt: details[6].toString(),
    verifiedAt: details[7].toString(),
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
