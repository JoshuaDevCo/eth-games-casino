require("@nomicfoundation/hardhat-toolbox");

const {
  BSC_TESTNET_DEPLOYER_KEY,
  ETHEREUM_DEPLOY_KEY
} = require("./env.json")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.info(account.address)
  }
})

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      gasPrice: 10000000000,
      accounts: ['0x9b11242d64e39d91f7c37f248692a13e75d00f4591c6e52177e7784ada18ea7e', '0xa24f0a2d148db4bd5a2355a57d167946dcb6a4fbf99d8146ec91aa2630add6a3'],
      timeout: 120000
    },
    hardhat: {
      // allowUnlimitedContractSize: true
    },
    // bsc: {
    //   url: "",
    //   chainId: 56,
    //   gasPrice: 10000000000,
    //   accounts: ['0x']
    // },
    // bsctestnet: {
    //   url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
    //   chainId: 97,
    //   gasPrice: 20000000000,
    //   accounts: [BSC_TESTNET_DEPLOYER_KEY]
    // },
    // arbitrumTestnet: {
    //   url: "",
    //   gasPrice: 10000000000,
    //   chainId: 421611,
    //   accounts: ['0x']
    // },
    // arbitrum: {
    //   url: 'https://arb1.arbitrum.io/rpc', //"https://rpc.ankr.com/arbitrum",
    //   gasPrice: 100000000,
    //   chainId: 42161,
    //   accounts: [ETHEREUM_DEPLOY_KEY]
    // },
    // avax: {
    //   url: AVAX_URL,
    //   gasPrice: 200000000000,
    //   chainId: 43114,
    //   accounts: [AVAX_DEPLOY_KEY]
    // },
    // polygon: {
    //   url: POLYGON_URL,
    //   gasPrice: 100000000000,
    //   chainId: 137,
    //   accounts: [POLYGON_DEPLOY_KEY]
    // },
    // ethereum: {
    //   url: 'https://mainnet.infura.io/v3/7535811d19b1410e98c261fbb638651a',
    //   chainId: 1,
    //   gasPrice: 61500000000,
    //   accounts: [ETHEREUM_DEPLOY_KEY]
    // }
  },
  etherscan: {
    apiKey: {
      // mainnet: MAINNET_DEPLOY_KEY,
      // arbitrumOne: ARBISCAN_API_KEY,
      // avalanche: SNOWTRACE_API_KEY,
      // bsc: BSCSCAN_API_KEY,
      // polygon: POLYGONSCAN_API_KEY,
    }
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};
