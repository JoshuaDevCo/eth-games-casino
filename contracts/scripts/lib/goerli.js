const hre = require("hardhat");

var fs = require("fs");
const BN = require("bignumber.js");

const {
  syncDeployInfo,
  deployContract,
  deployContractAndProxy,
} = require("./deploy");
const { addressZero, bytes32Zero, maxUint256 } = require("./const");

const deploy_goerli = async () => {
  let network = "goerli";

  let totalRet = [];
  try {
    let readInfo = fs.readFileSync(`scripts/deploy-${network}.json`);
    totalRet = JSON.parse(readInfo);
  } catch (err) {
    console.log(`${err.message}`);
  }
  // console.log(totalRet);

  let wethInfo = totalRet.find((t) => t.name === "WETH");
  let factoryInfo = totalRet.find((t) => t.name === "UniswapFactoryV2");
  let routerInfo = totalRet.find((t) => t.name === "UniswapRouterV2");

  let usdtInfo = totalRet.find((t) => t.name === "MockUSDT");
  let tokenInfo = totalRet.find((t) => t.name === "SHINO");
  let consoleInfo = totalRet.find((t) => t.name === "Console");
  let sArbetInfo = totalRet.find((t) => t.name === "sArbet");
  let vaultInfo = totalRet.find((t) => t.name === "USDTVault");
  let houseInfo = totalRet.find((t) => t.name === "House");
  let rngInfo = totalRet.find((t) => t.name === "RNG");
  let diceInfo = totalRet.find((t) => t.name === "GameDice");
  let rouletteInfo = totalRet.find((t) => t.name === "GameRoulette");
  let coinflipInfo = totalRet.find((t) => t.name === "GameCoinflip");
  let rpsInfo = totalRet.find((t) => t.name === "GameRPS");

  if (1) {
    wethInfo = {
      name: "WETH",
      imple: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    };
    totalRet = syncDeployInfo(network, "WETH", wethInfo, totalRet);

    factoryInfo = {
      name: "UniswapV2Factory",
      imple: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    };
    totalRet = syncDeployInfo(network, "UniswapV2Factory", factoryInfo, totalRet);

    routerInfo = {
      name: "UniswapV2Router",
      imple: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    };
    totalRet = syncDeployInfo(network, "UniswapV2Router", routerInfo, totalRet);

    usdtInfo = await deployContract("MockUSDT");
    totalRet = syncDeployInfo(network, "MockUSDT", usdtInfo, totalRet);

    tokenInfo = await deployContract(
      "SHINO",
      routerInfo.imple,
      "Shiba Casino",
      "SHINO"
    );
    totalRet = syncDeployInfo(network, "SHINO", tokenInfo, totalRet);

    consoleInfo = await deployContract("Console");
    totalRet = syncDeployInfo(network, "Console", consoleInfo, totalRet);

    sArbetInfo = await deployContract(
      "sArbet",
      tokenInfo.imple,
      usdtInfo.imple,
      "Staked CEOSAR",
      "sCEOSAR"
    );
    totalRet = syncDeployInfo(network, "sArbet", sArbetInfo, totalRet);

    vaultInfo = await deployContract(
      "USDTVault",
      usdtInfo.imple,
      sArbetInfo.imple
    );
    totalRet = syncDeployInfo(network, "USDTVault", vaultInfo, totalRet);

    rngInfo = await deployContract("RNG");
    totalRet = syncDeployInfo(network, "RNG", rngInfo, totalRet);

    houseInfo = await deployContract(
      "House",
      vaultInfo.imple,
      usdtInfo.imple,
      consoleInfo.imple
    );
    totalRet = syncDeployInfo(network, "House", houseInfo, totalRet);

    diceInfo = await deployContract(
      "GameDice",
      usdtInfo.imple,
      vaultInfo.imple,
      consoleInfo.imple,
      houseInfo.imple,
      rngInfo.imple,
      0,
      1
    );
    totalRet = syncDeployInfo(network, "GameDice", diceInfo, totalRet);

    rouletteInfo = await deployContract(
      "GameRoulette",
      usdtInfo.imple,
      vaultInfo.imple,
      consoleInfo.imple,
      houseInfo.imple,
      rngInfo.imple,
      1,
      1
    );
    totalRet = syncDeployInfo(network, "GameRoulette", rouletteInfo, totalRet);

    coinflipInfo = await deployContract(
      "GameCoinflip",
      usdtInfo.imple,
      vaultInfo.imple,
      consoleInfo.imple,
      houseInfo.imple,
      rngInfo.imple,
      2,
      1
    );
    totalRet = syncDeployInfo(network, "GameCoinflip", coinflipInfo, totalRet);
    
    rpsInfo = await deployContract(
      "GameRPS",
      usdtInfo.imple,
      vaultInfo.imple,
      consoleInfo.imple,
      houseInfo.imple,
      rngInfo.imple,
      3,
      1
    );
    totalRet = syncDeployInfo(network, "GameRPS", rpsInfo, totalRet);



    const SHINO = await hre.ethers.getContractFactory("SHINO");
    tokenContract = await SHINO.attach(tokenInfo.imple);

    const sArbet = await hre.ethers.getContractFactory("sArbet");
    sArbetContract = await sArbet.attach(sArbetInfo.imple);

    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
    usdtContract = await MockUSDT.attach(usdtInfo.imple);

    const USDTVault = await hre.ethers.getContractFactory("USDTVault");
    vaultContract = await USDTVault.attach(vaultInfo.imple);

    const Console = await hre.ethers.getContractFactory("Console");
    consoleContract = await Console.attach(consoleInfo.imple);

    const RNG = await hre.ethers.getContractFactory("RNG");
    rngContract = await RNG.attach(rngInfo.imple);

    const House = await hre.ethers.getContractFactory("House");
    houseContract = await House.attach(houseInfo.imple);

    const Dice = await hre.ethers.getContractFactory("GameDice");
    diceContract = await Dice.attach(diceInfo.imple);

    const Roulette = await hre.ethers.getContractFactory("GameRoulette");
    rouletteContract = await Roulette.attach(rouletteInfo.imple);

    const Coinflip = await hre.ethers.getContractFactory("GameCoinflip");
    coinflipContract = await Coinflip.attach(coinflipInfo.imple);

    const RPS = await hre.ethers.getContractFactory("GameRPS");
    rpsContract = await RPS.attach(rpsInfo.imple);

    await rngContract.updateRandSeed(new Date().getTime());
    await rngContract.shuffleRandomNumbers();

    await sArbetContract.updateProvider(vaultContract.address, true);
    await tokenContract.enableTrading()
    await houseContract.initialize();
    await consoleContract.addGame(true, "Dice", 1, diceContract.address);
    await vaultContract.addToGameContractList(diceContract.address);
    await consoleContract.addGame(true, "Roulette", 1, rouletteContract.address);
    await vaultContract.addToGameContractList(rouletteContract.address);
    await consoleContract.addGame(true, "Coinflip", 1, coinflipContract.address);
    await vaultContract.addToGameContractList(coinflipContract.address);
    await consoleContract.addGame(true, "RPS", 1, rpsContract.address);
    await vaultContract.addToGameContractList(rpsContract.address);

    await usdtContract.transfer(
      vaultContract.address,
      "100000000000000000000000"
    );
  } else {
    const USDTVault = await hre.ethers.getContractFactory("USDTVault");
    vaultContract = await USDTVault.attach(vaultInfo.imple);

    await vaultContract.removeFromGameContractList(rouletteInfo.imple);

    rouletteInfo = await deployContract(
      "GameRoulette",
      usdtInfo.imple,
      vaultInfo.imple,
      consoleInfo.imple,
      houseInfo.imple,
      rngInfo.imple,
      1,
      1
    );
    totalRet = syncDeployInfo(network, "GameRoulette", rouletteInfo, totalRet);

    const Roulette = await hre.ethers.getContractFactory("GameRoulette");
    rouletteContract = await Roulette.attach(rouletteInfo.imple);

    const Console = await hre.ethers.getContractFactory("Console");
    consoleContract = await Console.attach(consoleInfo.imple);

    await consoleContract.editGame(
      1,
      true,
      "Roulette",
      1,
      rouletteContract.address
    );

    await vaultContract.addToGameContractList(rouletteContract.address);
  }
};

module.exports = { deploy_goerli };
