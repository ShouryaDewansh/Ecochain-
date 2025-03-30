// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract CarbonPaymentSplitter is PaymentSplitter {
    /**
     * @notice Constructor that initializes the PaymentSplitter with the list of payees and their shares.
     * @param payees An array of addresses to receive funds.
     * @param shares_ An array of shares corresponding to each payee.
     */
    constructor(address[] memory payees, uint256[] memory shares_) 
        PaymentSplitter(payees, shares_) 
    {}
}
