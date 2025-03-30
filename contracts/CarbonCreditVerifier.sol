// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditVerifier is Ownable {
    struct Verification {
        bool verified;
        string verificationMethod;
        uint256 verificationDate;
        address verifier;
    }

    mapping(uint256 => Verification) public verifications;

    constructor() Ownable() {}

    function verifyCarbonCredit(
        uint256 tokenId,
        string memory verificationMethod
    ) external onlyOwner {
        verifications[tokenId] = Verification({
            verified: true,
            verificationMethod: verificationMethod,
            verificationDate: block.timestamp,
            verifier: msg.sender
        });
    }

    function getVerification(uint256 tokenId) external view returns (Verification memory) {
        return verifications[tokenId];
    }
}
