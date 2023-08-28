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
    setDepositedUSDT: (state, action) => {
      state.depositedUSDT = action.payload
    },
    setPendingUSDT: (state, action) => {
        state.pendingUSDT = action.payload
    },
    setClaimedUSDT: (state, action) => {
        state.claimedUSDT = action.payload
    },
    setVaultAllowance: (state, action) => {
      state.vaultAllowance = action.payload
  },
    setUntilNextWithdraw: (state, action) => {
        state.untilNextWithdraw = action.payload
    },
    setWithdrawSteps: (state, action) => {
        state.withdrawSteps = action.payload
    },
    setVaultCap: (state, action) => {
      state.vaultCap = action.payload
  },
  },
})

export const { setAddress, setBalance, setDepositedUSDT, setPendingUSDT, setClaimedUSDT, setVaultAllowance, setUntilNextWithdraw, setWithdrawSteps, setVaultCap } = vault.actions

export default vault.reducer
