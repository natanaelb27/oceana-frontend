import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartGroupedByMerchant } from '../../types/component';
import { RootState } from '../store';

type CheckoutState = {
  transactionID: string;
  cartGroupedByMerchants: CartGroupedByMerchant[];
};

const slice = createSlice({
  name: 'checkout',
  initialState: {
    transactionID: '',
    cartGroupedByMerchants: [],
  } as CheckoutState,
  reducers: {
    setCheckout: (
      state,
      {
        payload: { cartGroupedByMerchants },
      }: PayloadAction<{ cartGroupedByMerchants: CartGroupedByMerchant[] }>
    ) => {
      state.cartGroupedByMerchants = cartGroupedByMerchants;
    },
    unsetCheckout: (state) => {
      state.cartGroupedByMerchants = [];
    },
    setTransactionID: (
      state,
      { payload: { transactionID } }: PayloadAction<{ transactionID: string }>
    ) => {
      state.transactionID = transactionID;
    },
    unsetTransactionID: (state) => {
      state.transactionID = '';
    },
  },
});

export const selectCheckout = (state: RootState) =>
  state.checkout.cartGroupedByMerchants;
export const selectTransactionID = (state: RootState) =>
  state.checkout.transactionID;

export const {
  setCheckout,
  unsetCheckout,
  setTransactionID,
  unsetTransactionID,
} = slice.actions;

export default slice.reducer;
