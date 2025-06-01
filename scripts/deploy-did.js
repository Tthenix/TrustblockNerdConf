const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy DIDRegistry contract
  console.log("\nDeploying DIDRegistry...");
  const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
  const didRegistry = await DIDRegistry.deploy();
  
  await didRegistry.waitForDeployment();
  const registryAddress = await didRegistry.getAddress();

  console.log("DIDRegistry deployed to:", registryAddress);
  console.log("Network:", await ethers.provider.getNetwork());

  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    DIDRegistry: registryAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    gasUsed: "Check transaction receipt"
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n=== Environment Variables ===");
  console.log(`NEXT_PUBLIC_DID_REGISTRY=${registryAddress}`);
  console.log(`NEXT_PUBLIC_NETWORK=${(await ethers.provider.getNetwork()).name}`);
  
  console.log("\n=== Next Steps ===");
  console.log("1. Add the above environment variables to your .env.local file");
  console.log("2. Verify the contract on Etherscan if deploying to a public network");
  console.log("3. Update your DID configuration with the new contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });