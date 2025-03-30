const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCreditVerifier", function () {
  let verifier, owner, verifierAddress;

  beforeEach(async () => {
    [owner, verifierAddress] = await ethers.getSigners();

    const Verifier = await ethers.getContractFactory("CarbonCreditVerifier");
    verifier = await Verifier.deploy();
    await verifier.waitForDeployment();
  });

  it("Should allow the owner to verify a carbon credit", async () => {
    const tokenId = 1;
    const verificationMethod = "Manual Verification";
    
    await verifier.connect(owner).verifyCarbonCredit(tokenId, verificationMethod);
    
    const verification = await verifier.getVerification(tokenId);
    expect(verification.verified).to.be.true;
    expect(verification.verificationMethod).to.equal(verificationMethod);
    expect(verification.verifier).to.equal(owner.address);
  });

  it("Should store verification details correctly", async () => {
    const tokenId = 2;
    const verificationMethod = "Automated Verification";
    
    await verifier.connect(owner).verifyCarbonCredit(tokenId, verificationMethod);
    
    const verification = await verifier.getVerification(tokenId);
    expect(verification.verified).to.be.true;
    expect(verification.verificationMethod).to.equal(verificationMethod);
    expect(verification.verificationDate).to.be.gt(0);
    expect(verification.verifier).to.equal(owner.address);
  });
});
