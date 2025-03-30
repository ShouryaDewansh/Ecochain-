const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonPaymentSplitter", function () {
  let splitter, owner, payee1, payee2, payee3;

  beforeEach(async () => {
    [owner, payee1, payee2, payee3] = await ethers.getSigners();

    const Splitter = await ethers.getContractFactory("CarbonPaymentSplitter");
    splitter = await Splitter.deploy(
      [payee1.address, payee2.address, payee3.address],
      [50, 30, 20]
    );
    await splitter.waitForDeployment();
  });

  it("should distribute received ETH according to shares", async () => {
    const sendAmount = ethers.parseEther("1");
    await owner.sendTransaction({ 
      to: await splitter.getAddress(), 
      value: sendAmount 
    });

    const initialBalances = await Promise.all(
      [payee1, payee2, payee3].map(async (a) => {
        const balance = await ethers.provider.getBalance(a.address);
        return balance;
      })
    );

    // Release funds for each payee
    await splitter.connect(payee1).release(payee1.address);
    await splitter.connect(payee2).release(payee2.address);
    await splitter.connect(payee3).release(payee3.address);

    const finalBalances = await Promise.all(
      [payee1, payee2, payee3].map(async (a) => {
        const balance = await ethers.provider.getBalance(a.address);
        return balance;
      })
    );

    // Calculate the differences and compare with expected amounts
    const diff1 = finalBalances[0] - initialBalances[0];
    const diff2 = finalBalances[1] - initialBalances[1];
    const diff3 = finalBalances[2] - initialBalances[2];

    // Convert expected amounts to BigInt for comparison
    const expectedAmount1 = ethers.parseEther("0.5");
    const expectedAmount2 = ethers.parseEther("0.3");
    const expectedAmount3 = ethers.parseEther("0.2");
    const tolerance = ethers.parseEther("0.01");

    // Compare using BigInt arithmetic
    expect(diff1).to.be.gte(expectedAmount1 - tolerance);
    expect(diff1).to.be.lte(expectedAmount1 + tolerance);
    
    expect(diff2).to.be.gte(expectedAmount2 - tolerance);
    expect(diff2).to.be.lte(expectedAmount2 + tolerance);
    
    expect(diff3).to.be.gte(expectedAmount3 - tolerance);
    expect(diff3).to.be.lte(expectedAmount3 + tolerance);
  });
});
