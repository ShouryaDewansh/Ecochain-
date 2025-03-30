const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCreditNFT", function () {
  let nft, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("CarbonCreditNFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();
  });

  it("Should mint a carbon credit NFT and store the amount", async () => {
    const amount = 100;
    await nft.connect(owner).mint(user.address, amount);

    const tokenId = 1; // First token ID is 1
    expect(await nft.ownerOf(tokenId)).to.equal(user.address);
    expect(await nft.getCarbonAmount(tokenId)).to.equal(amount);
  });
});
