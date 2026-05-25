# ITIL - Immutable Threat Intelligence Ledger

A decentralized application (dApp) for threat intelligence sharing on the blockchain, built with Solidity smart contracts, React, and Ethers.js.

## 🎓 Academic Submission

**Live Demo:** [https://inte-264-1-2-blockchain-technology.vercel.app/](https://inte-264-1-2-blockchain-technology.vercel.app/)

### Team Members

- Kien Ha Duc - s4112914
- Nam Thinh Ngoc - s4120622
- Tuan Tran Quoc - s4131462

### LLM Usage Disclosure

This project was developed with the assistance of AI tools such as GitHub Copilot and conversational LLMs. These tools were utilized for code generation, debugging smart contracts, implementing frontend components, and refining the UI/UX, in compliance with academic integrity guidelines.

## 🚀 Overview

The Immutable Threat Intelligence Ledger (ITIL) is a Web3 application that enables security researchers and threat analysts to collaboratively share and verify threat indicators (IoCs) on the blockchain. The platform uses a Proof-of-Quality consensus mechanism where community votes determine threat verification. Rewards are automatically distributed via ERC-20 tokens.

### Key Features

- **Submit Threat Indicators**: Post malicious IPs, malware hashes, suspicious domains, or other IoCs
- **Community Voting**: Vote to approve or reject threat indicators (1+ approvals = verified)
- **Strict Duplicate Prevention**: Smart contract mapping blocks duplicate IoC submissions to ensure ledger integrity
- **Live Input Validation**: Real-time Regex checking for IP Addresses, Domains, Phone Numbers, and Malware Hashes before Web3 transactions are triggered
- **Automated Rewards**: ERC-20 tokens distributed to submitters and correct voters
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Real-time Dashboard**: View all pending threats and voting status

## 📋 Tech Stack

- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin
- **Contract Development**: Hardhat, Mocha/Chai
- **Frontend**: React 18, Vite
- **Blockchain Interaction**: Ethers.js v6
- **Network**: Sepolia Testnet
- **Testing**: Hardhat Test Suite (37/37 unit tests passing ✓)

## 🎓 Evaluator Quick-Start (Local Testing)

To quickly audit the smart contract test suite locally without network configurations, clone the repository and run:

```bash
npm install --legacy-peer-deps
npm run hardhat:test
```

## 📦 Project Structure

```
.
├── contracts/               # Smart contracts
│   ├── ITILToken.sol       # ERC-20 utility token
│   └── ITILLedger.sol      # Main ITIL ledger contract
├── scripts/
│   └── deploy.js           # Deployment script
├── test/
│   └── ITIL.test.js        # Comprehensive test suite
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config.js       # Contract configuration
│   │   ├── utils.js        # Web3 utilities
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Global styles
│   ├── vite.config.js      # Vite configuration
│   └── index.html          # HTML entry point
├── hardhat.config.js       # Hardhat configuration
├── package.json            # Root dependencies
└── README.md              # This file
```

## 🛠️ Local Setup & Development

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension (for frontend testing)
- **Sepolia testnet ETH** (for gas fees) - Get from [Sepolia Faucet](https://sepoliafaucet.com)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd INTE264-1-2-Blockchain-Technology-Fundamentals---Assignment-3-Blockchain-Application-Group-Project
```

### Step 2: Setup Backend (Hardhat)

#### Install Dependencies

```bash
npm install --legacy-peer-deps
```

#### Compile Smart Contracts

```bash
npm run hardhat:compile
```

#### Run Unit Tests

All 37 unit tests should pass:

```bash
npm run hardhat:test
```

**Expected Output:**

```
ITIL Smart Contracts
  ITILToken (9 tests)
  ITILLedger
    IoC Submission (8 tests)
    IoC Voting (8 tests)
    IoC Verification and Rewards (6 tests)
    Query Functions (3 tests)
    Edge Cases (3 tests)

37 passing
```

#### Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Sepolia RPC URL (get from Infura, Alchemy, or QuickNode)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private key of deployment account (with Sepolia ETH)
# ⚠️ SECURITY: NEVER commit this to version control
PRIVATE_KEY=your_private_key_here

# Optional: For contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
```

_Note for Evaluator: If you wish to execute live Hardhat tasks or deploy against our live testnet contracts, ensure you append `--network sepolia` to your CLI commands._

#### Deploy Smart Contracts to Sepolia

```bash
npm run hardhat:deploy
```

**Output:**

```
Deploying ITIL contracts...
1. Deploying ITIL Token contract...
ITIL Token deployed to: 0x...

2. Deploying ITIL Ledger contract...
ITIL Ledger deployed to: 0x...

3. Configuring ITIL Token contract...
ITIL Ledger address set in Token contract

========== Deployment Summary ==========
ITIL Token Address: 0x...
ITIL Ledger Address: 0x...
Deployment data saved to deployment.json
```

Save the contract addresses for frontend configuration.

### Step 3: Setup Frontend (React)

#### Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cp .env.example .env.local
```

Edit `frontend/.env.local`:

```env
# Contract addresses from deployment
VITE_ITIL_TOKEN_ADDRESS=0x...
VITE_ITIL_LEDGER_ADDRESS=0x...

# Sepolia RPC URL
VITE_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
```

#### Run Development Server

```bash
npm run frontend:dev
```

The application will open at `http://localhost:3000`

#### Build for Production

```bash
npm run frontend:build
```

Output will be in `frontend/dist/`

## 🧪 Smart Contract Functions

### ITILToken (ERC-20)

```solidity
// Mint tokens (only ITIL Ledger can call)
function mint(address to, uint256 amount) external

// Set ITIL Ledger address (only owner)
function setItilLedger(address _ledger) external onlyOwner
```

### ITILLedger

```solidity
// Submit a new IoC
// Returns: IoC ID
function submitIoC(string memory threatIndicator, string memory category) external returns (uint256)

// Vote on an IoC (approval or rejection)
function voteOnIoC(uint256 iocId, bool isApproved) external

// Get IoC details
function getIoC(uint256 iocId) external view returns (...)

// Get all pending IoCs
function getPendingIoCs() external view returns (uint256[] memory)

// Get approvers of an IoC
function getApprovers(uint256 iocId) external view returns (address[] memory)

// Check if user voted on IoC
function hasVoted(uint256 iocId, address voter) external view returns (bool)
```

## 📊 Contract Constants

- **VERIFICATION_THRESHOLD**: 1 (votes needed to verify)
- **SUBMITTER_REWARD**: 10 ITIL tokens
- **VOTER_REWARD**: 5 ITIL tokens per correct vote
- **Token Decimals**: 18

## 🧪 Testing

### Run All Tests

```bash
npm run hardhat:test
```

### Test Coverage

Run coverage report:

```bash
npm run hardhat:test -- --coverage
```

### Test Results Summary

```
✅ 37 tests passing

- ITILToken: 9 tests
  - Name, symbol, decimals
  - Initial supply minting
  - Access control (only ledger can mint)
  - Owner verification

- ITILLedger: 28 tests
  - IoC submission and validation
  - Vote casting and constraints
  - Threshold-based verification
  - Reward distribution
  - Query functions
  - Edge cases with multiple submissions
```

## 🔐 Security Considerations

### Smart Contract Security

- ✅ OpenZeppelin contracts used (audited)
- ✅ Access control on sensitive functions
- ✅ No external calls in loops
- ✅ Proper state management
- ✅ Event logging for transparency

### Frontend Security

- ✅ MetaMask wallet integration (not storing keys)
- ✅ Transaction signing via provider
- ✅ Contract address validation
- ✅ User input validation

## 🌍 Network Information

### Sepolia Testnet

- **ChainID**: 11155111
- **Chain ID (Hex)**: 0xaa36a7
- **Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com
- **RPC Endpoint**:
  - https://ethereum-sepolia-rpc.publicnode.com

## 📝 Example Usage Flow

1. User connects MetaMask wallet
2. User submits a threat indicator (e.g., malicious IP)
3. Community members vote approve/reject
4. After 1 approval → automatically verified & rewarded
5. Tokens appear in user's wallet

## 🪙 View ITIL Token in MetaMask

After submitting or voting on a verified IoC, ITIL tokens are automatically sent to your wallet. To see them in MetaMask, you need to import the token once:

1. Open **MetaMask** and make sure you are on the **Sepolia** network
2. Scroll to the bottom of the **Tokens** tab and click **Import tokens**
3. Paste the ITIL Token contract address:
   ```
   0x1B5dce75E6584650589736B567C867a203c08856
   ```
4. Token symbol (`ITIL`) and decimals (`18`) will auto-fill
5. Click **Add custom token** → **Import tokens**

Your ITIL token balance will now appear in MetaMask and update automatically whenever you receive rewards.

> **Note:** The token import is per-wallet — each MetaMask account that participates needs to import the token separately to see its balance.

---
