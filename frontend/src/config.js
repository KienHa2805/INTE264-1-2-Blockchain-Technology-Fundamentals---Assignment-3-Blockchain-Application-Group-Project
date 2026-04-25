// Frontend environment configuration
// These values should be populated after smart contract deployment

export const ITIL_CONFIG = {
  // Contract addresses (update after deployment)
  ITIL_TOKEN_ADDRESS: import.meta.env.VITE_ITIL_TOKEN_ADDRESS || '',
  ITIL_LEDGER_ADDRESS: import.meta.env.VITE_ITIL_LEDGER_ADDRESS || '',
  
  // Network configuration
  NETWORK_ID: 11155111, // Sepolia testnet
  NETWORK_NAME: 'Sepolia',
  RPC_URL: import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  
  // Chain configuration
  CHAIN_ID: '0xaa36a7', // Sepolia chain ID in hex
  
  // Application constants
  VERIFICATION_THRESHOLD: 1, // 1 vote required for MVP demo
  SUBMITTER_REWARD: '10', // in ITIL tokens
  VOTER_REWARD: '5', // in ITIL tokens
};

// Contract ABIs
export const ITIL_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
];

export const ITIL_LEDGER_ABI = [
  'function submitIoC(string memory threatIndicator, string memory category) returns (uint256)',
  'function voteOnIoC(uint256 iocId, bool isApproved)',
  'function getIoC(uint256 iocId) view returns (uint256, string, string, address, uint8, uint256, uint256, uint256, uint256)',
  'function getPendingIoCs() view returns (uint256[])',
  'function getIoCCount() view returns (uint256)',
  'function getApprovers(uint256 iocId) view returns (address[])',
  'function getRejectors(uint256 iocId) view returns (address[])',
  'function hasVoted(uint256 iocId, address voter) view returns (bool)',
  'event IoCSubmitted(uint256 indexed iocId, string category, string threatIndicator, address indexed submitter)',
  'event IoCVoted(uint256 indexed iocId, address indexed voter, bool approved)',
  'event IoCVerified(uint256 indexed iocId, address indexed submitter)',
  'event IoCRejected(uint256 indexed iocId)',
  'event RewardDistributed(uint256 indexed iocId, address indexed recipient, uint256 amount)',
];
