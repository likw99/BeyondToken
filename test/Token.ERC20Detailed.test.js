const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Token = artifacts.require("BeyondToken");

contract('Token', function() {
  const _name = "Beyond Token";
  const _symbol = "BYD";
  const _decimals = 18;

  beforeEach(async function() {
    this.token = await Token.new();
  });

  describe('token attributes', function() {
    it('has the correct name', async function() {
      (await this.token.name()).should.be.equal(_name);
    });
    it('has the correct symbol', async function() {
      (await this.token.symbol()).should.be.equal(_symbol);
    });
    it('has the correct decimals', async function() {
      (await this.token.decimals()).should.be.bignumber.equal(_decimals);
    });
  })
})
