// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { deploy_localhost } = require("./lib/localhost")
const { deploy_bsctestnet } = require("./lib/bsctestnet")
const { deploy_ethereum } = require("./lib/ethereum")
const { deploy_bscmainnet } = require("./lib/bscmainnet")
const { deploy_arbitrum } = require("./lib/arbitrum")

async function main() {
  const accounts = await hre.ethers.getSigners()
  const provider = hre.ethers.provider

  for (const account of accounts) {
    console.log(
      "%s (%i ETH)",
      account.address,
      hre.ethers.utils.formatEther(
        // getBalance returns wei amount, format to ETH amount
        await provider.getBalance(account.address)
      )
    );
  }
  if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
    await deploy_localhost({
      pancakeFeeSetter: accounts[accounts.length - 1].address,
      admin: accounts[1].address
    })
  } else if (hre.network.name === "bsctestnet") {
    await deploy_bsctestnet()
  } else if (hre.network.name === "ethereum") {
    await deploy_ethereum()
  } else if (hre.network.name === "arbitrum") {
    await deploy_arbitrum()
  } else if (hre.network.name === "bscmainnet") {
    await deploy_bscmainnet()
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
