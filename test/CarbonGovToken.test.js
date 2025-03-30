const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonGovToken", function () {
  it("mints 1,000,000 CGOV to deployer", async function () {
    const [deployer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("CarbonGovToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const balance = await token.balanceOf(deployer.address);
    expect(balance).to.equal(ethers.parseUnits("1000000", 18));
  });
});
