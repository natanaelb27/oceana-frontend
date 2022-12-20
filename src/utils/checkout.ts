import { CartGroupedByMerchant, CartProduct } from '../types/component';

export const calculateSubtotal = (products: CartProduct[]): number =>
  products.reduce(
    (partialSubtotal, currentProduct) =>
      partialSubtotal +
      currentProduct.price_after_discount * currentProduct.quantity,
    0
  );

export const calculateTotal = (cart: CartGroupedByMerchant[]): number =>
  cart.reduce(
    (partialTotal, currentMerchant) =>
      partialTotal + calculateSubtotal(currentMerchant.products),
    0
  );

export const calculateTotalWeight = (products: CartProduct[]): number =>
  products.reduce(
    (partialTotalWeight, currentProduct) =>
      partialTotalWeight +
      currentProduct.product_weight * currentProduct.quantity,
    0
  );
