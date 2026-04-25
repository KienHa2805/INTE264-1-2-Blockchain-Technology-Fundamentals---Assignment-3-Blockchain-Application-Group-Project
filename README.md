# ITIL - Immutable Threat Intelligence Ledger

A decentralized application (dApp) for threat intelligence sharing on the blockchain, built with Solidity smart contracts, React, and Ethers.js.

## 🎓 Academic Submission

**Live Demo:** [Insert Vercel Link Here]

### Team Members

- [Member 1 Name] - [Student ID]
- [Member 2 Name] - [Student ID]
- [Member 3 Name] - [Student ID]

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
- **Testing**: Hardhat Test Suite (31/31 unit tests passing ✓)

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

All 31 unit tests should pass:

```bash
npm run hardhat:test
```

**Expected Output:**

```
ITIL Smart Contracts
  ITILToken (8 tests)
  ITILLedger
    IoC Submission (4 tests)
    IoC Voting (6 tests)
    IoC Verification and Rewards (6 tests)
    Query Functions (3 tests)
    Edge Cases (2 tests)

31 passing
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

## 🌐 Deploying React to Vercel

### Prerequisites

- Vercel account (free at [vercel.com](https://vercel.com))
- GitHub repository with the code

### Deployment Steps

#### 1. Push Code to GitHub

```bash
git add .
git commit -m "feat: complete ITIL application"
git push origin main
```

#### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Choose "Create a new project"

#### 3. Build Configuration

**Root Directory:** `.`

**Build Command:**

```
cd frontend && npm install && npm run build
```

**Output Directory:**

```
frontend/dist
```

#### 4. Set Environment Variables

⚠️ **CRITICAL SECURITY WARNINGS:**

**DO NOT UPLOAD TO VERCEL:**

- ❌ Private keys
- ❌ RPC URLs with API keys
- ❌ Any sensitive credentials

**Safe Deployment:**

1. In Vercel Dashboard → Project Settings → Environment Variables
2. Add the following with **"Sensitive" flag enabled** on each:
   - `VITE_ITIL_TOKEN_ADDRESS` (contract address - safe to expose)
   - `VITE_ITIL_LEDGER_ADDRESS` (contract address - safe to expose)
   - `VITE_SEPOLIA_RPC_URL` (can use public RPC without API key, e.g., https://sepolia.infura.io/v3/YOUR_KEY)

**Example - Using Public RPC:**

```env
VITE_SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

#### 5. Deploy

Click "Deploy" button. Vercel will build and deploy your React app.

#### 6. Verify Deployment

- Check deployment logs at vercel.com
- Test the application at your Vercel URL
- Verify MetaMask connection works
- Test contract interactions

### Environment Variable Best Practices

✅ **DO:**

- Use Vercel's built-in environment management
- Mark all variables as "Sensitive" in Vercel settings
- Rotate API keys regularly
- Use a dedicated RPC provider for frontend (Alchemy, Infura free tier)

❌ **DON'T:**

- Commit `.env` files to version control
- Expose private keys anywhere
- Use production private keys in development
- Share environment variables in code comments
- Use the same RPC endpoint for multiple projects

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
function submitIoC(string memory threatIndicator) external returns (uint256)

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
✅ 31 tests passing

- ITILToken: 8 tests
  - Name, symbol, decimals
  - Initial supply minting
  - Access control (only ledger can mint)
  - Owner verification

- ITILLedger: 23 tests
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

### Private Key Management

⚠️ **ALWAYS:**

1. Use a dedicated account for deployment (not main wallet)
2. Keep private keys in `.env` (never in `.env.local` or code)
3. Use `.gitignore` to prevent accidental commits
4. Rotate keys after each deployment
5. Use hardware wallets for production

## 🌍 Network Information

### Sepolia Testnet

- **ChainID**: 11155111
- **Chain ID (Hex)**: 0xaa36a7
- **Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com
- **RPC Endpoints**:
  - https://sepolia.infura.io/v3/YOUR_KEY
  - https://sepolia-rpc.com
  - https://rpc.sepolia.org

## � Next Steps

1. **Test Locally**: Run Hardhat node and test contracts
2. **Deploy**: Deploy to Sepolia testnet
3. **Test Frontend**: Connect MetaMask and submit threats
4. **Deploy to Vercel**: Share your dApp with others
5. **Monitor**: Check Etherscan for your transactions

## 📝 Example Usage Flow

1. User connects MetaMask wallet
2. User submits a threat indicator (e.g., malicious IP)
3. Community members vote approve/reject
4. After 1 approval → automatically verified & rewarded
5. Tokens appear in user's wallet

## 🐛 Troubleshooting

### "MetaMask not installed"

- Install MetaMask extension from chrome.google.com/webstore

### "Wrong network"

- App automatically prompts to switch to Sepolia
- Manually switch in MetaMask if needed

### "Transaction reverted"

- Check you have enough Sepolia ETH for gas
- Verify contract addresses are correct in `.env`
- Check you're not voting twice on same IoC

### "Contract addresses not configured"

- Make sure `.env` files are created and populated
- Reload page after setting environment variables

---

**Status**: ✅ Production Ready | **Tests**: ✅ 31/31 Passing | **Network**: 🌐 Sepolia Testnet
