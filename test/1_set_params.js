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

  const recipient1 = "0x31B36dd2894Be872c584cD21C6668D7a9a4D7d8E";
  const recipient2 = "0x28D9c98fd5F640F21176d91B73a4e5a7c6190748";
  const defaultRecipient = "0xf8E57875E36557A1f4861b6664873c14582669E7";

  let paymentSplitter;

  beforeEach(async () => {
    paymentSplitter = await PaymentSplitter.new().should.be.fulfilled;
  });

  it("should set recipients and amounts", async () => {
    const recipients = [recipient1, recipient2];
    const amounts = [100, 200];

    await paymentSplitter.setRecipientsAndAmounts(recipients, amounts);

    assert.equal(await paymentSplitter.recipients(0), recipients[0]);
    assert.equal(await paymentSplitter.recipients(1), recipients[1]);
    assert.equal(await paymentSplitter.amounts(0), amounts[0]);
    assert.equal(await paymentSplitter.amounts(1), amounts[1]);
  });

  it("should set default recipient", async () => {
    await paymentSplitter.setDefaultRecipient(defaultRecipient);

    assert.equal(await paymentSplitter.defaultRecipient(), defaultRecipient);
  });
});
