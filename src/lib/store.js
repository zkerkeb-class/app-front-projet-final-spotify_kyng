import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './features/player/playerSlice';
import jamReducer from './features/jam/jamSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      player: playerReducer,
      jam: jamReducer,
    },
  });
};
