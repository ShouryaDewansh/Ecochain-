const { ethers } = require("hardhat");

async function main() {
  // Contract addresses from our deployment
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const governorAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const nftAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const marketplaceAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const verifierAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const registryAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  // Get the signer (account)
  const [signer] = await ethers.getSigners();
  console.log("Interacting with contracts using account:", signer.address);

  // Get contract instances
  const token = await ethers.getContractAt("CarbonGovToken", tokenAddress);
  const governor = await ethers.getContractAt("CarbonGovernance", governorAddress);
  const nft = await ethers.getContractAt("CarbonCreditNFT", nftAddress);
  const marketplace = await ethers.getContractAt("CarbonCreditMarketplace", marketplaceAddress);
  const verifier = await ethers.getContractAt("CarbonCreditVerifier", verifierAddress);
  const registry = await ethers.getContractAt("CarbonProjectRegistry", registryAddress);

  // Example interactions:

  // 1. Check token balance
  const balance = await token.balanceOf(signer.address);
  console.log("Token balance:", ethers.formatEther(balance));

  // 2. Delegate tokens to self
  console.log("Delegating tokens...");
  const delegateTx = await token.delegate(signer.address);
  await delegateTx.wait();
  console.log("Delegation complete");

  // 3. Create a proposal
  console.log("Creating a proposal...");
  const targets = [tokenAddress];
  const values = [0];
  const calldatas = [token.interface.encodeFunctionData("mint", [signer.address, ethers.parseEther("100")])];
  const description = "Mint tokens proposal";
  
  const proposeTx = await governor.propose(targets, values, calldatas, description);
  const receipt = await proposeTx.wait();
  console.log("Proposal created!");

  // Get proposal ID from event
  const event = receipt.logs.find(log => {
    try {
      return governor.interface.parseLog(log).name === "ProposalCreated";
    } catch (e) {
      return false;
    }
  });
  const proposalId = governor.interface.parseLog(event).args.proposalId;
  console.log("Proposal ID:", proposalId);

  // 4. Check proposal state
  const state = await governor.state(proposalId);
  console.log("Proposal state:", state);

  // 5. Add a project to registry
  console.log("Adding a project to registry...");
  const projectId = 1;
  const projectTx = await registry.addProject(
    projectId,
    "Test Project",
    "Test Description",
    "Test Location",
    1000,
    "QmTest"
  );
  await projectTx.wait();
  console.log("Project added!");

  // 6. Verify a carbon credit
  console.log("Verifying a carbon credit...");
  const tokenId = 1;
  const verifyTx = await verifier.verifyCarbonCredit(tokenId, "Manual Verification");
  await verifyTx.wait();
  console.log("Carbon credit verified!");

  // 7. Check verification status
  const verification = await verifier.getVerification(tokenId);
  console.log("Verification details:", verification);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 