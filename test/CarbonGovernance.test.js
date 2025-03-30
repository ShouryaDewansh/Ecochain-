const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonGovernance", function () {
  let governor;
  let token;
  let timelock;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy CarbonGovToken
    const CarbonGovToken = await ethers.getContractFactory("CarbonGovToken");
    token = await CarbonGovToken.deploy();
    await token.waitForDeployment();

    // Deploy CarbonTimelock
    const CarbonTimelock = await ethers.getContractFactory("CarbonTimelock");
    timelock = await CarbonTimelock.deploy(1, [], [], owner.address);
    await timelock.waitForDeployment();

    // Deploy CarbonGovernance
    const CarbonGovernance = await ethers.getContractFactory("CarbonGovernance");
    governor = await CarbonGovernance.deploy(await token.getAddress(), await timelock.getAddress());
    await governor.waitForDeployment();

    // Grant roles
    await timelock.grantRole(await timelock.PROPOSER_ROLE(), await governor.getAddress());
    await timelock.grantRole(await timelock.EXECUTOR_ROLE(), await governor.getAddress());
    await timelock.grantRole(await timelock.CANCELLER_ROLE(), await governor.getAddress());

    // Mint and delegate tokens
    await token.mint(addr1.address, ethers.parseEther("1000"));
    await token.mint(addr2.address, ethers.parseEther("1000"));
    await token.mint(addr3.address, ethers.parseEther("1000"));

    await token.connect(addr1).delegate(addr1.address);
    await token.connect(addr2).delegate(addr2.address);
    await token.connect(addr3).delegate(addr3.address);

    // Mine a block to ensure voting power is recorded
    await ethers.provider.send("evm_mine", []);
  });

  describe("Basic Setup", function () {
    it("Should have correct token address", async function () {
      expect(await governor.token()).to.equal(await token.getAddress());
    });

    it("Should have correct timelock address", async function () {
      expect(await governor.timelock()).to.equal(await timelock.getAddress());
    });

    it("Should have correct voting delay", async function () {
      expect(await governor.votingDelay()).to.equal(1);
    });

    it("Should have correct voting period", async function () {
      expect(await governor.votingPeriod()).to.equal(45818);
    });

    it("Should have correct proposal threshold", async function () {
      expect(await governor.proposalThreshold()).to.equal(1);
    });
  });

  describe("Proposal Creation", function () {
    it("Should create a proposal", async function () {
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("mint", [addr1.address, ethers.parseEther("100")])];
      const description = "Mint tokens";

      const tx = await governor.connect(addr1).propose(targets, values, calldatas, description);
      await expect(tx).to.emit(governor, "ProposalCreated");
    });

    it("Should not allow proposal creation without voting power", async function () {
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("mint", [addr1.address, ethers.parseEther("100")])];
      const description = "Mint tokens";

      // Create a new account that has never interacted with the token
      const [addr4] = await ethers.getSigners();
      
      // Get the current block number
      const blockNumber = await ethers.provider.getBlockNumber();
      
      // Check voting power at previous block
      const votingPower = await token.getPastVotes(addr4.address, blockNumber - 1);
      expect(votingPower).to.equal(0);

      // Try to create a proposal with an account that has no voting power
      await expect(
        governor.connect(addr4).propose(targets, values, calldatas, description)
      ).to.be.revertedWith("Governor: proposer votes below proposal threshold");
    });
  });

  describe("Voting", function () {
    let proposalId;

    beforeEach(async function () {
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("mint", [addr1.address, ethers.parseEther("100")])];
      const description = "Mint tokens";

      const tx = await governor.connect(addr1).propose(targets, values, calldatas, description);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return governor.interface.parseLog(log).name === "ProposalCreated";
        } catch (e) {
          return false;
        }
      });
      proposalId = governor.interface.parseLog(event).args.proposalId;
    });

    it("Should allow voting", async function () {
      // Wait for voting to be active
      await ethers.provider.send("evm_mine", []);
      await ethers.provider.send("evm_mine", []);

      await expect(governor.connect(addr1).castVote(proposalId, 1))
        .to.emit(governor, "VoteCast");
    });

    it("Should track votes correctly", async function () {
      // Wait for voting to be active
      await ethers.provider.send("evm_mine", []);
      await ethers.provider.send("evm_mine", []);

      await governor.connect(addr1).castVote(proposalId, 1);
      await governor.connect(addr2).castVote(proposalId, 1);
      await governor.connect(addr3).castVote(proposalId, 0);

      // Get proposal votes
      const proposalVotes = await governor.proposalVotes(proposalId);
      expect(proposalVotes.forVotes).to.equal(ethers.parseEther("2000"));
      expect(proposalVotes.againstVotes).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("Proposal State", function () {
    let proposalId;

    beforeEach(async function () {
      const targets = [await token.getAddress()];
      const values = [0];
      const calldatas = [token.interface.encodeFunctionData("mint", [addr1.address, ethers.parseEther("100")])];
      const description = "Mint tokens";

      const tx = await governor.connect(addr1).propose(targets, values, calldatas, description);
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return governor.interface.parseLog(log).name === "ProposalCreated";
        } catch (e) {
          return false;
        }
      });
      proposalId = governor.interface.parseLog(event).args.proposalId;
    });

    it("Should start in Pending state", async function () {
      const state = await governor.state(proposalId);
      expect(state).to.equal(0); // Pending
    });

    it("Should move to Active state after voting delay", async function () {
      // Wait for voting delay
      await ethers.provider.send("evm_mine", []);
      await ethers.provider.send("evm_mine", []);
      
      const state = await governor.state(proposalId);
      expect(state).to.equal(1); // Active
    });

    it("Should move to Succeeded state after voting period", async function () {
      // Wait for voting period
      for (let i = 0; i < 45820; i++) {
        await ethers.provider.send("evm_mine", []);
      }
      
      const state = await governor.state(proposalId);
      expect(state).to.equal(3); // Succeeded
    });
  });
}); 