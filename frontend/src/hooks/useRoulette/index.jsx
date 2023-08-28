import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useContract } from '../../contexts/ContractContext'
import Roulette_abi from '../../contexts/ContractContext/abi/games/GameRoulette.sol/GameRoulette.json'
import { setBetResult } from '../../contexts/ReduxContext/reducers/roulette'
import BigNumber from 'bignumber.js'
import { setWinLose } from '../../contexts/ReduxContext/reducers/game'
import { useGlobal } from '../../contexts/GlobalContext'
import { toast } from 'react-toastify'

const useRoulette = (chipData) => {
  const { getMaxPayout, approveToken, refreshPages, playRoulette, decodeTxLogs, A2D } = useContract()
  const { contracts } = useSelector((state) => state.chain)
  const usdtPerChip = useSelector((state) => state.roulette.usdtPerChip)
  const { balance, vaultCap } = useSelector(state => state.vault)
  const { cutDecimal } = useGlobal()

  const [maxPayout, setMaxPayout] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    let ac = new AbortController()
    getMaxPayout(contracts.roulette, '0', chipData)
      .then((r) => {
        if (ac.signal.aborted === false) {
          setMaxPayout(r)
        }
      })
      .catch((err) => {
        console.log(err)
      })
    return () => ac.abort()
  }, [getMaxPayout, contracts.roulette, chipData])

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
    const chipSum = chipData.reduce((c, v) => BigNumber(c).plus(BigNumber(v)).toString(), '0')
    const totalUSDTdeposit = BigNumber(chipSum).times(usdtPerChip).toNumber()

    if (BigNumber(totalUSDTdeposit).eq(0)) {
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
    if (BigNumber(totalUSDTdeposit).gt(maxBet)) {
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

    if (BigNumber(totalUSDTdeposit).gt(BigNumber(balance))) {
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

    const id = toast.loading(`Rolling a Roulette...`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    })

    playRoulette(chipData)
      .then((tx) => {
        refreshPages()
        toast.update(id, {
          isLoading: false,
        });

        const logs = decodeTxLogs(Roulette_abi.abi, tx.logs)
        const gameInfo = logs.find((r) => r.name === 'GameEnd')
        console.log('roulette play result:', tx.logs, gameInfo)
        if (gameInfo) {
          A2D(contracts.usdt, gameInfo._payout).then((r) => {
            if (parseFloat(r.toString()) > totalUSDTdeposit) {
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
                chipCount: chipSum,
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
          type: 'error',
          isLoading: false
        })
      })
  }, [
    decodeTxLogs,
    A2D,
    dispatch,
    contracts.usdt,
    playRoulette,
    refreshPages,
    chipData,
    usdtPerChip,
    cutDecimal,
    maxPayout,
    balance,
    vaultCap,
  ])

  return { maxPayout, approveUSDTForHouse, play }
}

export default useRoulette
