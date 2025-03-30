const { ethers } = require("hardhat");

async function main() {
  // Deploy CarbonGovToken
  const CarbonGovToken = await ethers.getContractFactory("CarbonGovToken");
  const token = await CarbonGovToken.deploy();
  await token.waitForDeployment();
  console.log("CarbonGovToken deployed at:", await token.getAddress());

  // Deploy CarbonTimelock
  const CarbonTimelock = await ethers.getContractFactory("CarbonTimelock");
  const timelock = await CarbonTimelock.deploy(1, [], [], (await ethers.getSigners())[0].address);
  await timelock.waitForDeployment();
  console.log("CarbonTimelock deployed at:", await timelock.getAddress());

  // Deploy CarbonGovernance
  const CarbonGovernance = await ethers.getContractFactory("CarbonGovernance");
  const governor = await CarbonGovernance.deploy(await token.getAddress(), await timelock.getAddress());
  await governor.waitForDeployment();
  console.log("CarbonGovernance deployed at:", await governor.getAddress());

  // Deploy CarbonCreditNFT
  const CarbonCreditNFT = await ethers.getContractFactory("CarbonCreditNFT");
  const nft = await CarbonCreditNFT.deploy();
  await nft.waitForDeployment();
  console.log("CarbonCreditNFT deployed at:", await nft.getAddress());

  // Deploy CarbonCreditMarketplace
  const CarbonCreditMarketplace = await ethers.getContractFactory("CarbonCreditMarketplace");
  const marketplace = await CarbonCreditMarketplace.deploy();
  await marketplace.waitForDeployment();
  console.log("CarbonCreditMarketplace deployed at:", await marketplace.getAddress());

  // Deploy CarbonCreditVerifier
  const CarbonCreditVerifier = await ethers.getContractFactory("CarbonCreditVerifier");
  const verifier = await CarbonCreditVerifier.deploy();
  await verifier.waitForDeployment();
  console.log("CarbonCreditVerifier deployed at:", await verifier.getAddress());

  // Deploy CarbonProjectRegistry
  const CarbonProjectRegistry = await ethers.getContractFactory("CarbonProjectRegistry");
  const registry = await CarbonProjectRegistry.deploy();
  await registry.waitForDeployment();
  console.log("CarbonProjectRegistry deployed at:", await registry.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 