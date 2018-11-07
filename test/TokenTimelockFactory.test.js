const expectEvent = require('./helpers/expectEvent');
const shouldFail = require('./helpers/shouldFail');
const time = require('./helpers/time');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Token = artifacts.require('BeyondToken');
const TokenTimelock = artifacts.require("TokenTimelock");
const TokenTimelockFactory = artifacts.require("TokenTimelockFactory");

contract('TokenTimelockFactory', function (accounts) {
    const incentive = new BigNumber(10000);
    const amount = new BigNumber(100);

    context('factory contract init', function () {
        beforeEach(async function () {
            this.tokenMgr = accounts[2];
            this.beneficiary = accounts[9];
            this.token = await Token.new();
            this.tokentimelockFactory = await TokenTimelockFactory.new();
            await this.token.mint(this.tokenMgr, incentive);
        });
        it("has the correct init state", async function () {
            (await this.token.balanceOf(this.tokenMgr)).should.be.bignumber.equal(incentive);
            (await this.token.balanceOf(this.beneficiary)).should.be.bignumber.equal(0);
        });
        context("tokentimelock creation", function () {
            beforeEach(async function () {
                this.releaseTime = (await time.latest()) + time.duration.hours(1);
                ({ logs: this.logs } = await this.tokentimelockFactory.createTokenTimelock(
                    this.token.address, this.beneficiary, this.releaseTime
                ));
                this.event = expectEvent.inLogs(this.logs, 'walletCreated');
                this.wallet = this.event.args.wallet;
                this.timelock = await TokenTimelock.at(this.wallet);
            });
            it("emit the correct event", async function() {
                expectEvent.inLogs(this.logs, 'walletCreated', {from: accounts[0], to: this.beneficiary});
            });
            it("generate an empty wallet", async function() {
                (await this.token.balanceOf(this.wallet)).should.be.bignumber.equal(0);
            });
            it('can get state', async function () {
                (await this.timelock.token()).should.be.equal(this.token.address);
                (await this.timelock.beneficiary()).should.be.equal(this.beneficiary);
                (await this.timelock.releaseTime()).should.be.bignumber.equal(this.releaseTime);
            });

            context("transfer tokens to tokentimelock", async function() {
                beforeEach(async function () {
                    this.token.transfer(this.wallet, amount, { from: this.tokenMgr });
                });
                it("transfer the correct amount", async function() {
                    (await this.token.balanceOf(this.tokenMgr)).should.be.bignumber.equal(incentive-amount);
                    (await this.token.balanceOf(this.wallet)).should.be.bignumber.equal(amount);
                });
                it("cannot be released before time limit", async function() {
                    await shouldFail.reverting(this.timelock.release());
                });
                it("cannot be released just before time limit", async function() {
                    await time.increaseTo(this.releaseTime - time.duration.seconds(3));
                    await shouldFail.reverting(this.timelock.release());
                });
                it("can be released just after time limit", async function () {
                    await time.increaseTo(this.releaseTime + time.duration.seconds(3));
                    await this.timelock.release();
                    (await this.token.balanceOf(this.beneficiary)).should.be.bignumber.equal(amount);
                });
                it("can be released after time limit", async function () {
                    await time.increaseTo(this.releaseTime + time.duration.years(1));
                    await this.timelock.release();
                    (await this.token.balanceOf(this.beneficiary)).should.be.bignumber.equal(amount);
                });
                it("can be released with multiple transfers", async function () {
                    await this.token.transfer(this.wallet, amount, { from: this.tokenMgr });
                    await time.increaseTo(this.releaseTime + time.duration.seconds(3));
                    await this.timelock.release();
                    (await this.token.balanceOf(this.beneficiary)).should.be.bignumber.equal(2 * amount);
                });
            });
        });
    });
});
