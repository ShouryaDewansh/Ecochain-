const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCreditMarketplace", function () {
  let nft, marketplace, owner, seller, buyer;

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy the CarbonCreditNFT contract
    const NFT = await ethers.getContractFactory("CarbonCreditNFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();
    console.log("NFT contract deployed at:", await nft.getAddress());
    expect(await nft.getAddress()).to.be.properAddress;

    // Mint an NFT (tokenId 1) to the seller
    await nft.connect(owner).mint(seller.address, 100);

    // Deploy the CarbonCreditMarketplace contract
    const Marketplace = await ethers.getContractFactory("CarbonCreditMarketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();
    console.log("Marketplace contract deployed at:", await marketplace.getAddress());
    expect(await marketplace.getAddress()).to.be.properAddress;

    // Seller approves the marketplace to transfer NFT tokenId 1
    await nft.connect(seller).approve(await marketplace.getAddress(), 1);

    // Seller lists the NFT for sale at 1 ETH
    await marketplace.connect(seller).listNFT(await nft.getAddress(), 1, ethers.parseEther("1"));
  });

  it("Should list and allow buying of NFT", async () => {
    // Retrieve the listing details
    const listing = await marketplace.getListing(await nft.getAddress(), 1);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.price).to.equal(ethers.parseEther("1"));

    // Buyer purchases the NFT by sending 1 ETH
    await marketplace.connect(buyer).buyNFT(await nft.getAddress(), 1, { value: ethers.parseEther("1") });

    // Verify that NFT ownership has transferred to the buyer
    expect(await nft.ownerOf(1)).to.equal(buyer.address);
  });
});
