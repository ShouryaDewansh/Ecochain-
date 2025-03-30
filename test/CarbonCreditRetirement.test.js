const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCreditRetirement", function () {
  let nft, retire, owner, seller;

  beforeEach(async () => {
    [owner, seller] = await ethers.getSigners();

    // Deploy the NFT contract
    const NFT = await ethers.getContractFactory("CarbonCreditNFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();

    // Mint tokenId 1 to seller (deployer is owner by default)
    await nft.mint(seller.address, 100);
    expect(await nft.ownerOf(1)).to.equal(seller.address);

    // Deploy the Retirement contract
    const Retirement = await ethers.getContractFactory("CarbonCreditRetirement");
    retire = await Retirement.deploy();
    await retire.waitForDeployment();

    // Approve the retirement contract to transfer tokenId 1
    await nft.connect(seller).approve(await retire.getAddress(), 1);
  });

  it("Should retire a carbon credit NFT", async () => {
    await retire.connect(seller).retire(await nft.getAddress(), 1);
    expect(await retire.isRetired(await nft.getAddress(), 1)).to.be.true;
    expect(await nft.ownerOf(1)).to.equal(await retire.getAddress());
  });

  it("Should revert if not owner tries to retire", async () => {
    await expect(retire.connect(owner).retire(await nft.getAddress(), 1))
      .to.be.revertedWith("Not owner");
  });

  it("Should revert when retiring an already retired token", async () => {
    // First retirement
    await retire.connect(seller).retire(await nft.getAddress(), 1);
    
    // Try to retire again with a new token
    await nft.mint(seller.address, 200); // Mint tokenId 2
    await nft.connect(seller).approve(await retire.getAddress(), 2);
    
    // Try to retire tokenId 1 again (which is already retired)
    await expect(retire.connect(seller).retire(await nft.getAddress(), 1))
      .to.be.revertedWith("Already retired");
  });
});
