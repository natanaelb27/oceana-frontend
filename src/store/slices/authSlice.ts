import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/component';

type AuthState = {
  user: User | null;
  token: string | null;
};

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
    unsetCredentials: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, unsetCredentials } = slice.actions;

export default slice.reducer;
