const hre = require("hardhat");

var fs = require("fs");
const BN = require("bignumber.js");

const {
  syncDeployInfo,
  deployContract,
  deployContractAndProxy,
} = require("./deploy");
const { addressZero, bytes32Zero, maxUint256 } = require("./const");

const deploy_bscmainnet = async () => {
  let network = "bscmainnet";

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
  let tokenInfo = totalRet.find((t) => t.name === "CEOSAR");
  let sArbetInfo = totalRet.find((t) => t.name === "sCEOSAR");
  let consoleInfo = totalRet.find((t) => t.name === "Console");
  let vaultInfo = totalRet.find((t) => t.name === "USDTVault");
  let houseInfo = totalRet.find((t) => t.name === "House");
  let rngInfo = totalRet.find((t) => t.name === "RNG");
  let diceInfo = totalRet.find((t) => t.name === "GameDice");
  let rouletteInfo = totalRet.find((t) => t.name === "GameRoulette");

  wbnbInfo = {
    name: "WETH",
    imple: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  };
  totalRet = syncDeployInfo(network, "WETH", wbnbInfo, totalRet);

  factoryInfo = {
    name: "PancakeFactory",
    imple: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
  };
  totalRet = syncDeployInfo(network, "PancakeFactory", factoryInfo, totalRet);

  routerInfo = {
    name: "PancakeRouter",
    imple: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  };
  totalRet = syncDeployInfo(network, "PancakeRouter", routerInfo, totalRet);

  usdtInfo = {
    name: "USDT",
    imple: "0x55d398326f99059fF775485246999027B3197955",
  };
  totalRet = syncDeployInfo(network, "USDT", usdtInfo, totalRet);

  tokenInfo = {
    name: "CEOSAR",
    imple: "0x6958f958e1d42a9E5C39c4A981c05D859D7f751b",
  };
  totalRet = syncDeployInfo(network, "CEOSAR", tokenInfo, totalRet);

  sArbetInfo = await deployContract(
    "sArbet",
    tokenInfo.imple,
    usdtInfo.imple,
    "Staked CEOSAR",
    "sCEOSAR"
  );
  totalRet = syncDeployInfo(network, "sCEOSAR", sArbetInfo, totalRet);

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

  const CEOSAR = await hre.ethers.getContractFactory("SHINO");
  tokenContract = await CEOSAR.attach(tokenInfo.imple);

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
    "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"
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

module.exports = { deploy_bscmainnet };
