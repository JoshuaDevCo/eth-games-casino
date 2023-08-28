import {
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo
} from 'react'
import { useCustomWallet } from '../WalletContext'
import ERC20_abi from './abi/MockUSDT.sol/MockUSDT.json'
import Router_abi from './abi/pancake/PancakeRouter.sol/PancakeRouter.json'
import Reflection_abi from './abi/Reflection.sol/Reflection.json'
import Vault_abi from './abi/USDTVault.sol/USDTVault.json'
import Token_abi from './abi/Shino.sol/SHINO.json'
import sArbet_abi from './abi/sArbet.sol/sArbet.json'
import Game_abi from './abi/games/Game.sol/Game.json'
import walletConfig from '../WalletContext/config'
import ADDRESS from './address'
import axios from 'axios'
import qs from 'qs'

import BigNumber from 'bignumber.js'
import { useGlobal } from '../GlobalContext'
import { useDispatch, useSelector } from 'react-redux'

// import Web3 from 'web3'

import {
  setTokenName,
  setTokenSymbol,
  setTokenDecimals,
  setAddress as setTokenAddress,
  setBalance as setTokenBalance,
  setSBalance,
  setSSymbol,
  setPrice,
  setPendingUSDT,
  setClaimedUSDT,
  setSArbetAllowance,
} from '../ReduxContext/reducers/token'

import {
  setAddress as setVaultAddress,
  setBalance as setUSDTBalance,
  setDepositedUSDT,
  setPendingUSDT as setVaultPendingUSDT,
  setClaimedUSDT as setVaultClaimedUSDT,
  setVaultAllowance,
  setUntilNextWithdraw,
  setWithdrawSteps,
  setVaultCap,
} from '../ReduxContext/reducers/vault'

import {
  setChainId,
  setBalance as setETHBalance,
  setLabel,
  setName,
  setNetwork,
  setBrand,
  setIcon,
  setLogo,
  setNativeCurrency,
  setRPCUrl,
  setBlockUrl,
  setWETH,
  setFactory,
  setRouter,
  setUSDT,
  setToken,
  setSArbet,
  setConsole,
  setVault,
  setRNG,
  setHouse,
  setDice,
  setRoulette,
  setCoinflip,
  setRPS,
  setDexURL,
  setTelegramURL,
  setTwitterURL,
  setLandingURL,
  setDocURL,
} from '../ReduxContext/reducers/chain'

import { setHouseAllowance as setDiceHouseAllowance } from '../ReduxContext/reducers/dice'
import { setHouseAllowance as setRouletteHouseAllowance } from '../ReduxContext/reducers/roulette'
import { setHouseAllowance as setCoinflipHouseAllowance } from '../ReduxContext/reducers/coinflip'
import { setHouseAllowance as setRPSHouseAllowance } from '../ReduxContext/reducers/rps'

export const ContractContext = createContext()

BigNumber.config({
  EXPONENTIAL_AT: [-10, 64],
})

