import { createSlice } from "@reduxjs/toolkit"

export const mapSlice = createSlice({
  name: "maps",
  initialState: {
    addresss: "",
    addressList: [],
  },
  reducers: {
    setAddressList: (state, action) => {
      state.addressList = action.payload
    },
    selectedAddress: (state, action) => {
      state.addresss = action.payload
    },
  },
})
export const { setAddressList, selectedAddress } = mapSlice.actions
export default mapSlice.reducer
