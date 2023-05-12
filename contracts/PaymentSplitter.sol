// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract PaymentSplitter {
    address payable[] public recipients;
    uint[] public amounts;
    address payable public defaultRecipient;
    
    constructor() {}
    
    receive() external payable {
        require(defaultRecipient != address(0), "PaymentSplitter: Default recipient not initialized.");
        require(recipients.length == amounts.length && recipients.length > 0, "PaymentSplitter: Recipients and amounts not initialized.");
        require(address(this).balance >= getTotalAmount(), "PaymentSplitter: Insufficient balance to pay all recipients.");
        
        for (uint i = 0; i < recipients.length; i++) {
            require(amounts[i] > 0, "PaymentSplitter: Amount is too small to send.");
            recipients[i].transfer(amounts[i]);
        }
        
        uint remainder = address(this).balance;
        if (remainder > 0) {
            defaultRecipient.transfer(remainder);
        }
    }
    
    function getTotalAmount() public view returns (uint) {
        uint totalAmount = 0;
        for (uint i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        return totalAmount;
    }
    
    function setRecipientsAndAmounts(address payable[] memory _recipients, uint[] memory _amounts) public {
        require(_recipients.length == _amounts.length, "PaymentSplitter: Unequal array lengths");
        recipients = _recipients;
        amounts = _amounts;
    }
    
    function setDefaultRecipient(address payable _defaultRecipient) public {
        require(_defaultRecipient != address(0), "PaymentSplitter: Default recipient cannot be zero address");
        defaultRecipient = _defaultRecipient;
    }
}
