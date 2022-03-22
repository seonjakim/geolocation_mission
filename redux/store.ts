import { configureStore } from "@reduxjs/toolkit"
import mapsReducer from "./maps"
const store = configureStore({
  reducer: {
    maps: mapsReducer,
  },
})
export type RootState = ReturnType<typeof store.getState>
export default store
