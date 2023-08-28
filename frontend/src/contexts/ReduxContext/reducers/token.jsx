import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  symbol: '',
  decimals: 0,
  address: '',
  balance: '',
  sSymbol: '',
  sBalance: '',
  price: '',
  pendingUSDT: '',
  claimedUSDT: '',

  sArbetAllowance: '',
}

const token = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setTokenName: (state, action) => {
      state.name = action.payload
    },
    setTokenSymbol: (state, action) => {
      state.symbol = action.payload
    },
    setTokenDecimals: (state, action) => {
      state.decimals = action.payload
    },
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setSBalance: (state, action) => {
      state.sBalance = action.payload
    },
    setSSymbol: (state, action) => {
      state.sSymbol = action.payload
    },
    setPrice: (state, action) => {
      state.price = action.payload
    },
    setPendingUSDT: (state, action) => {
      state.pendingUSDT = action.payload
    },
    setClaimedUSDT: (state, action) => {
      state.claimedUSDT = action.payload
    },
    setSArbetAllowance: (state, action) => {
      state.sArbetAllowance = action.payload
    },
  },
})

export const { setTokenName, setTokenSymbol, setTokenDecimals, setAddress, setBalance, setSBalance, setSSymbol, setPrice, setPendingUSDT, setClaimedUSDT, setSArbetAllowance } =
  token.actions

export default token.reducer
