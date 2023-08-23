const hre = require("hardhat");

var fs = require("fs");
const BN = require("bignumber.js");

const {
  syncDeployInfo,
  deployContract,
  deployContractAndProxy,
} = require("./deploy");
const { addressZero, bytes32Zero, maxUint256 } = require("./const");

const deploy_arbitrum = async () => {
  let network = "arbitrum";

  let totalRet = [];
  try {
    let readInfo = fs.readFileSync(`scripts/deploy-${network}.json`);
    totalRet = JSON.parse(readInfo);
  } catch (err) {
    console.log(`${err.message}`);
  }
  // console.log(totalRet);

  let wbnbInfo = totalRet.find((t) => t.name === "WETH");
  let factoryInfo = totalRet.find((t) => t.name === "PancakeFactory");
  let routerInfo = totalRet.find((t) => t.name === "PancakeRouter");

  let usdtInfo = totalRet.find((t) => t.name === "USDT");
  let tokenInfo = totalRet.find((t) => t.name === "ARBET");
  let sArbetInfo = totalRet.find((t) => t.name === "sARBET");
  let consoleInfo = totalRet.find((t) => t.name === "Console");
  let vaultInfo = totalRet.find((t) => t.name === "USDTVault");
  let houseInfo = totalRet.find((t) => t.name === "House");
  let rngInfo = totalRet.find((t) => t.name === "RNG");
  let diceInfo = totalRet.find((t) => t.name === "GameDice");
  let rouletteInfo = totalRet.find((t) => t.name === "GameRoulette");

  wbnbInfo = {
    name: "WETH",
    imple: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
  };
  totalRet = syncDeployInfo(network, "WETH", wbnbInfo, totalRet);

  factoryInfo = {
    name: "PancakeFactory",
    imple: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  };
  totalRet = syncDeployInfo(network, "PancakeFactory", factoryInfo, totalRet);

  routerInfo = {
    name: "PancakeRouter",
    imple: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  };
  totalRet = syncDeployInfo(network, "PancakeRouter", routerInfo, totalRet);

  usdtInfo = {
    name: "USDT",
    imple: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  };
  totalRet = syncDeployInfo(network, "USDT", usdtInfo, totalRet);

  const accounts = await hre.ethers.getSigners()
  const value = await hre.ethers.provider.getBalance(accounts[0].address)
  console.log('account 0 ETH', value.toString())

  tokenInfo = await deployContract(
    "SHINO",
    routerInfo.imple,
    "Arbetrum Casino",
    "ARBET"
  );
  totalRet = syncDeployInfo(network, "ARBET", tokenInfo, totalRet);

  sArbetInfo = await deployContract(
    "sArbet",
    tokenInfo.imple,
    usdtInfo.imple,
    "Staked ARBET",
    "sARBET"
  );
  totalRet = syncDeployInfo(network, "sARBET", sArbetInfo, totalRet);

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

  const ARBET = await hre.ethers.getContractFactory("SHINO");
  tokenContract = await ARBET.attach(tokenInfo.imple);

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

  await rngContract.updateChainlink(
    "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612"
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
};

module.exports = { deploy_arbitrum };
