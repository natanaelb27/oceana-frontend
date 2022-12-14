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
        payload: { cartGroupedByMerchants },
      }: PayloadAction<{ cartGroupedByMerchants: CartGroupedByMerchant[] }>
    ) => {
      state.cartGroupedByMerchants = cartGroupedByMerchants;
    },
    unsetCart: (state) => {
      state.cartGroupedByMerchants = [];
    },
  },
});

export const selectCart = (state: RootState) =>
  state.cart.cartGroupedByMerchants;

export const { setCart, unsetCart } = slice.actions;

export default slice.reducer;
