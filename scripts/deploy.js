const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CarbonGovToken
  const CarbonGovToken = await hre.ethers.getContractFactory("CarbonGovToken");
  const token = await CarbonGovToken.deploy();
  console.log("CarbonGovToken deploying to:", token.target);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("CarbonGovToken deployed to:", tokenAddress);

  // Deploy CarbonTimelock
  const CarbonTimelock = await hre.ethers.getContractFactory("CarbonTimelock");
  const timelock = await CarbonTimelock.deploy(1, [], [], deployer.address);
  console.log("CarbonTimelock deploying to:", timelock.target);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("CarbonTimelock deployed to:", timelockAddress);

  // Deploy CarbonGovernance
  const CarbonGovernance = await hre.ethers.getContractFactory("CarbonGovernance");
  const governor = await CarbonGovernance.deploy(tokenAddress, timelockAddress);
  console.log("CarbonGovernance deploying to:", governor.target);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  console.log("CarbonGovernance deployed to:", governorAddress);

  // Deploy CarbonCreditNFT
  const CarbonCreditNFT = await hre.ethers.getContractFactory("CarbonCreditNFT");
  const nft = await CarbonCreditNFT.deploy();
  console.log("CarbonCreditNFT deploying to:", nft.target);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("CarbonCreditNFT deployed to:", nftAddress);

  // Deploy CarbonCreditMarketplace
  const CarbonCreditMarketplace = await hre.ethers.getContractFactory("CarbonCreditMarketplace");
  const marketplace = await CarbonCreditMarketplace.deploy();
  console.log("CarbonCreditMarketplace deploying to:", marketplace.target);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("CarbonCreditMarketplace deployed to:", marketplaceAddress);

  // Deploy CarbonCreditVerifier
  const CarbonCreditVerifier = await hre.ethers.getContractFactory("CarbonCreditVerifier");
  const verifier = await CarbonCreditVerifier.deploy();
  console.log("CarbonCreditVerifier deploying to:", verifier.target);
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("CarbonCreditVerifier deployed to:", verifierAddress);

  // Deploy CarbonProjectRegistry
  const CarbonProjectRegistry = await hre.ethers.getContractFactory("CarbonProjectRegistry");
  const registry = await CarbonProjectRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("CarbonProjectRegistry deploying to:", registryAddress);
  console.log("CarbonProjectRegistry deployed to:", registryAddress);

  // Save the contract addresses
  const addresses = {
    CarbonGovToken: tokenAddress,
    CarbonTimelock: timelockAddress,
    CarbonGovernance: governorAddress,
    CarbonCreditNFT: nftAddress,
    CarbonCreditMarketplace: marketplaceAddress,
    CarbonCreditVerifier: verifierAddress,
    CarbonProjectRegistry: registryAddress
  };

  console.log("\nDeployed contract addresses:", addresses);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 