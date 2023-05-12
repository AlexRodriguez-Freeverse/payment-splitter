const { assert } = require('chai');

require('chai')
  .use(require('chai-as-promised'))
  .should();

// eslint-disable-next-line no-undef
const PaymentSplitter = artifacts.require('PaymentSplitter');

// eslint-disable-next-line no-undef
contract('PaymentSplitter', (accounts) => {
  // eslint-disable-next-line no-unused-vars
  const [deployer] = accounts;

  // Replace with the rewarded web3address
  const recipient1 = "0x1e3553d82b4cF3aF5FAb4C4208FD85cFb41b7d40";
  const recipient2 = "0xaacFC2bFd84602dA4AB9dd58c6fC98c729FCf897";

  // Default account to send the rest
  const defaultRecipient = "0xbb37Af6BA34Fd679C985284C29c6610dC8AbAedD";

  let paymentSplitter;

  beforeEach(async () => {
    paymentSplitter = await PaymentSplitter.new().should.be.fulfilled;
  });

  it("should split the amounts accordingly across the recipients", async () => {
    const recipients = [recipient1, recipient2];
    const amounts = [5, 10];
    const amountToSend = 20;

    // Get the previous balances to compare at the end of the execution
    const initialBalances = [
        await web3.eth.getBalance(recipients[0]), 
        await web3.eth.getBalance(recipients[1])
    ];
    const initialBalanceDefault = await web3.eth.getBalance(defaultRecipient);

    await paymentSplitter.setRecipientsAndAmounts(recipients, amounts);
    await paymentSplitter.setDefaultRecipient(defaultRecipient);

    await paymentSplitter.send(amountToSend, { from: deployer });

    assert.equal(await web3.eth.getBalance(recipients[0]), web3.utils.toBN(initialBalances[0]).add(web3.utils.toBN(amounts[0])).toString());
    assert.equal(await web3.eth.getBalance(recipients[1]), web3.utils.toBN(initialBalances[1]).add(web3.utils.toBN(amounts[1])).toString());
    assert.equal(await web3.eth.getBalance(defaultRecipient), web3.utils.toBN(initialBalanceDefault).add(web3.utils.toBN(amountToSend - amounts[0] - amounts[1])).toString());
  });
});
