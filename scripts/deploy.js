const hre = require("hardhat");

async function main() {
  console.log("Deploying ITIL contracts...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy ITIL Token
  console.log("\n1. Deploying ITIL Token contract...");
  const ITILToken = await ethers.getContractFactory("ITILToken");
  const itilToken = await ITILToken.deploy();
  await itilToken.waitForDeployment();
  const tokenAddress = await itilToken.getAddress();
  console.log("ITIL Token deployed to:", tokenAddress);

  // Deploy ITIL Ledger
  console.log("\n2. Deploying ITIL Ledger contract...");
  const ITILLedger = await ethers.getContractFactory("ITILLedger");
  const itilLedger = await ITILLedger.deploy(tokenAddress);
  await itilLedger.waitForDeployment();
  const ledgerAddress = await itilLedger.getAddress();
  console.log("ITIL Ledger deployed to:", ledgerAddress);

  // Set ITIL Ledger address in token contract
  console.log("\n3. Configuring ITIL Token contract...");
  const setLedgerTx = await itilToken.setItilLedger(ledgerAddress);
  await setLedgerTx.wait();
  console.log("ITIL Ledger address set in Token contract");

  // Display summary
  console.log("\n========== Deployment Summary ==========");
  console.log("ITIL Token Address:", tokenAddress);
  console.log("ITIL Ledger Address:", ledgerAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("=====================================\n");

  // Save addresses to a file for frontend use
  const deploymentData = {
    tokenAddress,
    ledgerAddress,
    deployerAddress: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentData, null, 2)
  );
  console.log("Deployment data saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
