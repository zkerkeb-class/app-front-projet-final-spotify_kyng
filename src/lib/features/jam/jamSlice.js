import { createSlice } from '@reduxjs/toolkit';

const name = 'jam';
const initialState = {
  sessionUrl: '',
  sessionId: '',
  users: [],
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

export const { setSessionUrl, setUsers, setSessionId } = jamSlice.actions;

export default jamSlice.reducer;
