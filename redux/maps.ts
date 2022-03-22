import { createSlice } from "@reduxjs/toolkit"

export const mapSlice = createSlice({
  name: "maps",
  initialState: {
    userInfo: {
      nickName: "",
      address: "",
      addressDetail: "",
      deliveryMessage: "",
    },
    addressList: [],
  },
  reducers: {
    setAddressList: (state, action) => {
      state.addressList = action.payload
    },
    setUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      }
    },
    getUserInfoFromLocalstorage: (state, action) => {
      state.userInfo = action.payload
    },
  },
})
export const { setAddressList, setUserInfo, getUserInfoFromLocalstorage } =
  mapSlice.actions
export default mapSlice.reducer
