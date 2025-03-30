// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonProjectRegistry is Ownable {
    // Define a structure to store project details.
    struct Project {
        uint256 id;           // Unique project identifier.
        string name;          // Project name.
        string description;   // Brief description.
        string location;      // Project location.
        uint256 capacity;     // Capacity (e.g., tonnes of CO2 offset per year).
        bool verified;        // Whether the project is verified.
        string ipfsHash;      // Optional: IPFS hash for off-chain metadata.
    }

    // Mapping from project ID to its details.
    mapping(uint256 => Project) private projects;

    // Events for transparency.
    event ProjectAdded(uint256 indexed id, string name, string location, uint256 capacity, string ipfsHash);
    event ProjectUpdated(uint256 indexed id, string name, string description, string location, uint256 capacity, string ipfsHash);
    event VerifiedStatusSet(uint256 indexed id, bool verified);

    constructor() Ownable() {}

    /**
     * @notice Adds a new carbon offset project.
     * @dev Only the owner can add a project.
     * @param _id The unique identifier for the project.
     * @param _name The project name.
     * @param _description A short description.
     * @param _location The location of the project.
     * @param _capacity The capacity (e.g., tonnes of CO2 offset per year).
     * @param _ipfsHash The IPFS hash for off-chain metadata.
     */
    function addProject(
        uint256 _id,
        string calldata _name,
        string calldata _description,
        string calldata _location,
        uint256 _capacity,
        string calldata _ipfsHash
    ) external onlyOwner {
        require(projects[_id].id == 0, "Project already exists");
        projects[_id] = Project({
            id: _id,
            name: _name,
            description: _description,
            location: _location,
            capacity: _capacity,
            verified: false,
            ipfsHash: _ipfsHash
        });
        emit ProjectAdded(_id, _name, _location, _capacity, _ipfsHash);
    }

    /**
     * @notice Updates an existing project's details.
     * @dev Only the owner can update a project.
     */
    function updateProject(
        uint256 _id,
        string calldata _name,
        string calldata _description,
        string calldata _location,
        uint256 _capacity,
        string calldata _ipfsHash
    ) external onlyOwner {
        require(projects[_id].id != 0, "Project does not exist");
        projects[_id].name = _name;
        projects[_id].description = _description;
        projects[_id].location = _location;
        projects[_id].capacity = _capacity;
        projects[_id].ipfsHash = _ipfsHash;
        emit ProjectUpdated(_id, _name, _description, _location, _capacity, _ipfsHash);
    }

    /**
     * @notice Sets the verified status for a project.
     * @dev Only the owner can set the status.
     * @param _id The project identifier.
     * @param _verified The new verified status.
     */
    function setVerifiedStatus(uint256 _id, bool _verified) external onlyOwner {
        require(projects[_id].id != 0, "Project does not exist");
        projects[_id].verified = _verified;
        emit VerifiedStatusSet(_id, _verified);
    }

    /**
     * @notice Retrieves the details of a project.
     * @param _id The project identifier.
     * @return The Project struct for the given ID.
     */
    function getProject(uint256 _id) external view returns (Project memory) {
        require(projects[_id].id != 0, "Project does not exist");
        return projects[_id];
    }
}
