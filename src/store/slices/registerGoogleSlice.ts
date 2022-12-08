import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type RegisterGoogleState = {
  googleId: string;
  email: string;
  fullName: string;
  imageUrl: string;
};

const slice = createSlice({
  name: 'registerGoogle',
  initialState: {
    googleId: '',
    email: '',
    fullName: '',
    imageUrl: '',
  } as RegisterGoogleState,
  reducers: {
    setRegisterGoogleState: (
      state,
      {
        payload: { googleId, email, fullName, imageUrl },
      }: PayloadAction<{
        googleId: string;
        email: string;
        fullName: string;
        imageUrl: string;
      }>
    ) => {
      state.googleId = googleId;
      state.email = email;
      state.fullName = fullName;
      state.imageUrl = imageUrl;
    },
    unsetRegisterGoogleState: (state) => {
      state.googleId = '';
      state.email = '';
      state.fullName = '';
      state.imageUrl = '';
    },
  },
});

export const selectRegisterGoogleState = (state: RootState) =>
  state.registerGoogle;

export const { setRegisterGoogleState, unsetRegisterGoogleState } =
  slice.actions;

export default slice.reducer;
