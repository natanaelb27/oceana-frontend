import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type SealabsPayState = {
  cardNumber: string;
};

const slice = createSlice({
  name: 'sealabsPay',
  initialState: { cardNumber: '' } as SealabsPayState,
  reducers: {
    setCardNumber: (
      state,
      { payload: { cardNumber } }: PayloadAction<{ cardNumber: string }>
    ) => {
      state.cardNumber = cardNumber;
    },
    unsetCardNumber: (state) => {
      state.cardNumber = '';
    },
  },
});

export const selectCardNumber = (state: RootState) =>
  state.sealabsPay.cardNumber;

export const { setCardNumber, unsetCardNumber } = slice.actions;

export default slice.reducer;
