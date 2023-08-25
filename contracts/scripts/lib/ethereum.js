const hre = require("hardhat");

var fs = require("fs");
const BN = require("bignumber.js");

const {
  syncDeployInfo,
  deployContract,
  deployContractAndProxy,
} = require("./deploy");
const { addressZero, bytes32Zero, maxUint256 } = require("./const");

const deploy_ethereum = async () => {
  let network = "ethereum";

  let totalRet = [];
  try {
    let readInfo = fs.readFileSync(`scripts/deploy-${network}.json`);
    totalRet = JSON.parse(readInfo);
  } catch (err) {
    console.log(`${err.message}`);
  }
  // console.log(totalRet);

  let wbnbInfo = totalRet.find((t) => t.name === "WETH");
  let factoryInfo = totalRet.find((t) => t.name === "UniswapFactoryV2");
  let routerInfo = totalRet.find((t) => t.name === "UniswapRouterV2");

  let usdtInfo = totalRet.find((t) => t.name === "USDT");
  let tokenInfo = totalRet.find((t) => t.name === "SHINO");
  let sArbetInfo = totalRet.find((t) => t.name === "sSHINO");
  let consoleInfo = totalRet.find((t) => t.name === "Console");
  let vaultInfo = totalRet.find((t) => t.name === "USDTVault");
  let houseInfo = totalRet.find((t) => t.name === "House");
  let rngInfo = totalRet.find((t) => t.name === "RNG");
  let diceInfo = totalRet.find((t) => t.name === "GameDice");
  let rouletteInfo = totalRet.find((t) => t.name === "GameRoulette");
  let coinflipInfo = totalRet.find((t) => t.name === "GameCoinflip");
  let rpsInfo = totalRet.find((t) => t.name === "GameCoinflip");

  wbnbInfo = {
    name: "WETH",
    imple: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  };
  totalRet = syncDeployInfo(network, "WETH", wbnbInfo, totalRet);

  factoryInfo = {
    name: "UniswapFactoryV2",
    imple: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  };
  totalRet = syncDeployInfo(network, "UniswapFactoryV2", factoryInfo, totalRet);

  routerInfo = {
    name: "UniswapRouterV2",
    imple: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  };
  totalRet = syncDeployInfo(network, "UniswapRouterV2", routerInfo, totalRet);

  usdtInfo = {
    name: "USDT",
    imple: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  };
  totalRet = syncDeployInfo(network, "USDT", usdtInfo, totalRet);

  tokenInfo = {
    name: "SHINO",
    imple: "0xe31a4E5042321204c44a280C01b34b6192F4ABd9",
  };
  totalRet = syncDeployInfo(network, "SHINO", tokenInfo, totalRet);

  sArbetInfo = await deployContract(
    "sArbet",
    tokenInfo.imple,
    usdtInfo.imple,
    "Staked SHINO",
    "sSHINO"
  );
  totalRet = syncDeployInfo(network, "sSHINO", sArbetInfo, totalRet);

  consoleInfo = await deployContract("Console");
  totalRet = syncDeployInfo(network, "Console", consoleInfo, totalRet);

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
  totalRet = syncDeployInfo(network, "GameCoinflip", rouletteInfo, totalRet);

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

  const sSHINO = await hre.ethers.getContractFactory("sArbet");
  sArbetContract = await sSHINO.attach(sArbetInfo.imple);

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
  rouletteContract = await Coinflip.attach(coinflipInfo.imple);

  const RPS = await hre.ethers.getContractFactory("GameRPS");
  rouletteContract = await RPS.attach(rpsInfo.imple);

  await rngContract.updateChainlink(
    "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
  );
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
  await vauleContract.addToGameContractList(coinflipContract.address);
  await consoleContract.addGame(true, "RPS", 1, rpsContract.address);
  await vaultContract.addToGameContractList(rpsContract.address);
};

module.exports = { deploy_ethereum };
