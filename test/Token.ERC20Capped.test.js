const shouldFail = require('./helpers/shouldFail');
const { ether } = require('./helpers/ether');
const { shouldBehaveLikeERC20Mintable } = require('./behaviors/ERC20Mintable.behavior');
const { shouldBehaveLikeERC20Capped } = require('./behaviors/ERC20Capped.behavior');

const Token = artifacts.require('BeyondToken');

contract('Token', function ([_, minter, ...otherAccounts]) {
  //const cap = ether(1000);
  //const cap = ether(10 ** 10);
  const cap = new web3.BigNumber(1e+10);

  /*
  it('requires a non-zero cap', async function () {
    await shouldFail.reverting(
      TKT.new(0, { from: minter })
    );
  });
  */

  context('once deployed', async function () {
    beforeEach(async function () {
      this.token = await Token.new({ from: minter });
    });

    shouldBehaveLikeERC20Capped(minter, otherAccounts, cap);
    shouldBehaveLikeERC20Mintable(minter, otherAccounts);
  });
});
