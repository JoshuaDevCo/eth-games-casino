import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  address: "",
  balance: "",
  depositedUSDT: "",
  pendingUSDT: "",
  claimedUSDT: "",
  vaultAllowance: "",
  vaultCap: '',
  untilNextWithdraw: 0,
  withdrawSteps: 0
}

const vault = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setBalance: (state, action) => {
      state.balance = action.payload
    },
    setVaultAllowance: (state, action) => {
      state.vaultAllowance = action.payload
    },
    setVaultCap: (state, action) => {
      state.vaultCap = action.payload
  },
  },
})

export const { setAddress, setBalance, setVaultAllowance, setVaultCap } = vault.actions

export default vault.reducer
