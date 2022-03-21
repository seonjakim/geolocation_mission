import { configureStore } from "@reduxjs/toolkit"
import mapsReducer from "./maps"
export default configureStore({
  reducer: {
    maps: mapsReducer,
  },
})
