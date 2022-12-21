import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartGroupedByMerchant } from '../../types/component';
import { RootState } from '../store';

type CheckoutState = {
  cartGroupedByMerchants: CartGroupedByMerchant[];
};

const slice = createSlice({
  name: 'checkout',
  initialState: {
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
  },
});

export const selectCart = (state: RootState) =>
  state.checkout.cartGroupedByMerchants;

export const { setCheckout, unsetCheckout } = slice.actions;

export default slice.reducer;
