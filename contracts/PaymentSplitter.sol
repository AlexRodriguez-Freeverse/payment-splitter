// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract PaymentSplitter {
    // Split the received payment among the recipients
    // The recipients and amounts are provided as parameters everytime UPlay wants to share the commissions among the referrals
    // Note that the default address to get the rest of the payments should be included in the recipients
    // TODO: Check if the caller is allowed to do this
    function receiveAndSplit(address payable[] memory _recipients, uint[] memory _amounts) external payable {
        // Ensure that the recipients and amounts are initialized and have equal lengths
        require(_recipients.length == _amounts.length && _recipients.length > 0, "PaymentSplitter: Recipients and amounts not initialized.");

        // Ensure that the received amount matches the total amount to be distributed
        require(msg.value == getTotalAmount(_amounts), "PaymentSplitter: Incorrect payment amount.");

        // Iterate through the recipients and transfer the corresponding amounts
        for (uint i = 0; i < _recipients.length; i++) {
            // Ensure that the amount is greater than zero.
            // TODO: Check if it is a real problem
            require(_amounts[i] > 0, "PaymentSplitter: Amount is too small to send.");
            _recipients[i].transfer(_amounts[i]);
        }
    }
    
    // Calculate the total amount from an array of amounts
    function getTotalAmount(uint[] memory _amounts) internal pure returns (uint) {
        uint totalAmount = 0;
        for (uint i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }
        return totalAmount;
    }
}
