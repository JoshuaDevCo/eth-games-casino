import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  houseAllowance: 0,
  bet: {
    cast: 0,
    payout: 0,
    deposit: 0,
  }
}

const coinflip = createSlice({
  name: 'coinflip',
  initialState,
  reducers: {
    setHouseAllowance: (state, action) => {
      state.houseAllowance = action.payload
    },
    setBetResult: (state, action) => {
      state.bet.cast = action.payload.cast
      state.bet.payout = action.payload.payout
      state.bet.deposit = action.payload.deposit
    },
  },
})

export const { setHouseAllowance, setBetResult } = coinflip.actions

export default coinflip.reducer
