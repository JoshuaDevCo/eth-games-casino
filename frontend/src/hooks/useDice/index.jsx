import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useContract } from '../../contexts/ContractContext'
import Dice_abi from '../../contexts/ContractContext/abi/games/GameDice.sol/GameDice.json'
import { setBetResult } from '../../contexts/ReduxContext/reducers/dice'
import { setWinLose } from '../../contexts/ReduxContext/reducers/game'
import BigNumber from 'bignumber.js'
import { useGlobal } from '../../contexts/GlobalContext'
import { toast } from 'react-toastify'

const useDice = (betDices, betAmount) => {
  const { getMaxPayout, approveToken, refreshPages, playDice, decodeTxLogs, A2D } = useContract()
  const { contracts } = useSelector((state) => state.chain)
  const { balance, vaultCap} = useSelector(state => state.vault)
  const { cutDecimal } = useGlobal()

  const [maxPayout, setMaxPayout] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    let ac = new AbortController()
    getMaxPayout(
      contracts.dice,
      0,
      betDices,
    )
      .then((r) => {
        if (ac.signal.aborted === false) {
          setMaxPayout(r)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    return () => ac.abort()
  }, [betDices, getMaxPayout, contracts.dice])

  const approveUSDTForHouse = useCallback(() => {
    const id = toast.loading(`Approving USDT...`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    approveToken(contracts.usdt, contracts.house)
      .then((tx) => {
        toast.update(id, {
          render: "Approval: " + tx.transactionHash,
          type: "success",
          isLoading: false,
        });
        refreshPages()
      })
      .catch((err) => {
        console.log(`${err.message}`)
        toast.update(id, {
          render: "Approval: " + err.message,
          type: "error",
          isLoading: false,
        });
      })
  }, [
    approveToken,
    contracts.usdt,
    contracts.house,
    refreshPages,
  ])

  const play = useCallback(() => {
    if (BigNumber(betAmount).eq(0)) {
      toast.error('Please input bet amount', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      return
    }
    const maxBet = BigNumber(vaultCap).times(0.025).div(BigNumber(maxPayout))
    if (BigNumber(betAmount).gt(maxBet)) {
      toast.error('You bet over maximum bet amount ' + cutDecimal(maxBet.toString(), 6) + ' USDT', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      return
    }

    if (BigNumber(betAmount).gt(BigNumber(balance))) {
      toast.error('You bet over your USDT balance ' + balance, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      return
    }

    const id = toast.loading(`Casting a Dice for ${betDices}...`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })

    playDice(betDices, betAmount)
      .then((tx) => {
        // console.log('--->', tx)
        refreshPages()
        toast.update(id, {
          isLoading: false,
        });

        const logs = decodeTxLogs(Dice_abi.abi, tx.logs)
        const gameInfo = logs.find((r) => r.name === 'GameEnd')
        console.log('dice play result:', tx.logs, gameInfo)
        if (gameInfo) {
          A2D(contracts.usdt, gameInfo._payout).then((r) => {
            if (parseFloat(r.toString()) > betAmount) {
              toast.update(id, {
                render: 'You won',
                type: 'success'
              })
              dispatch(setWinLose(true))
            } else {
              toast.update(id, {
                render: 'You lost',
                type: 'error'
              })
              dispatch(setWinLose(false))
            }

            dispatch(
              setBetResult({
                cast: parseInt(gameInfo._rolls[0]),
                deposit: betAmount,
                payout: parseFloat(r.toString()),
              }),
            )
          })
        }
      })
      .catch((err) => {
        console.log(`${err.message}`)
        toast.update(id, {
          render: err.message,
          isLoading: false,
          type: 'error'
        })
      })
  }, [
    playDice,
    refreshPages,
    betDices,
    betAmount,
    cutDecimal,
    maxPayout,
    balance,
    vaultCap,
    decodeTxLogs,
    A2D,
    contracts.usdt,
    dispatch,
  ])

  return { maxPayout, approveUSDTForHouse, play }
}

export default useDice
