const { assert } = require('chai');

const TokenFarm = artifacts.require("TokenFarm")
const DaiToken = artifacts.require("DaiToken")
const DappToken = artifacts.require("DappToken")

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () => {
        //Load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        //transfer all Dapp tokens to farm (1M)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))


        await daiToken.transfer(investor, tokens('100'), { from: owner })
    })

    describe('Mock DAI deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })
        it('contract has tokens', async () => {
            const balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming Tokens', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result;
            //Check investor balance before staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock Dai wallet balance correct before staking')

            //Stake Mock Dai Tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            await tokenFarm.stakeTokens(tokens('100'), { from: investor })

            //Checking staking result
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), "Investor Mock Dai wallet balance correct after staking");

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), "Token Farm Mock Dai balance correct after staking");

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), "investor staking balance correct after staking");

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', "investor staking status correct after staking");

            //Issue Tokens
            await tokenFarm.issueTokens({from: owner})

            //Check balances after issuance
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance')

            //Ensure that only owner can issue tokens
            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            //  Unstake tokens
            await tokenFarm.unstakeTokens({from: investor})

            //Check results after unstaking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')

        })
    })
})