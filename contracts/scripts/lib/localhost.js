const hre = require("hardhat")

var fs = require('fs')
const BN = require('bignumber.js')

const { syncDeployInfo, deployContract, deployContractAndProxy } = require('./deploy')
const { addressZero, bytes32Zero, maxUint256,
   } = require('./const')

const deploy_localhost = async (specialAccounts) => {
    let network = 'localhost'
    const { admin, pancakeFeeSetter } = specialAccounts

    let totalRet = []
    try {
      let readInfo = fs.readFileSync(`scripts/deploy-${network}.json`);
      totalRet = JSON.parse(readInfo);
    } catch(err) {
      console.log(`${err.message}`);
    }
    // console.log(totalRet);

    let wbnbInfo = totalRet.find(t => t.name === "WBNB")
    let factoryInfo = totalRet.find(t => t.name === "PancakeFactory")
    let routerInfo = totalRet.find(t => t.name === "PancakeRouter")

    let usdtInfo = totalRet.find(t => t.name === "MockUSDT")
    let arbetInfo = totalRet.find(t => t.name === "Arbet")
    let consoleInfo = totalRet.find(t => t.name === "Console")
    let sArbetInfo = totalRet.find(t => t.name === "sArbet")
    let vaultInfo = totalRet.find(t => t.name === "USDTVault")
    let houseInfo = totalRet.find(t => t.name === "House")
    let rngInfo = totalRet.find(t => t.name === "RNG")
    let dice2Info = totalRet.find(t => t.name === "GameDice2")
    let rouletteInfo = totalRet.find(t => t.name === "GameRoulette")
    let coinflipInfo = totalRet.find(t => t.name === "GameCoinflip")
    let rpsInfo = totalRet.find(t => t.name === "GameRPS")
    let diceInfo = totalRet.find(t => t.name === "GameDice")

    wbnbInfo = await deployContract("WBNB")
    totalRet = syncDeployInfo(network, "WBNB", wbnbInfo, totalRet)

    factoryInfo = await deployContract("PancakeFactory", pancakeFeeSetter)
    totalRet = syncDeployInfo(network, "PancakeFactory", factoryInfo, totalRet)

    routerInfo = await deployContract("PancakeRouter", factoryInfo.imple, wbnbInfo.imple)
    totalRet = syncDeployInfo(network, "PancakeRouter", routerInfo, totalRet)

    const PancakeRouter = await hre.ethers.getContractFactory("PancakeRouter")
    let routerContract = await PancakeRouter.attach(routerInfo.imple)
    const PancakeFactory = await hre.ethers.getContractFactory("PancakeFactory")
    let factoryContract = await PancakeFactory.attach(factoryInfo.imple)

    let wethAddr = await routerContract.WETH()
    console.log('WETH:', wethAddr)

    console.log("Pancake Factory Pair HASH:", await factoryContract.INIT_CODE_PAIR_HASH())

    usdtInfo = await deployContract("MockUSDT")
    totalRet = syncDeployInfo(network, "MockUSDT", usdtInfo, totalRet)

    arbetInfo = await deployContract("Arbet", routerInfo.imple, "Arbet", "Arbet")
    totalRet = syncDeployInfo(network, "Arbet", arbetInfo, totalRet)

    consoleInfo = await deployContract("Console")
    totalRet = syncDeployInfo(network, "Console", consoleInfo, totalRet)

    sArbetInfo = await deployContract("sArbet", arbetInfo.imple, usdtInfo.imple, "Staked Arbet", "sArbet")
    totalRet = syncDeployInfo(network, "sArbet", sArbetInfo, totalRet)

    vaultInfo = await deployContract("USDTVault", usdtInfo.imple, sArbetInfo.imple)
    totalRet = syncDeployInfo(network, "USDTVault", vaultInfo, totalRet)

    rngInfo = await deployContract("RNG")
    totalRet = syncDeployInfo(network, "RNG", rngInfo, totalRet)

    houseInfo = await deployContract("House", vaultInfo.imple, usdtInfo.imple, consoleInfo.imple)
    totalRet = syncDeployInfo(network, "House", houseInfo, totalRet)

    dice2Info = await deployContract("GameDice2", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 0, 1)
    totalRet = syncDeployInfo(network, "GameDice2", dice2Info, totalRet)

    rouletteInfo = await deployContract("GameRoulette", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 1, 1)
    totalRet = syncDeployInfo(network, "GameRoulette", rouletteInfo, totalRet)

    coinflipInfo = await deployContract("GameCoinflip", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 2, 1)
    totalRet = syncDeployInfo(network, "GameCoinflip", coinflipInfo, totalRet)

    rpsInfo = await deployContract("GameRPS", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 3, 1)
    totalRet = syncDeployInfo(network, "GameRPS", rpsInfo, totalRet)

    diceInfo = await deployContract("GameDice", usdtInfo.imple, vaultInfo.imple, consoleInfo.imple, houseInfo.imple, rngInfo.imple, 4, 1)
    totalRet = syncDeployInfo(network, "GameDice", diceInfo, totalRet)

    let tInfo = await deployContractAndProxy("GovernableUpgradeable", "TransparentUpgradeableProxy", admin, "Governable_init", ["address", "uint256", "string"], [admin, 0, "My Test"])
    totalRet = syncDeployInfo(network, "GovernableUpgradeable", tInfo, totalRet)
}

module.exports = { deploy_localhost }
