import { configureStore } from '@reduxjs/toolkit'
import playerReducer from './features/player/playerSlice'
export const makeStore = () => {
  return configureStore({
    reducer: {
      player: playerReducer,
    },
  })
}