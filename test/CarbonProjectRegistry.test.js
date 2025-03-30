const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonProjectRegistry", function () {
  let registry, owner;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const Registry = await ethers.getContractFactory("CarbonProjectRegistry");
    registry = await Registry.deploy();
    await registry.waitForDeployment();
  });

  it("should add a new project", async () => {
    const projectId = 1;
    const name = "Test Project";
    const description = "Test Description";
    const location = "Test Location";
    const capacity = 1000;
    const ipfsHash = "QmTest";

    await registry.connect(owner).addProject(
      projectId,
      name,
      description,
      location,
      capacity,
      ipfsHash
    );

    const project = await registry.getProject(projectId);
    expect(project.id).to.equal(projectId);
    expect(project.name).to.equal(name);
    expect(project.description).to.equal(description);
    expect(project.location).to.equal(location);
    expect(project.capacity).to.equal(capacity);
    expect(project.verified).to.be.false;
    expect(project.ipfsHash).to.equal(ipfsHash);
  });

  describe("updateProject", function () {
    beforeEach(async () => {
      await registry.addProject(
        2,
        "Project Two",
        "Desc Two",
        "Loc Two",
        50,
        "QmHash2"
      );
    });

    it("should update an existing project's details", async () => {
      await registry.updateProject(
        2,
        "Project Two Updated",
        "New Desc",
        "New Loc",
        75,
        "QmHash2New"
      );
      const project = await registry.getProject(2);
      expect(project.name).to.equal("Project Two Updated");
      expect(project.description).to.equal("New Desc");
      expect(project.location).to.equal("New Loc");
      expect(project.capacity).to.equal(75);
      expect(project.ipfsHash).to.equal("QmHash2New");
    });

    it("should revert when updating a non-existent project", async () => {
      await expect(
        registry.updateProject(
          999,
          "No Project",
          "Desc",
          "Loc",
          10,
          "QmHash"
        )
      ).to.be.revertedWith("Project does not exist");
    });
  });

  describe("setVerifiedStatus", function () {
    beforeEach(async () => {
      await registry.addProject(
        3,
        "Project Three",
        "Desc Three",
        "Loc Three",
        150,
        "QmHash3"
      );
    });

    it("should set the verified status", async () => {
      await registry.setVerifiedStatus(3, true);
      const project = await registry.getProject(3);
      expect(project.verified).to.equal(true);
    });

    it("should revert when setting verified status for a non-existent project", async () => {
      await expect(registry.setVerifiedStatus(999, true)).to.be.revertedWith("Project does not exist");
    });
  });
});
