const Token = artifacts.require('BeyondToken');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Token', function (accounts) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  const initialSupply = new BigNumber(1e+27);
  const transferAmount = new BigNumber(1e+18);

  beforeEach(async function () {
    this.token = await Token.new();
  });

  describe('total supply', function () {
    it('returns the total amount of tokens', async function () {
      (await this.token.totalSupply()).should.be.bignumber.equal(initialSupply);
    });
  });

  describe('balanceOf', function () {
    describe('when the requested account has no tokens', function () {
      it('returns zero', async function () {
        (await this.token.balanceOf(accounts[1])).should.be.bignumber.equal(0);
      });
    });

    describe('when the requested account has some tokens', function () {
      it('returns the total amount of tokens', async function () {
        (await this.token.balanceOf(accounts[0])).should.be.bignumber.equal(initialSupply);
      });
    });
  });

  describe('transfer', function () {
    describe('when the recipient is not the zero address', function () {
      it('transfers the requested amount', async function () {
        await this.token.transfer(accounts[1], transferAmount, { from: accounts[0] });
        (await this.token.balanceOf(accounts[0])).should.be.bignumber.equal(initialSupply.minus(transferAmount));
        (await this.token.balanceOf(accounts[1])).should.be.bignumber.equal(transferAmount);
      });
    });
  });
});

