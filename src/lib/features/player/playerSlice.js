import { createSlice } from '@reduxjs/toolkit';

const name = 'player';
const initialState = {
  currentTrack: undefined,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playMode: 'normal',
  isFullscreen: false,
  isLoading: false,
  tracks: [],
  isPlaying: false,
};

export const playerSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setIsMuted: (state, action) => {
      state.isMuted = action.payload;
    },
    setIsFullscreen: (state, action) => {
      state.isFullscreen = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTracks: (state, action) => {
      state.tracks = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export const {
  setCurrentTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  setIsMuted,
  setIsFullscreen,
  setIsLoading,
    setTracks,
    setIsPlaying,
} = playerSlice.actions;
export default playerSlice.reducer;
