// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditMarketplace is Ownable {
    struct Listing {
        address seller;
        uint256 price;
    }

    // Mapping: for each NFT contract and tokenId, store its listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    constructor() Ownable() {}

    // List an NFT for sale.
    function listNFT(
        address tokenAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than zero");

        IERC721 token = IERC721(tokenAddress);
        require(token.ownerOf(tokenId) == msg.sender, "You must own the NFT");
        require(
            token.isApprovedForAll(msg.sender, address(this)) ||
            token.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[tokenAddress][tokenId] = Listing(msg.sender, price);
    }

    // Buy a listed NFT by sending the exact ETH amount.
    function buyNFT(address tokenAddress, uint256 tokenId) external payable {
        Listing memory item = listings[tokenAddress][tokenId];
        require(item.price > 0, "This NFT is not for sale");
        require(msg.value == item.price, "Incorrect ETH amount");

        // Remove the listing to prevent reentrancy.
        delete listings[tokenAddress][tokenId];

        // Transfer ETH to the seller.
        payable(item.seller).transfer(msg.value);

        // Transfer the NFT from the seller to the buyer.
        IERC721(tokenAddress).safeTransferFrom(item.seller, msg.sender, tokenId);
    }

    // Get details of a specific NFT listing.
    function getListing(address tokenAddress, uint256 tokenId) external view returns (address seller, uint256 price) {
        Listing memory item = listings[tokenAddress][tokenId];
        return (item.seller, item.price);
    }
}
