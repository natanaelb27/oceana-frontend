import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartGroupedByMerchant } from '../../types/component';
import { RootState } from '../store';

type CartState = {
  cartGroupedByMerchants: CartGroupedByMerchant[];
};

const slice = createSlice({
  name: 'cart',
  initialState: {
    cartGroupedByMerchants: [],
  } as CartState,
  reducers: {
    setCart: (
      state,
      {
        payload: { cardGroupedByMerchants },
      }: PayloadAction<{ cardGroupedByMerchants: CartGroupedByMerchant[] }>
    ) => {
      state.cartGroupedByMerchants = cardGroupedByMerchants;
    },
    unsetCart: (state) => {
      state.cartGroupedByMerchants = [];
    },
  },
});

export const selectCart = (state: RootState) => state.sealabsPay.cardNumber;

export const { setCart, unsetCart } = slice.actions;

export default slice.reducer;
