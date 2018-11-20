const shouldFail = require('../helpers/shouldFail');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeERC20Capped (minter, [anyone], cap) {
  describe('capped token', function () {
    const from = minter;
    const initialSupply = new BigNumber(1e+27);

    it('should start with the correct cap', async function () {
      (await this.token.cap()).should.be.bignumber.equal(cap);
    });

    it('should mint when amount is less than cap', async function () {
      await this.token.mint(anyone, 1, { from });
      (await this.token.totalSupply()).should.be.bignumber.equal(initialSupply.plus(1));
    });

    it('should fail to mint if the ammount exceeds the cap', async function () {
      await this.token.mint(anyone, cap.sub(initialSupply), { from });
      await shouldFail.reverting(this.token.mint(anyone, 100, { from }));
    });

    it('should fail to mint after cap is reached', async function () {
      await this.token.mint(anyone, cap.sub(initialSupply), { from });
      await shouldFail.reverting(this.token.mint(anyone, 1, { from }));
    });
  });
}

module.exports = {
  shouldBehaveLikeERC20Capped,
};