export const ContractProvider = ({ children }) => {
  const { wallet, library } = useCustomWallet()
  const { chainId } = useGlobal()

  const dispatch = useDispatch()
  const usdtPerChip = useSelector((state) => state.roulette.usdtPerChip)

  const [reloadCounter, setReloadCounter] = useState(0)
  const provider = useMemo(() => {
    return library?.provider;
  }, [chainId, library?.provider]);

  const callProvider = useMemo(() => {
    return new ethers.JsonRpcProvider(
      walletConfig[chainId].rpcUrls[0],
      chainId
    );
  }, [chainId]);

  const buildEncodedData = useCallback((types, values) => {
    var encoded = ethers.AbiCoder.encode(types, values);
    if (encoded.slice(0, 2) === "0x") {
      encoded = encoded.slice(2);
    }
    return encoded;
  }, []);

  useEffect(() => {
    let ac = new AbortController()

    const reload = () => {
      setReloadCounter((t) => {
        return t + 1
      })
    }

    let tmr = setInterval(() => {
      if (ac.signal.aborted === false) {
        reload()
      }
    }, 50000)

    return () => {
      ac.abort()
      clearInterval(tmr)
    }
  }, [])

  useEffect(() => {
    setReloadCounter((t) => {
      return t + 1
    })
  }, [wallet])

  const refreshPages = () => {
    setTimeout(() => {
      setReloadCounter((t) => {
        return t + 1
      })
    }, 2000)
  }

  const assertValidAddress = useCallback((addr) => {
    if (!ethers.isAddress(addr)) {
      throw new Error("Invalid Address");
    }
  }, []);

  const getBN = () => {
    return BN;
  };

  const makeTx = useCallback(
    async (addr, tx, gasPlus) => {
      const gasCost = await provider.estimateGas({
        from: wallet.address,
        data: tx.data,
      });
      const txUnsigned = {
        from: wallet.address,
        to: addr,
        data: tx.data,
        gas:
          parseInt(gasCost.toString()) + (gasPlus !== undefined ? gasPlus : 0),
      };

      const signer = await provider.getSigner();
      // const txSigned = await signer.signTransaction(txUnsigned);
      const submittedTx = await signer.sendTransaction(txUnsigned);
      const receipt = await submittedTx.wait();
      return receipt;
    },
    [provider, wallet.address]
  );

  const makeTxWithNativeCurrency = useCallback(
    async (addr, tx, nativeCurrencyAmount, gasPlus) => {
      const gasCost = await provider.estimateGas({
        value: nativeCurrencyAmount,
        from: wallet.address,
        data: tx.data,
      });

      const txUnsigned = {
        from: wallet.address,
        to: addr,
        value: nativeCurrencyAmount,
        data: tx.data,
        gas:
          parseInt(gasCost.toString()) + (gasPlus !== undefined ? gasPlus : 0),
      };
      const signer = await provider.getSigner();

      const submittedTx = await signer.sendTransaction(txUnsigned);
      const receipt = await submittedTx.wait();
      return receipt;
    },
    [provider, wallet.address]
  );

  const makeTxByProvider = useCallback(
    async (data, gasPlus) => {
      const gasCost = await provider.estimateGas(data);
      const txUnsigned = {
        ...data,
        gas:
          parseInt(gasCost.toString()) + (gasPlus !== undefined ? gasPlus : 0),
      };

      const signer = await provider.getSigner();

      const submittedTx = await signer.sendTransaction(txUnsigned);
      const receipt = await submittedTx.wait();
      return receipt;
    },
    [provider]
  );

  const getGasPrice = useCallback(async () => {
    const data = await callProvider.getFeeData();
    return data.gasPrice.toString(10);
  }, [callProvider]);

  const A2D = useCallback(
    async (addr, amount) => {
      assertValidAddress(addr);

      const erc20 = new ethers.Contract(addr, ERC20_abi.abi, callProvider);
      let tval = await erc20.decimals();
      let tt = new BN(amount).div(new BN(`1e${tval}`));

      return tt;
    },
    [callProvider, assertValidAddress]
  );

  const D2A = useCallback(
    async (addr, amount) => {
      assertValidAddress(addr);

      const toBN = ethers.toNumber;
      const erc20 = new ethers.Contract(addr, ERC20_abi.abi, callProvider);
      let tval = await erc20.decimals();
      tval = new BN(amount).times(new BN(`1e${tval}`));

      return toBN(tval.toFixed(0));
    },
    [callProvider, assertValidAddress]
  );

  const balanceOf = useCallback(
    async (token, address) => {
      assertValidAddress(token);
      if (address === undefined || address === "") return 0;

      const tokenContract = new ethers.Contract(
        token,
        ERC20_abi.abi,
        callProvider
      );
      let ret = await tokenContract.balanceOf(address);

      return await A2D(token, ret);
    },
    [callProvider, A2D, assertValidAddress]
  );

  const balanceETH = useCallback(
    async (address) => {
      assertValidAddress(address);

      const ret = await callProvider.getBalance(address);

      return ethers.formatEther(ret);
    },
    [callProvider, assertValidAddress]
  );

  const getTokenApprovedAmount = useCallback(
    async (token, owner, spender) => {
      assertValidAddress(token);

      const tokenContract = new ethers.Contract(
        token,
        ERC20_abi.abi,
        callProvider
      );
      let ret = await tokenContract.allowance(owner, spender);

      return await A2D(token, ret);
    },
    [callProvider, A2D, assertValidAddress]
  );

  const getFactoryPair = useCallback(
    async (factory, tokenA, tokenB) => {
      assertValidAddress(factory);
      assertValidAddress(tokenA);
      assertValidAddress(tokenB);

      const factoryContract = new ethers.Contract(
        factory,
        Factory_abi.abi,
        callProvider
      );

      let ret = await factoryContract.getPair(tokenA, tokenB);

      return ret;
    },
    [callProvider, assertValidAddress]
  );

  const getAmountsOut = useCallback(
    async (router, inputAmount, path) => {
      assertValidAddress(router);

      const routerContract = new ethers.Contract(
        router,
        Router_abi.abi,
        callProvider
      );

      let ret = await routerContract.getAmountsOut(inputAmount, path);

      return ret[ret.length - 1].toString();
    },
    [callProvider, assertValidAddress]
  );

  const getAmountsIn = useCallback(
    async (router, outputAmount, path) => {
      assertValidAddress(router);

      const routerContract = new ethers.Contract(
        router,
        Router_abi.abi,
        callProvider
      );

      let ret = await routerContract.getAmountsIn(outputAmount, path);

      return ret[0].toString();
    },
    [callProvider, assertValidAddress]
  );

  const approveToken = useCallback(
    async (token, spender) => {
      assertValidAddress(token);

      const tokenContract = new ethers.Contract(
        token,
        ERC20_abi.abi,
        await provider.getSigner()
      );

      let tx = await tokenContract.approve(
        spender,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );

      return tx.wait();
    },
    [provider, assertValidAddress]
  );

  const transferOwnership = useCallback(
    async (ownable, newOwner) => {
      assertValidAddress(ownable);

      const ownableContract = new ethers.Contract(
        ownable,
        Nova_abi.abi,
        provider
      );
      let tx = await makeTx(
        ownable,
        ownableContract.transferOwnership(newOwner)
      );

      return tx;
    },
    [provider, makeTx, assertValidAddress]
  );

  const renounceOwnership = useCallback(
    async (ownable) => {
      assertValidAddress(ownable);

      const ownableContract = new ethers.Contract(
        ownable,
        Nova_abi.abi,
        provider
      );
      let tx = await makeTx(ownable, ownableContract.renounceOwnership());

      return tx;
    },
    [provider, makeTx, assertValidAddress]
  );

  const getTokenName = useCallback(
    async (token) => {
      assertValidAddress(token);

      const tokenContract = new ethers.Contract(
        token,
        ERC20_abi.abi,
        callProvider
      );

      return await tokenContract.name();
    },
    [assertValidAddress, callProvider]
  );

  const getTokenSymbol = useCallback(
    async (token) => {
      assertValidAddress(token);

      const tokenContract = new ethers.Contract(
        token,
        ERC20_abi.abi,
        callProvider
      );

      return await tokenContract.symbol();
    },
    [assertValidAddress, callProvider]
  );

  const getTokenDecimals = useCallback(
    async (token) => {
      assertValidAddress(token);

      const tokenContract = new ethers.Contract(
        token,
        ERC20_abi.abi,
        callProvider
      );
      const decimals = await tokenContract.decimals();

      return parseInt(decimals.toString());
    },
    [assertValidAddress, callProvider]
  );

  const getTokenSupply = useCallback(
    async (token) => {
      assertValidAddress(token);

      const tokenContract = new ethers.Contract(
        token,
        ERC20_abi.abi,
        callProvider
      );

      return await A2D(token, await tokenContract.totalSupply());
    },
    [A2D, assertValidAddress, callProvider]
  );

  const getOwner = useCallback(
    async (token) => {
      assertValidAddress(token);

      const tokenContract = new ethers.Contract(
        token,
        Nova_abi.abi,
        callProvider
      );

      return await tokenContract.owner();
    },
    [assertValidAddress, callProvider]
  );

  const isAddressFormat = useCallback((addr) => {
    return ethers.isAddress(addr);
  }, []);

  const getTokenInfo = useCallback(
    async (token, user, router) => {
      assertValidAddress(token);

      if (token === ethers.ZeroAddress) {
        let balance = "";
        try {
          const ret = await Promise.all([callProvider.getBalance(user)]);
          balance = BN(ret[0])
            .div(BN(`1e${walletConfig[chainId].nativeCurrency.decimals}`))
            .toString();
        } catch (err) {}

        return {
          address: token,
          name: walletConfig[chainId].nativeCurrency.name,
          symbol: walletConfig[chainId].nativeCurrency.symbol,
          decimals: walletConfig[chainId].nativeCurrency.decimals,
          balance: balance,
          allowance: BN(2).pow(256).minus(1).toString(),
        };
      } else {
        let balance, symbol, name, decimals, allowance;
        try {
          const ret = await Promise.all([
            getTokenSymbol(token),
            getTokenName(token),
            getTokenDecimals(token),
            balanceOf(token, user),
            getTokenApprovedAmount(token, user, router),
          ]);
          symbol = ret[0];
          name = ret[1];
          decimals = ret[2];
          balance = ret[3].toString();
          allowance = ret[4].toString();
        } catch (err) {}

        return {
          address: token,
          name,
          symbol,
          decimals,
          balance,
          allowance,
        };
      }
    },
    [assertValidAddress, callProvider, chainId]
  );

  const tokenPriceToUSDT = useCallback(
    async (amount) => {
      const routerContract = new ethers.Contract(ADDRESS[chainId].router, Router_abi.abi, callProvider)

      let realVal = await D2A(ADDRESS[chainId].token, amount)

      let t2 = await routerContract.methods.A2D
        getAmountsOut(realVal.toString(), 
          [ADDRESS[chainId].token, ADDRESS[chainId].WETH, ADDRESS[chainId].usdt])
        .call()
      
      return await A2D(ADDRESS[chainId].usdt, t2[t2.length - 1])
    },
    [D2A, A2D, callProvider, chainId],
  )

  const ethAmountByUSDT = useCallback(
    async (amount) => {
      const routerContract = new ethers.Contract(ADDRESS[chainId].router, Router_abi.abi, callProvider)
      const wethAddress = await routerContract.methods.WETH().call()

      let tval = await routerContract.methods
        .getAmountsOut(ethers.utils.toWei(amount.toString()), [wethAddress, ADDRESS[chainId].usdt])
        .call()

      const ret = await A2D(ADDRESS[chainId].usdt, tval[tval.length - 1].toString())

      return ret
    },
    [A2D, callProvider, chainId],
  )

  const wethBalanceByUSDT = useCallback(
    async (account) => {
      const balance = await balanceETH(account)

      if (BigNumber(balance).eq(0)) return new BigNumber(0)
      return await ethAmountByUSDT(balance)
    },
    [balanceETH, ethAmountByUSDT, callProvider],
  )

  const getPendingUSDT = useCallback(
    async (address, account) => {
      const reflectionContract = new ethers.Contract(address, Reflection_abi.abi)
      const amount = await reflectionContract.methods.getPendingReward(account).call()
      const ret = await A2D(ADDRESS[chainId].usdt, amount)
      return ret
    },
    [A2D, callProvider, chainId],
  )

  const getClaimedUSDT = useCallback(
    async (address, account) => {
      const reflectionContract = new ethers.Contract(address, Reflection_abi.abi)
      const amount = await reflectionContract.methods.getEarningsClaimedByAccount(account).call()
      const ret = await A2D(ADDRESS[chainId].usdt, amount)
      return ret
    },
    [A2D, callProvider, chainId],
  )

  const getWithdrawContext = useCallback(
    async (account) => {
      const vaultContract = new ethers.Contract(ADDRESS[chainId].vault, Vault_abi.abi)
      const amount = await vaultContract.methods.getWithdrawInfo(account).call()
      const ret = await A2D(ADDRESS[chainId].usdt, amount)
      return [parseInt(ret.nextWithdrawTime.toString()) * 1000, parseInt(ret.steps.toString())]
    },
    [A2D, callProvider, chainId],
  )

  const getVaultDepositedUSDT = useCallback(
    async (account) => {
      const vaultContract = new ethers.Contract(ADDRES[chainId].vault, Vault_abi.abi)
      const usdtAddress = await vaultContract.methods.usdtToken().call()
      const usdtContract = new web3.eth.Contract(ERC20_abi.abi, usdtAddress)
      const usdtDecimals = await usdtContract.methods.decimals().call()
      const ret = await vaultContract.methods.balanceOf(account).call()
      return BigNumber(ret.toString()).div(BigNumber(`1e${usdtDecimals.toString()}`))      
    },
    [callProvider, chainId],
  )

  const stakeToSArbet = useCallback(
    async (amount) => {
      const sArbetContract = new ethers.Contract(ADDRESS[chainId].sArbet, sArbet_abi.abi)

      console.log('>>>', ADDRESS[chainId].sArbet, amount)
      let tx = await makeTx(
        ADDRESS[chainId].sArbet,
        sArbetContract.methods.stake(await D2A(ADDRESS[chainId].token, amount)),
      )

      return tx
    },
    [makeTx, D2A],
  )

  const unstakeToSArbet = useCallback(
    async (amount) => {
      const sArbetContract = new ethers.Contract(ADDRESS[chainId].sArbet, sArbet_abi.abi)

      let tx = await makeTx(
        ADDRESS[chainId].sArbet,
        sArbetContract.methods.unstake(await D2A(ADDRESS[chainId].token, amount)),
      )

      return tx
    },
    [makeTx, D2A],
  )

  const claimArbet = useCallback(async () => {
    const sArbetContract = new ethers.Contract(ADDRESS[chainId].sArbet, sArbet_abi.abi)

    let tx = await makeTx(ADDRESS[chainId].sArbet, sArbetContract.methods.claimReward())

    return tx
  }, [makeTx])

  const stakeToVault = useCallback(
    async (amount) => {
      const vaultContract = new ethers.Contract(ADDRES[chainId].vault, Vault_abi.abi)

      let tx = await makeTx(
        ADDRESS[chainId].vault,
        vaultContract.methods.depositUSDT(await D2A(ADDRESS[chainId].usdt, amount)),
      )

      return tx
    },
    [makeTx, D2A],
  )

  const unstakeToVault = useCallback(
    async () => {
      const vaultContract = new ethers.Contract(ADDRES[chainId].vault, Vault_abi.abi)

      let tx = await makeTx(ADDRESS[chainId].vault, vaultContract.methods.withdrawUSDT())

      return tx
    },
    [makeTx],
  )

  const claimVault = useCallback(
    async () => {
      const vaultContract = new ethers.Contract(ADDRES[chainId].vault, Vault_abi.abi)

      let tx = await makeTx(ADDRESS[chainId].vault, vaultContract.methods.claimUSDT())

      return tx
    },
    [makeTx],
  )

  const getMaxPayout = useCallback(
    async (gameAddress, betNum, dataArray) => {
      const gameContract = new ethers.Contract(gameAddress, Game_abi.abi)

      const ret = await gameContract.methods
        .getMaxPayout(
          betNum,
          dataArray.map((d) => Math.floor(d * 100000)),
        )
        .call()
      
      return BigNumber(ret.toString()).div(BigNumber('1e24')).toFixed(10)
    },
    [A2D, chainId, web3Provider],
  )

  const playDice = useCallback(
    async (betDices, betAmount) => {
      const diceContract = new ethers.Contract(ADDRESS[chainId].dice, Game_abi.abi)

      let tx = await makeTx(
        ADDRESS[chainId].dice,
        diceContract.methods.play(
          1,
          0,
          betDices,
          await D2A(ADDRESS[chainId].usdt, betAmount),
        ),
      )

      return tx
    },
    [makeTx, chainId, D2A],
  )

  const playRoulette = useCallback(
    async (chipData) => {
      const rouletteContract = new ethers.Contract(ADDRESS[chainId].roulette, Game_abi.abi)

      const decimals = await getTokenDecimals(ADDRESS[chainId].usdt)
      const mp = chipData.map(
        (c) =>
          BigNumber(c.toString())
            .times(BigNumber(`1e${parseInt(decimals.toString())}`))
            .times(BigNumber(usdtPerChip))
            .integerValue()
            .toString(), // 1 chip = 0.01 USDT
      )

      const ts = mp.reduce((c, v) => {
        return BigNumber(c).plus(BigNumber(v)).toString()
      }, '0')

      let tx = await makeTx(ADDRESS[chainId].roulette, rouletteContract.methods.play(1, 0, mp, ts))

      return tx
    },
    [makeTx, chainId, D2A, getTokenDecimals, usdtPerChip],
  )

  const playCoinflip = useCallback(
    async (betNum, betAmount) => {
      const diceContract = new ethers.Contract(ADDRESS[chainId].dice, Game_abi.abi)

      let tx = await makeTx(
        ADDRESS[chainId].dice,
        diceContract.methods.play(
          1,
          betNum,
          Array.from({ length: 50 }).map(() => 0),
          await D2A(ADDRESS[chainId].usdt, betAmount),
        ),
      )

      return tx
    },
    [makeTx, chainId, D2A],
  )

  const playRPS = useCallback(
    async (betNum, betAmount) => {
      const diceContract = new ethers.Contract(ADDRESS[chainId].dice, Game_abi.abi)

      let tx = await makeTx(
        ADDRESS[chainId].dice,
        diceContract.methods.play(
          1,
          betNum,
          Array.from({ length: 50 }).map(() => 0),
          await D2A(ADDRESS[chainId].usdt, betAmount),
        ),
      )

      return tx
    },
    [makeTx, chainId, D2A],
  )

  const decodeTxLogs = useCallback(
    (abi, logs) => {
      const contract = new ethers.Contract(
        '0x0000000000000000000000000000000000000000',
        abi,
      )

      const events = contract._jsonInterface.filter((o) => o.type === 'event')

      let ret = []
      for (const ev of events) {
        const lg = logs.find((g) => g.topics[0] === ev.signature)
        if (lg) {
          const r = ethers.abiCoder.decode([lg.data, lg.topics.slice(1)], ev.inputs)
          ret = [...ret, { ...r, name: ev.name }]
        }
      }

      return ret
    },
    [callProvider],
  )

  const verifyContract = useCallback(
    async (token, templateId, creator, param) => {
      let constructorParam = buildEncodedData(['address', 'bytes'], [creator, param])

      const fileContent = await (await fetch(`/contracts/Template${templateId}.sol`)).text()

      const data = {
        apikey: walletConfig[chainId].apiKey,
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: token,
        sourceCode: fileContent,
        codeformat: 'solidity-single-file',
        contractname: `SafuDeployerTemplate${templateId}`,
        compilerversion: 'v0.8.16+commit.07a7930e',
        optimizationused: 1,
        runs: 200,
        evmVersion: '',
        licenseType: 3,
        constructorArguements: constructorParam,
      }

      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url: walletConfig[chainId].apiUrl,
      }

      let result = await axios(options)
      return result.data
    },
    [buildEncodedData, chainId],
  )

  useEffect(() => {
    let ac = new AbortController()

    getTokenName(ADDRESS[chainId].token)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setTokenName(r))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getTokenSymbol(ADDRESS[chainId].token)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setTokenSymbol(r))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getTokenSymbol(ADDRESS[chainId].sArbet)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setSSymbol(r))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getTokenDecimals(ADDRESS[chainId].token)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setTokenDecimals(r))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    dispatch(setTokenAddress(ADDRESS[chainId].token))

    balanceOf(ADDRESS[chainId].token, wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setTokenBalance(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    balanceOf(ADDRESS[chainId].sArbet, wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setSBalance(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    tokenPriceToUSDT(1)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setPrice(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(setPrice('1.33'))
      })

    getPendingUSDT(ADDRESS[chainId].sArbet, wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setPendingUSDT(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getClaimedUSDT(ADDRESS[chainId].sArbet, wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setClaimedUSDT(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getTokenApprovedAmount(ADDRESS[chainId].token, wallet.address, ADDRESS[chainId].sArbet)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setSArbetAllowance(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    dispatch(setVaultAddress(ADDRESS[chainId].vault))

    balanceOf(ADDRESS[chainId].usdt, wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setUSDTBalance(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    balanceETH(wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setETHBalance(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

      getVaultDepositedUSDT(wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setDepositedUSDT(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    balanceOf(ADDRESS[chainId].usdt, ADDRESS[chainId].vault)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setVaultCap(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getPendingUSDT(ADDRESS[chainId].vault, wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setVaultPendingUSDT(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getClaimedUSDT(ADDRESS[chainId].vault, wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setVaultClaimedUSDT(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getWithdrawContext(wallet.address)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setUntilNextWithdraw(r[0]))
          dispatch(setWithdrawSteps(r[1]))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getTokenApprovedAmount(ADDRESS[chainId].usdt, wallet.address, ADDRESS[chainId].vault)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setVaultAllowance(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    getTokenApprovedAmount(ADDRESS[chainId].usdt, wallet.address, ADDRESS[chainId].house)
      .then((r) => {
        if (ac.signal.aborted === false) {
          dispatch(setDiceHouseAllowance(r.toString()))
          dispatch(setRouletteHouseAllowance(r.toString()))
        }
      })
      .catch((err) => {
        console.log(err)
      })

    return () => ac.abort()
  }, [
    dispatch,
    getTokenName,
    getTokenSymbol,
    getTokenDecimals,
    getOwner,
    balanceOf,
    balanceETH,
    tokenPriceToUSDT,
    ethAmountByUSDT,
    getPendingUSDT,
    getClaimedUSDT,
    getWithdrawContext,
    getTokenApprovedAmount,
    getVaultDepositedUSDT,
    wallet.address,
    reloadCounter,
    chainId,
  ])

  useEffect(() => {
    dispatch(setChainId(chainId))
    dispatch(setLabel(walletConfig[chainId].switchLabel))
    dispatch(setName(walletConfig[chainId].networkName))
    dispatch(setNetwork(walletConfig[chainId].network))
    dispatch(setBrand(walletConfig[chainId].brand))
    dispatch(setIcon(walletConfig[chainId].icon))
    dispatch(setLogo(walletConfig[chainId].logo))
    dispatch(setNativeCurrency(walletConfig[chainId].nativeCurrency))
    dispatch(setRPCUrl(walletConfig[chainId].rpcUrls[0]))
    dispatch(setBlockUrl(walletConfig[chainId].blockUrls[0]))

    dispatch(setWETH(ADDRESS[chainId].WETH))
    dispatch(setFactory(ADDRESS[chainId].factory))
    dispatch(setRouter(ADDRESS[chainId].router))
    dispatch(setUSDT(ADDRESS[chainId].usdt))
    dispatch(setToken(ADDRESS[chainId].token))
    dispatch(setSArbet(ADDRESS[chainId].sArbet))
    dispatch(setConsole(ADDRESS[chainId].console))
    dispatch(setVault(ADDRESS[chainId].vault))
    dispatch(setRNG(ADDRESS[chainId].rng))
    dispatch(setHouse(ADDRESS[chainId].house))
    dispatch(setDice(ADDRESS[chainId].dice))
    dispatch(setRoulette(ADDRESS[chainId].roulette))

    dispatch(setDexURL(walletConfig[chainId].ex.dex))
    dispatch(setTelegramURL(walletConfig[chainId].ex.telegram))
    dispatch(setTwitterURL(walletConfig[chainId].ex.twitter))
    dispatch(setLandingURL(walletConfig[chainId].ex.landing))
    dispatch(setDocURL(walletConfig[chainId].ex.docs))
  }, [dispatch, chainId])

  return (
    <ContractContext.Provider
      value={{
        reloadCounter,
        refreshPages,
        makeTx,
        makeTxWithNativeCurrency,
        A2D,
        D2A,
        balanceOf,
        getTokenApprovedAmount,
        approveToken,
        balanceETH,
        transferOwnership,
        renounceOwnership,
        getTokenName,
        getTokenSymbol,
        getTokenSupply,
        getOwner,
        isAddressFormat,
        buildEncodedData,
        verifyContract,
        tokenPriceToUSDT,
        wethBalanceByUSDT,
        stakeToSArbet,
        unstakeToSArbet,
        claimArbet,
        stakeToVault,
        unstakeToVault,
        claimVault,
        getMaxPayout,
        playDice,
        playRoulette,
        decodeTxLogs,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContract = () => {
  const contractManager = useContext(ContractContext)
  return contractManager || [{}]
}
