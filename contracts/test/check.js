const assert = require("assert")
const { expect } = require("chai")
const BN = require('bignumber.js')

const { advanceTime, advanceBlock, takeSnapshot, revertToSnapShot, advanceTimeAndBlock } = require("./lib/utils.js");
const { maxUint256, addressZero } = require('../scripts/lib/const')
const { deployContract } = require('../scripts/lib/deploy')

describe("Arbetrum", function () {
    BN.config({
        EXPONENTIAL_AT: [-10, 64]
    })
    
    let errorMessages = {
        setFee: 'SetFeeError',
        alreadySet: 'Already Set',
        setDevFee: 'Dev Fee <= 100% Of Total Fee'
    }

    const BN2Decimal = function (t, decimal) {
        if (decimal === undefined) decimal = 18
        return BN(t.toString()).div(BN(`1e${decimal}`)).toString()
    }
    
    const T2B = function (t, decimal) {
        if (decimal === undefined) decimal = 18
        return BN(t).times(BN(`1e${decimal}`)).integerValue().toString()
    }

    let accounts

    before("", async function() {
        accounts = await hre.ethers.getSigners()
    })
    
    describe("Arbet", () => {
        let tokenContract
        let usdtContract
        let routerContract
        let wethAddress

        before("", async function () {
            let wbnbInfo = await deployContract("WBNB")
            let factoryInfo = await deployContract("PancakeFactory", accounts[1].address)
            let routerInfo = await deployContract("PancakeRouter", factoryInfo.imple, wbnbInfo.imple)
            let usdtInfo = await deployContract("MockUSDT")

            let shinoInfo = await deployContract("ASHINO", routerInfo.imple, "Shiba Casino", "SHINO")

            const SHINO = await hre.ethers.getContractFactory("SHINO")
            tokenContract = await SHINO.attach(shinoInfo.imple)

            const MockUSDT = await hre.ethers.getContractFactory("MockUSDT")
            usdtContract = await MockUSDT.attach(usdtInfo.imple)

            const PancakeRouter = await hre.ethers.getContractFactory("PancakeRouter")
            routerContract = await PancakeRouter.attach(routerInfo.imple)

            wethAddress = wbnbInfo.imple
        })

        it("Adding to the liquidity", async function () {
            await tokenContract.approve(routerContract.address, maxUint256)
            await routerContract.addLiquidityETH(tokenContract.address, T2B("200000"), 0, 0, addressZero, '0xffffffff', { value: hre.ethers.utils.parseEther('1') })
        })

        it("buy fee", async function () {
            await tokenContract.enableTrading()

            // anti snipe for 5 blocks
            await advanceBlock()
            await advanceBlock()

            const sid = await takeSnapshot()

            console.log('- fee excluded')
            const a1 = await tokenContract.balanceOf(accounts[0].address)
            console.log('account0', BN2Decimal(a1))
            const b1 = await tokenContract.balanceOf(tokenContract.address)
            await routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(0, [wethAddress, tokenContract.address], accounts[0].address, '0xffffffff', { value: hre.ethers.utils.parseEther('0.01') })
            const b2 = await tokenContract.balanceOf(tokenContract.address)

            console.log('token', BN2Decimal(await tokenContract.balanceOf(tokenContract.address)))
            const a2 = await tokenContract.balanceOf(accounts[0].address)
            console.log('account0', BN2Decimal(await tokenContract.balanceOf(accounts[0].address)))

            assert(BN(b2.toString()).minus(BN(b1.toString())).div(99).integerValue().plus(1).eq(BN(a2.toString()).minus(BN(a1.toString()))), "99% buy fee in first 5 blocks right after LP add")

            console.log('- fee included')
            let oldAB1 = await tokenContract.balanceOf(accounts[1].address)
            console.log('account1', BN2Decimal(oldAB1))

            let oldtrB = await tokenContract.balanceOf(tokenContract.address)
            await routerContract.connect(accounts[1]).swapExactETHForTokensSupportingFeeOnTransferTokens(0, [wethAddress, tokenContract.address], accounts[1].address, '0xffffffff', { value: hre.ethers.utils.parseEther('0.01') })

            let newtrB = await tokenContract.balanceOf(tokenContract.address)
            console.log('token', BN2Decimal(newtrB))
            let newAB1 = await tokenContract.balanceOf(accounts[1].address)
            console.log('account1', BN2Decimal(newAB1))

            console.log(BN(newAB1.toString()).minus(oldAB1.toString()).div(95).times(5).integerValue(1).toString(), BN(newtrB.toString()).minus(BN(oldtrB.toString())).toString())
            assert(BN(newAB1.toString()).minus(oldAB1.toString()).div(95).times(5).integerValue(1).eq(BN(newtrB.toString()).minus(BN(oldtrB.toString()))), "Buy Fee 5%")

            await revertToSnapShot(sid)
        })

        it("sell fee", async function () {
            const sid = await takeSnapshot()

            console.log('- fee excluded')
            console.log('account0', BN2Decimal(await tokenContract.balanceOf(accounts[0].address)))
            await tokenContract.approve(routerContract.address, maxUint256)
            await routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens(T2B('3000'), 0, [tokenContract.address, wethAddress], accounts[0].address, '0xffffffff')

            console.log('token', BN2Decimal(await tokenContract.balanceOf(tokenContract.address)))
            console.log('account0', BN2Decimal(await tokenContract.balanceOf(accounts[0].address)))

            await tokenContract.transfer(accounts[1].address, T2B('3000'))

            console.log('- fee included')
            let oldAB1 = await tokenContract.balanceOf(accounts[1].address)
            console.log('account1', BN2Decimal(oldAB1))
            await tokenContract.connect(accounts[1]).approve(routerContract.address, maxUint256)
            await routerContract.connect(accounts[1]).swapExactTokensForETHSupportingFeeOnTransferTokens(T2B('3000'), 0, [tokenContract.address, wethAddress], accounts[1].address, '0xffffffff')

            let trB = await tokenContract.balanceOf(tokenContract.address)
            console.log('token', BN2Decimal(trB))
            let newAB1 = await tokenContract.balanceOf(accounts[1].address)
            console.log('account1', BN2Decimal(newAB1))

            assert(BN(oldAB1.toString()).minus(BN(newAB1.toString())).div(100).times(5).integerValue(1).eq(BN(trB.toString())), "Sell Fee 5%")

            await revertToSnapShot(sid)
        })
    })

    describe("sArbet", function () {
        let tokenContract
        let sArbetContract
        let usdtContract

        before("", async function () {
            const wbnbInfo = await deployContract("WBNB")
            const factoryInfo = await deployContract("PancakeFactory", accounts[1].address)
            const routerInfo = await deployContract("PancakeRouter", factoryInfo.imple, wbnbInfo.imple)

            const usdtInfo = await deployContract("MockUSDT")
            const shinoInfo = await deployContract("SHINO", routerInfo.imple, "Shiba Casino", "SHINO")
            const sArbetInfo = await deployContract("sArbet", shinoInfo.imple, usdtInfo.imple, "Staked Arbet", "sArbet")

            const SHINO = await hre.ethers.getContractFactory("SHINO")
            tokenContract = await SHINO.attach(shinoInfo.imple)

            const sArbet = await hre.ethers.getContractFactory("sArbet")
            sArbetContract = await sArbet.attach(sArbetInfo.imple)

            const MockUSDT = await hre.ethers.getContractFactory("MockUSDT")
            usdtContract = await MockUSDT.attach(usdtInfo.imple)
        })

        it("distribute token", async function () {
            let i
            for (i = 1; i < 10; i++) {
                await tokenContract.transfer(accounts[i].address, T2B('10000'))
            }
        })

        it("deposit/withdraw", async function () {
            const user1 = accounts[1]
            const user2 = accounts[2]

            await tokenContract.enableTrading()

            await sArbetContract.updateProvider(accounts[0].address, true)

            await usdtContract.approve(sArbetContract.address, maxUint256)
            await sArbetContract.addReward(T2B('10'))
            console.log('added 10 reward but staked 0, so it is added to temp storage')

            await tokenContract.connect(user1).approve(sArbetContract.address, maxUint256)
            await sArbetContract.connect(user1).stake(T2B('100'))
            console.log('user1 staked 100')

            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))), 0, "reward 0 after firstly staked, staked 100/100 but no peding reward")

            await sArbetContract.addReward(T2B('20'))
            console.log('added 20, user1 staked, so total reward 30')
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))), 30, "reward 30 after firstly staked, staked 100/100 so 30 peding reward")

            await sArbetContract.addReward(T2B('30'))
            console.log('added 30, so total reward 60')
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))), 60, "reward 60 after firstly staked, staked 100/100 so 60 peding reward")

            await tokenContract.connect(user2).approve(sArbetContract.address, maxUint256)
            await sArbetContract.connect(user2).stake(T2B('200'))
            console.log('user2 staked 200, user1 staked 100, total staked 300')

            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))), 60, "reward 60, user1 staked 100/300, user2 staked 200/300, so user1 has 60 pending reward")
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user2.address))), 0, "reward 60, user1 staked 100/300, user2 staked 200/300, so user2 has no pending reward")

            await sArbetContract.connect(user1).stake(T2B('200'))
            console.log('user1 staked 200 again, he harvested pending reward 60')

            console.log('not added reward after user1 and user2 staked')
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))), 0, "user1 no pending reward")
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user2.address))), 0, "user2 no pending reward")

            await sArbetContract.addReward(T2B('30'))
            console.log('user1 staked 300, user2 staked 200 so far')
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))), 18, "user1 30 * 300 / (300 + 200) pending reward")
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user2.address))), 12, "user2 30 * 200 / (300 + 200) pending reward")

            await sArbetContract.connect(user1).unstake(T2B('280'))
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))), 0, "user1 no pending reward")
            assert.strictEqual(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user2.address))), 12, "user2 30 * 200 / (300 + 200) pending reward")

            await sArbetContract.addReward(T2B('10'))
            console.log('added 10 reward')

            assert(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user1.address))) > 0.909090909, "user1 10 * 20 / (20 + 200) pending reward")
            assert(parseFloat(BN2Decimal(await sArbetContract.getPendingReward(user2.address))) > 12 + 9.09090909, "user2 30 * 200 / (300 + 200) + 10 * 200 / (20 + 200) pending reward")

            console.log('user1:', 'pending', BN2Decimal(await sArbetContract.getPendingReward(user1.address)), 'earned', BN2Decimal(await sArbetContract.getEarningsClaimedByAccount(user1.address)), 'deposited', BN2Decimal(await sArbetContract.getDepositedAmount(user1.address)))
            console.log('user2:', 'pending', BN2Decimal(await sArbetContract.getPendingReward(user2.address)), 'earned', BN2Decimal(await sArbetContract.getEarningsClaimedByAccount(user2.address)), 'deposited', BN2Decimal(await sArbetContract.getDepositedAmount(user2.address)))

            await sArbetContract.connect(user1).claimReward()
            console.log('user2 usdt', BN2Decimal(await usdtContract.balanceOf(user2.address)))
            await sArbetContract.connect(user2).claimReward()
            console.log('user2 usdt', BN2Decimal(await usdtContract.balanceOf(user2.address)))

            console.log('user1:', 'pending', BN2Decimal(await sArbetContract.getPendingReward(user1.address)), 'earned', BN2Decimal(await sArbetContract.getEarningsClaimedByAccount(user1.address)), 'deposited', BN2Decimal(await sArbetContract.getDepositedAmount(user1.address)))
            console.log('user2:', 'pending', BN2Decimal(await sArbetContract.getPendingReward(user2.address)), 'earned', BN2Decimal(await sArbetContract.getEarningsClaimedByAccount(user2.address)), 'deposited', BN2Decimal(await sArbetContract.getDepositedAmount(user2.address)))
        })
    })

    describe("USDTVault", function () {
        let tokenContract
        let sArbetContract
        let usdtContract
        let vaultContract

        before("", async function () {
            const wbnbInfo = await deployContract("WBNB")
            const factoryInfo = await deployContract("PancakeFactory", accounts[1].address)
            const routerInfo = await deployContract("PancakeRouter", factoryInfo.imple, wbnbInfo.imple)

            const usdtInfo = await deployContract("MockUSDT")
            const shinoInfo = await deployContract("SHINO", routerInfo.imple, "Shiba Casino", "SHINO")
            const sArbetInfo = await deployContract("sArbet", shinoInfo.imple, usdtInfo.imple, "Staked Arbet", "sArbet")
            const vaultInfo = await deployContract("USDTVault", usdtInfo.imple, sArbetInfo.imple)

            const SHINO = await hre.ethers.getContractFactory("SHINO")
            tokenContract = await SHINO.attach(shinoInfo.imple)

            const sArbet = await hre.ethers.getContractFactory("sArbet")
            sArbetContract = await sArbet.attach(sArbetInfo.imple)

            const MockUSDT = await hre.ethers.getContractFactory("MockUSDT")
            usdtContract = await MockUSDT.attach(usdtInfo.imple)

            const USDTVault = await hre.ethers.getContractFactory("USDTVault")
            vaultContract = await USDTVault.attach(vaultInfo.imple)
        })

        it("distribute USDT, Arbet", async function () {
            let i
            for (i = 1; i < 10; i++) {
                await usdtContract.transfer(accounts[i].address, T2B('10000'))
                await tokenContract.transfer(accounts[i].address, T2B('10000'))
            }
        })

        it("stake to sArbet, deposit to USDTVault", async function () {
            const user1 = accounts[1]
            const user2 = accounts[2]

            await tokenContract.enableTrading()

            await sArbetContract.updateProvider(vaultContract.address, true)

            await tokenContract.connect(user1).approve(sArbetContract.address, maxUint256)
            await sArbetContract.connect(user1).stake(T2B('100'))
            console.log('user1 staked 100 to sArbet')

            await tokenContract.connect(user2).approve(sArbetContract.address, maxUint256)
            await sArbetContract.connect(user2).stake(T2B('300'))
            console.log('user2 staked 300 to sArbet')

            await usdtContract.connect(user1).approve(vaultContract.address, maxUint256)
            await vaultContract.connect(user1).depositUSDT(T2B('10'))
            console.log('user1 deposited 10$')

            await usdtContract.connect(user2).approve(vaultContract.address, maxUint256)
            await vaultContract.connect(user2).depositUSDT(T2B('30'))
            console.log('user2 deposited 30$')

            console.log('vault USDT:', BN2Decimal(await usdtContract.balanceOf(vaultContract.address)))
            console.log('sArbet USDT:', BN2Decimal(await usdtContract.balanceOf(sArbetContract.address)))

            console.log('vault total', BN2Decimal(await vaultContract.totalSupply()))
            console.log('sArbet total', BN2Decimal(await sArbetContract.totalSupply()))

            const u1 = BN2Decimal(await vaultContract.balanceOf(user1.address))
            const u2 = BN2Decimal(await vaultContract.balanceOf(user2.address))
            const s = BN2Decimal(await usdtContract.balanceOf(sArbetContract.address))
            const v = BN2Decimal(await usdtContract.balanceOf(vaultContract.address))

            assert(BN(u1).plus(BN(u2)).div(99).times(0.6).eq(BN(s)), "1% fee of usdt vault stake, and 60% goes to reward store of sArbet")
            assert(BN(u1).plus(BN(u2)).div(99).times(0.3).eq(BN(v).minus(BN(u1).plus(BN(u2)))), "1% fee of usdt vault stake, and 30% goes to reward store of vault")

            console.log('vault user1 pending reward', BN2Decimal(await vaultContract.getPendingReward(user1.address)))
            console.log('vault user2 pending reward', BN2Decimal(await vaultContract.getPendingReward(user2.address)))

            console.log('sArbet user1 pending reward', BN2Decimal(await sArbetContract.getPendingReward(user1.address)))
            console.log('sArbet user2 pending reward', BN2Decimal(await sArbetContract.getPendingReward(user2.address)))
        })

        it ("withdraw from USDTVault", async function () {
            const user1 = accounts[1]
            const user2 = accounts[2]

            console.log('vault user1 pending reward', BN2Decimal(await vaultContract.getPendingReward(user1.address)))
            console.log('vault user2 pending reward', BN2Decimal(await vaultContract.getPendingReward(user2.address)))
            console.log('vault user2 deposited', BN2Decimal(await vaultContract.getDepositedAmount(user2.address)))

            // first withdraw should wait 1 day right after deposit to the vault
            await advanceTimeAndBlock(86400)
            await vaultContract.connect(user2).withdrawUSDT()
            console.log('user2 withdrew firstly')

            await vaultContract.connect(user1).depositUSDT(T2B('10'))
            console.log('user1 deposited 10$')

            console.log('vault total', BN2Decimal(await vaultContract.totalSupply()))
            console.log('vault user2 pending reward', BN2Decimal(await vaultContract.getPendingReward(user2.address)))
            console.log('vault user2 deposited', BN2Decimal(await vaultContract.balanceOf(user2.address)))

            console.log('user2 usdt', BN2Decimal(await usdtContract.balanceOf(user2.address)))
            await vaultContract.connect(user2).claimUSDT()
            console.log('user2 usdt', BN2Decimal(await usdtContract.balanceOf(user2.address)))

            await advanceTimeAndBlock(86400)
            await vaultContract.connect(user2).withdrawUSDT()
            console.log('user2 withdrew secondly')
            console.log('vault user2 deposited', BN2Decimal(await vaultContract.balanceOf(user2.address)))

            await advanceTimeAndBlock(86400)
            await vaultContract.connect(user2).withdrawUSDT()
            console.log('user2 withdrew thirdly')
            console.log('vault user2 deposited', BN2Decimal(await vaultContract.balanceOf(user2.address)))

            await vaultContract.connect(user1).depositUSDT(T2B('20'))
            console.log('user1 deposited 20$')

            await advanceTimeAndBlock(86400)
            await vaultContract.connect(user2).withdrawUSDT()
            console.log('user2 withdrew last')
            console.log('vault user2 deposited', BN2Decimal(await vaultContract.balanceOf(user2.address)))
        })
    })

    describe("Game", function () {
        let tokenContract
        let sArbetContract
        let usdtContract
        let vaultContract
        let consoleContract
        let rngContract
        let houseContract
        let dice2Contract
        let rouletteContract
        let coinflipContract
        let rpsContract
        let diceContract

        let user1
        let user2
        let user3
        let user4

        before("", async function () {
            user1 = accounts[1]
            user2 = accounts[2]
            user3 = accounts[3]
            user4 = accounts[4]

            const wbnbInfo = await deployContract("WBNB")
            const factoryInfo = await deployContract("PancakeFactory", accounts[1].address)
            const routerInfo = await deployContract("PancakeRouter", factoryInfo.imple, wbnbInfo.imple)

            const usdtInfo = await deployContract("MockUSDT")
            const shinoInfo = await deployContract("SHINO", routerInfo.imple, "Shiba Casino", "SHINO")
            const sArbetInfo = await deployContract("sArbet", shinoInfo.imple, usdtInfo.imple, "Staked Arbet", "sArbet")
            const vaultInfo = await deployContract("USDTVault", usdtInfo.imple, sArbetInfo.imple)

            const consoleInfo = await deployContract("Console")
            const rngInfo = await deployContract("RNG")
            const houseInfo = await deployContract("House", vaultInfo.imple, usdtInfo.imple, consoleInfo.imple)
            const dice2Info = await deployContract("GameDice2", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 0, 1)
            const rouletteInfo = await deployContract("GameRoulette", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 1, 1)
            const coinflipInfo = await deployContract("GameCoinflip", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 2, 1)
            const rpsInfo = await deployContract("GameRPS", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 3, 1)
            const diceInfo = await deployContract("GameDice", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 4, 1)

            const SHINO = await hre.ethers.getContractFactory("SHINO")
            tokenContract = await SHINO.attach(shinoInfo.imple)

            const sArbet = await hre.ethers.getContractFactory("sArbet")
            sArbetContract = await sArbet.attach(sArbetInfo.imple)

            const MockUSDT = await hre.ethers.getContractFactory("MockUSDT")
            usdtContract = await MockUSDT.attach(usdtInfo.imple)

            const USDTVault = await hre.ethers.getContractFactory("USDTVault")
            vaultContract = await USDTVault.attach(vaultInfo.imple)

            const Console = await hre.ethers.getContractFactory("Console")
            consoleContract = await Console.attach(consoleInfo.imple)

            const RNG = await hre.ethers.getContractFactory("RNG")
            rngContract = await RNG.attach(rngInfo.imple)

            const House = await hre.ethers.getContractFactory("House")
            houseContract = await House.attach(houseInfo.imple)

            const Dice2 = await hre.ethers.getContractFactory("GameDice2")
            dice2Contract = await Dice2.attach(dice2Info.imple)

            const Roulette = await hre.ethers.getContractFactory("GameRoulette")
            rouletteContract = await Roulette.attach(rouletteInfo.imple)

            const Coinflip = await hre.ethers.getContractFactory("GameCoinflip")
            coinflipContract = await Coinflip.attach(coinflipInfo.imple)

            const RPS = await hre.ethers.getContractFactory("GameRPS")
            rpsContract = await RPS.attach(rpsInfo.imple)

            const Dice = await hre.ethers.getContractFactory("GameDice")
            diceContract = await Dice.attach(diceInfo.imple)
        })

        it ("configuration of casino", async function () {
            // await rngContract.updateChainlink("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419") // ethereum mainnet
            // await rngContract.updateChainlink("0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE") // binance smart chain
            // await rngContract.updateChainlink("0xAB594600376Ec9fD91F8e885dADF0CE036862dE0") // polygon
            // await rngContract.updateChainlink("0x0A77230d17318075983913bC2145DB16C7366156") // avalanche
            // await rngContract.updateChainlink("0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612") // arbitrum
            await rngContract.updateRandSeed((new Date()).getTime())
            await rngContract.shuffleRandomNumbers()

            await sArbetContract.updateProvider(vaultContract.address, true)
            // await sArbetContract.setStakingContract(tokenContract.address) // Already Set
            await houseContract.initialize()
            await consoleContract.addGame(true, "Dice2", 1, dice2Contract.address)
            await vaultContract.addToGameContractList(dice2Contract.address)
            await consoleContract.addGame(true, "Roulette", 1, rouletteContract.address)
            await vaultContract.addToGameContractList(rouletteContract.address)
            await consoleContract.addGame(true, "Coinflip", 1, coinflipContract.address)
            await vaultContract.addToGameContractList(coinflipContract.address)
            await consoleContract.addGame(true, "RPS", 1, rpsContract.address)
            await vaultContract.addToGameContractList(rpsContract.address)
            await consoleContract.addGame(true, "Dice", 1, diceContract.address)
            await vaultContract.addToGameContractList(diceContract.address)

            await usdtContract.transfer(vaultContract.address, T2B('100000'))

            // only for test
            await dice2Contract.updateMaxRoll(0)
            await rouletteContract.updateMaxRoll(0)
            await coinflipContract.updateMaxRoll(0)
            await rpsContract.updateMaxRoll(0)
			await diceContract.updateMaxRoll(0)
        })

        it ("stake to sArbet, and deposit USDT to USDTVault", async function () {
            let i
            for (i = 1; i < 10; i ++) {
                await tokenContract.transfer(accounts[i].address, T2B('1000'))
                await usdtContract.transfer(accounts[i].address, T2B('1000'))
            }

            await tokenContract.enableTrading()

            await tokenContract.connect(user1).approve(sArbetContract.address, maxUint256)
            await sArbetContract.connect(user1).stake(T2B('100'))
            console.log('user1 staked 100 to sArbet')

            await tokenContract.connect(user2).approve(sArbetContract.address, maxUint256)
            await sArbetContract.connect(user2).stake(T2B('150'))
            console.log('user2 staked 150 to sArbet')

            await tokenContract.connect(user3).approve(sArbetContract.address, maxUint256)
            await sArbetContract.connect(user3).stake(T2B('300'))
            console.log('user3 staked 300 to sArbet')

            await usdtContract.connect(user1).approve(vaultContract.address, maxUint256)
            await vaultContract.connect(user1).depositUSDT(T2B('100'))
            console.log('user1 deposited 100$ to vault')

            await usdtContract.connect(user2).approve(vaultContract.address, maxUint256)
            await vaultContract.connect(user2).depositUSDT(T2B('200'))
            console.log('user2 deposited 200$ to vault')

            await usdtContract.connect(user3).approve(vaultContract.address, maxUint256)
            await vaultContract.connect(user3).depositUSDT(T2B('300'))
            console.log('user3 deposited 300$ to vault')
        })

        it ("play dice2 game", async function () {
            let oldB = await usdtContract.balanceOf(user1.address)
            await usdtContract.connect(user1).approve(houseContract.address, maxUint256)
            const rolls = 1
            let tx = await dice2Contract.connect(user1).play(rolls, 67, Array.from({ length: 50 }).map((u, i) => 70), T2B('0.1'))
            const receipt = await tx.wait()
            console.log(receipt.cumulativeGasUsed, BN(receipt.cumulativeGasUsed.toString()).times('0.000000022857969194').toNumber())    // ilesoviy - How is the value 0.000000022857969194 calculated?
            const events = receipt.events?.filter(x => x.eventSignature !== undefined)
            // console.log(events.map(t => { return {
            //     args: t.args,
            //     ev: t.event,
            //     ev2: t.eventSignature
            // }}))

            const ti = events.find(t => t.event === "GameEnd")
            console.log('bet id', ti.args.betId.toString())
            console.log('stake per roll', BN2Decimal(ti.args._stake))
            console.log('random numbers', ti.args._randomNumbers);
            console.log('rolls', ti.args._rolls);
            console.log('wins', ti.args.wins.toString())
            console.log('losses', ti.args.losses.toString())
            console.log('wager', BN2Decimal(BN(ti.args._stake.toString()).times(rolls)))
            console.log('payout', BN2Decimal(ti.args._payout))
            assert(BN(oldB.toString()).minus(BN(ti.args._stake.toString()).times(rolls).times(1.01).integerValue()).plus(BN(ti.args._payout.toString())).eq(BN((await usdtContract.balanceOf(user1.address)).toString())), "payout inconsistency")
        })

        it ("play roulette game", async function () {
            let oldB = await usdtContract.balanceOf(user2.address)
            await usdtContract.connect(user2).approve(houseContract.address, maxUint256)
            const rolls = 1
            let tx = await rouletteContract.connect(user2).play(rolls, 0, Array.from({ length: 50 }).map((u, i) => (i) === 1? BN(i).times(0.01).times(BN(`1e18`)).toString(): "0"), T2B('0.01'))
            const receipt = await tx.wait()
            console.log(receipt.cumulativeGasUsed, BN(receipt.cumulativeGasUsed.toString()).times('0.000000022857969194').toNumber())
            const events = receipt.events?.filter(x => x.eventSignature !== undefined)
            // console.log(events.map(t => { return {
            //     args: t.args,
            //     ev: t.event,
            //     ev2: t.eventSignature
            // }}))

            const ti = events.find(t => t.event === "GameEnd")
            console.log('bet id', ti.args.betId.toString())
            console.log('stake per roll', BN2Decimal(ti.args._stake))
            console.log('wins', ti.args.wins.toString())
            console.log('losses', ti.args.losses.toString())
            console.log('wager', BN2Decimal(BN(ti.args._stake.toString()).times(rolls)))
            console.log('payout', BN2Decimal(ti.args._payout))
            assert(BN(oldB.toString()).minus(BN(ti.args._stake.toString()).times(rolls).times(1.01).integerValue()).plus(BN(ti.args._payout.toString())).eq(BN((await usdtContract.balanceOf(user2.address)).toString())), "payout inconsistency")
        })

        it ("play coinflip game", async function () {
            let oldB = await usdtContract.balanceOf(user3.address)
            
            await usdtContract.connect(user3).approve(houseContract.address, maxUint256)
            
            const rolls = 1
            let tx = await coinflipContract.connect(user3).play(rolls, 1/*HEAD*/, Array.from({ length: 50 }).map((u, i) => 0), T2B('0.1'))
            const receipt = await tx.wait()
            
            console.log(receipt.cumulativeGasUsed, BN(receipt.cumulativeGasUsed.toString()).times('0.000000022857969194').toNumber())
            const events = receipt.events?.filter(x => x.eventSignature !== undefined)
            // console.log(events.map(t => { return {
            //     args: t.args,
            //     ev: t.event,
            //     ev2: t.eventSignature
            // }}))

            const ti = events.find(t => t.event === "GameEnd")
            console.log('bet id', ti.args.betId.toString())
            console.log('stake per roll', BN2Decimal(ti.args._stake))
            console.log('wins', ti.args.wins.toString())
            console.log('losses', ti.args.losses.toString())
            console.log('wager', BN2Decimal(BN(ti.args._stake.toString()).times(rolls)))
            console.log('payout', BN2Decimal(ti.args._payout))

            assert(BN(oldB.toString()).minus(BN(ti.args._stake.toString()).times(rolls).times(1.01).integerValue()).plus(BN(ti.args._payout.toString())).eq(BN((await usdtContract.balanceOf(user3.address)).toString())), "payout inconsistency")
        })

        it ("play rps game", async function () {
            let oldB = await usdtContract.balanceOf(user4.address)
            
            await usdtContract.connect(user4).approve(houseContract.address, maxUint256)
            
            const rolls = 1
            let tx = await rpsContract.connect(user4).play(rolls, 0, Array.from({ length: 50 }).map((u, i) => i), T2B('0.01'))
            const receipt = await tx.wait()
            
            console.log(receipt.cumulativeGasUsed, BN(receipt.cumulativeGasUsed.toString()).times('0.000000022857969194').toNumber())
            const events = receipt.events?.filter(x => x.eventSignature !== undefined)
            // console.log(events.map(t => { return {
            //     args: t.args,
            //     ev: t.event,
            //     ev2: t.eventSignature
            // }}))

            const ti = events.find(t => t.event === "GameEnd")
            console.log('bet id', ti.args.betId.toString())
            console.log('stake per roll', BN2Decimal(ti.args._stake))
            console.log('wins', ti.args.wins.toString())
            console.log('losses', ti.args.losses.toString())
            console.log('wager', BN2Decimal(BN(ti.args._stake.toString()).times(rolls)))
            console.log('payout', BN2Decimal(ti.args._payout))

            assert(BN(oldB.toString()).minus(BN(ti.args._stake.toString()).times(rolls).times(1.01).integerValue()).plus(BN(ti.args._payout.toString())).eq(BN((await usdtContract.balanceOf(user4.address)).toString())), "payout inconsistency")
        })

        it ("play dice game", async function () {
            let oldB = await usdtContract.balanceOf(user1.address)
            
            await usdtContract.connect(user1).approve(houseContract.address, maxUint256)
            
            const rolls = 1
            let tx = await diceContract.connect(user1).play(rolls, 0, Array.from({ length: 50 }).map((u, i) => i < 5 ? i : 5), T2B('0.1'))
            const receipt = await tx.wait()
            
            console.log(receipt.cumulativeGasUsed, BN(receipt.cumulativeGasUsed.toString()).times('0.000000022857969194').toNumber())
            const events = receipt.events?.filter(x => x.eventSignature !== undefined)
            // console.log(events.map(t => { return {
            //     args: t.args,
            //     ev: t.event,
            //     ev2: t.eventSignature
            // }}))

            const ti = events.find(t => t.event === "GameEnd")
            console.log('bet id', ti.args.betId.toString())
            console.log('stake per roll', BN2Decimal(ti.args._stake))
            console.log('wins', ti.args.wins.toString())
            console.log('losses', ti.args.losses.toString())
            console.log('wager', BN2Decimal(BN(ti.args._stake.toString()).times(rolls)))
            console.log('payout', BN2Decimal(ti.args._payout))

            assert(BN(oldB.toString()).minus(BN(ti.args._stake.toString()).times(rolls).times(1.01).integerValue()).plus(BN(ti.args._payout.toString())).eq(BN((await usdtContract.balanceOf(user1.address)).toString())), "payout inconsistency")
        })
    })
})
