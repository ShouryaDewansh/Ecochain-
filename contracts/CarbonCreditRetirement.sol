// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditRetirement is Ownable, IERC721Receiver {
    mapping(address => mapping(uint256 => bool)) public retired;

    event CreditRetired(address indexed tokenAddress, uint256 indexed tokenId, address indexed owner);

    /// @notice Retire a carbon credit NFT by transferring it into this contract
    function retire(address tokenAddress, uint256 tokenId) external {
        IERC721 token = IERC721(tokenAddress);
        require(!retired[tokenAddress][tokenId], "Already retired");
        require(token.ownerOf(tokenId) == msg.sender, "Not owner");

        // Transfer NFT to this contract
        token.safeTransferFrom(msg.sender, address(this), tokenId);
        retired[tokenAddress][tokenId] = true;

        emit CreditRetired(tokenAddress, tokenId, msg.sender);
    }

    /// @notice Check retirement status
    function isRetired(address tokenAddress, uint256 tokenId) external view returns (bool) {
        return retired[tokenAddress][tokenId];
    }

    /// @notice Required function for IERC721Receiver
    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
