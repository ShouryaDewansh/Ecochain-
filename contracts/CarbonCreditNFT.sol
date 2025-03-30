// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    mapping(uint256 => uint256) public carbonAmounts;

    constructor() ERC721("CarbonCredit", "CCNFT") Ownable() {}

    function mint(address to, uint256 amount) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(to, newTokenId);
        carbonAmounts[newTokenId] = amount;
        return newTokenId;
    }

    function getCarbonAmount(uint256 tokenId) external view returns (uint256) {
        return carbonAmounts[tokenId];
    }
}
