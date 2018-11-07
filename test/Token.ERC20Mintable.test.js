const { shouldBehaveLikeERC20Mintable } = require('./behaviors/ERC20Mintable.behavior');
const { shouldBehaveLikePublicRole } = require('./behaviors/PublicRole.behavior');
const Token = artifacts.require('BeyondToken');

contract('Token', function ([_, minter, otherMinter, ...otherAccounts]) {
  beforeEach(async function () {
    this.token = await Token.new({ from: minter });
  });

  describe('minter role', function () {
    beforeEach(async function () {
      this.contract = this.token;
      await this.contract.addMinter(otherMinter, { from: minter });
    });

    shouldBehaveLikePublicRole(minter, otherMinter, otherAccounts, 'minter');
  });

  shouldBehaveLikeERC20Mintable(minter, otherAccounts);
});
