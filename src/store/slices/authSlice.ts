import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type AuthState = {
  role: string | null;
};

const slice = createSlice({
  name: 'auth',
  initialState: { role: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { role } }: PayloadAction<{ role: string }>
    ) => {
      state.role = role;
    },
    unsetCredentials: (state) => {
      state.role = null;
    },
  },
});

export const selectRole = (state: RootState) => state.auth.role;

export const { setCredentials, unsetCredentials } = slice.actions;

export default slice.reducer;
