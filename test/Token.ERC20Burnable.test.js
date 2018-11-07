const { shouldBehaveLikeERC20Burnable } = require('./behaviors/ERC20Burnable.behavior');
const Token = artifacts.require('BeyondToken');
const BigNumber = web3.BigNumber;

contract('Token', function ([_, owner, ...otherAccounts]) {
  const initialBalance = new BigNumber(6e+9);
  const burnAmount = new BigNumber(1e+9); 

  beforeEach(async function () {
    this.token = await Token.new({ from: owner });
  });

  shouldBehaveLikeERC20Burnable(owner, initialBalance, burnAmount, otherAccounts);
});
