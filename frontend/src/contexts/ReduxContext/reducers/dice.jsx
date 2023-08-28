import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'

const initialState = {
  clickedPoints: [],
  boardData: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  houseAllowance: '',
  usdtPerChip: 0.01,
  bet: {
    cast: 0,
    payout: 0,
    deposit: 0,
  }
}

const dice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    setCases: (state, action) => {
      state.clickedPoints = action.payload
      state.boardData = Array.from({ length: 50 }).map((t) => 0)

      for (const point of action.payload) {
        const totalChips = point.chips.reduce((c, v) => c + v, 0)
        const totalPos = point.value.length
        for (const v of point.value) {
          state.boardData[v] = BigNumber(state.boardData[v])
            .plus(BigNumber(totalChips).div(totalPos))
            .toNumber()
        }
      }

      state.totalChips = state.boardData
        .reduce((c, v) => {
          return c + v
        }, 0)
    },
    setHouseAllowance: (state, action) => {
      state.houseAllowance = action.payload
    },
    setBetResult: (state, action) => {
      state.bet.cast = action.payload.cast
      state.bet.deposit = BigNumber(action.payload.chipCount).times(BigNumber(state.usdtPerChip)).toNumber()
      state.bet.payout = action.payload.payout
    },
  },
})

export const { setCases, setHouseAllowance, setBetResult } = dice.actions

export default dice.reducer
