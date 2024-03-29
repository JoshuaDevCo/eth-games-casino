import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  houseAllowance: 0,
  bet: {
    cast: 0,
    payout: 0,
    deposit: 0,
  }
}

const rps = createSlice({
  name: 'rps',
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

export const { setHouseAllowance, setBetResult } = rps.actions

export default rps.reducer
