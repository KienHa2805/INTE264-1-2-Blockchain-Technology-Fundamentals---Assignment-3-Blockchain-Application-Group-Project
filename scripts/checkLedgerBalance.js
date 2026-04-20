const hre = require("hardhat");

async function main() {
  const tokenAddress = "0xE97856E60dC32E02EA6e127De6516507960A4608";
  const ledgerAddress = "0xF64Bb1A58C3a8687864d2f4209ED300b849377E0";
  
  const ITILToken = await ethers.getContractAt("ITILToken", tokenAddress);
  
  const ledgerBalance = await ITILToken.balanceOf(ledgerAddress);
  const formattedBalance = ethers.formatEther(ledgerBalance);
  
  console.log("\n========== Ledger Reward Pool Check ==========");
  console.log("Token Address:  ", tokenAddress);
  console.log("Ledger Address: ", ledgerAddress);
  console.log("Ledger Balance: ", formattedBalance, "ITIL tokens");
  console.log("==========================================\n");
  
  if (ledgerBalance > 0n) {
    console.log("✅ Ledger has reward tokens! Ready for voting and verification.");
  } else {
    console.log("⚠️  WARNING: Ledger has 0 tokens! Rewards cannot be distributed.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
