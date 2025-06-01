const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment...");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);
    
    // Get the contract factory
    const DIDRegistry = await ethers.getContractFactory("DIDRegistry");
    console.log("Contract factory created");
    
    // Deploy the contract
    console.log("Deploying contract...");
    const didRegistry = await DIDRegistry.deploy();
    console.log("Contract deployed, waiting for confirmation...");
    
    await didRegistry.waitForDeployment();
    const address = await didRegistry.getAddress();
    
    console.log("✅ DIDRegistry deployed successfully!");
    console.log("Contract address:", address);
    console.log("Network:", (await ethers.provider.getNetwork()).name);
    
    // Test the contract
    console.log("\nTesting contract methods...");
    const testDID = "did:trustblock:test:0x1234567890123456789012345678901234567890";
    const testDocument = JSON.stringify({ test: "document" });
    
    const tx = await didRegistry.updateDIDDocument(testDID, testDocument);
    await tx.wait();
    console.log("✅ updateDIDDocument method works!");
    
    const retrievedDoc = await didRegistry.getDIDDocument(testDID);
    console.log("✅ getDIDDocument method works!");
    
    console.log("\n=== Add this to your .env.local file ===");
    console.log(`NEXT_PUBLIC_DID_REGISTRY=${address}`);
    console.log(`NEXT_PUBLIC_NETWORK=${(await ethers.provider.getNetwork()).name}`);
    
  } catch (error) {
    console.error("Deployment failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n✅ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });