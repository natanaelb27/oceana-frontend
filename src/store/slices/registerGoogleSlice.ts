import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type RegisterGoogleState = {
  googleId: string | null;
  email: string | null;
  fullName: string | null;
  imageUrl: string | null;
};

const slice = createSlice({
  name: 'auth',
  initialState: {
    googleId: null,
    email: null,
    fullName: null,
    imageUrl: null,
  } as RegisterGoogleState,
  reducers: {
    setRegisterGoogleState: (
      state,
      {
        payload: { googleId, email, fullName, imageUrl },
      }: PayloadAction<{
        googleId: string | null;
        email: string | null;
        fullName: string | null;
        imageUrl: string | null;
      }>
    ) => {
      state.googleId = googleId;
      state.email = email;
      state.fullName = fullName;
      state.imageUrl = imageUrl;
    },
    unsetRegisterGoogleState: (state) => {
      state.googleId = null;
      state.email = null;
      state.fullName = null;
      state.imageUrl = null;
    },
  },
});

export const selectRegisterGoogleState = (state: RootState) =>
  state.registerGoogle;

export const { setRegisterGoogleState, unsetRegisterGoogleState } =
  slice.actions;

export default slice.reducer;
