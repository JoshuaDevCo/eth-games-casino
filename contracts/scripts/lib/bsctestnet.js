const hre = require("hardhat");

var fs = require("fs");
const BN = require("bignumber.js");

const {
  syncDeployInfo,
  deployContract,
  deployContractAndProxy,
} = require("./deploy");
const { addressZero, bytes32Zero, maxUint256 } = require("./const");

const deploy_bsctestnet = async () => {
  let network = "bsctestnet";

  let totalRet = [];
  try {
    let readInfo = fs.readFileSync(`scripts/deploy-${network}.json`);
    totalRet = JSON.parse(readInfo);
  } catch (err) {
    console.log(`${err.message}`);
  }
  // console.log(totalRet);

  let wbnbInfo = totalRet.find((t) => t.name === "WBNB");
  let factoryInfo = totalRet.find((t) => t.name === "PancakeFactory");
  let routerInfo = totalRet.find((t) => t.name === "PancakeRouter");

  let usdtInfo = totalRet.find((t) => t.name === "MockUSDT");
  let tokenInfo = totalRet.find((t) => t.name === "SHINO");
  let consoleInfo = totalRet.find((t) => t.name === "Console");
  let sArbetInfo = totalRet.find((t) => t.name === "sArbet");
  let vaultInfo = totalRet.find((t) => t.name === "USDTVault");
  let houseInfo = totalRet.find((t) => t.name === "House");
  let rngInfo = totalRet.find((t) => t.name === "RNG");
  let diceInfo = totalRet.find((t) => t.name === "GameDice");
  let rouletteInfo = totalRet.find((t) => t.name === "GameRoulette");

  if (1) {
    wbnbInfo = {
      name: "WBNB",
      imple: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    };
    totalRet = syncDeployInfo(network, "WBNB", wbnbInfo, totalRet);

    factoryInfo = {
      name: "PancakeFactory",
      imple: "0x6725f303b657a9451d8ba641348b6761a6cc7a17",
    };
    totalRet = syncDeployInfo(network, "PancakeFactory", factoryInfo, totalRet);

    routerInfo = {
      name: "PancakeRouter",
      imple: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
    };
    totalRet = syncDeployInfo(network, "PancakeRouter", routerInfo, totalRet);

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

    await rngContract.updateRandSeed(new Date().getTime());
    await rngContract.shuffleRandomNumbers();

    await sArbetContract.updateProvider(vaultContract.address, true);
    await tokenContract.enableTrading()
    await houseContract.initialize();
    await consoleContract.addGame(true, "Dice", 1, diceContract.address);
    await vaultContract.addToGameContractList(diceContract.address);
    await consoleContract.addGame(
      true,
      "Roulette",
      1,
      rouletteContract.address
    );
    await vaultContract.addToGameContractList(rouletteContract.address);

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

module.exports = { deploy_bsctestnet };
