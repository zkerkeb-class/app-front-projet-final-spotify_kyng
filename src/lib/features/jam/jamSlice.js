import { createSlice } from '@reduxjs/toolkit';

const name = 'jam';
const initialState = {
  sessionId: '',
  users: [],
  socket: null,
};
export const jamSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSessionUrl: (state, action) => {
      state.sessionUrl = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
  },
});

export const { setUsers, setSessionId } = jamSlice.actions;

export default jamSlice.reducer;
