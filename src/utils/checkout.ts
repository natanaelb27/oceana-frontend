import { CartGroupedByMerchant, CartProduct } from '../types/component';

export const calculateSubtotal = (
  products: CartProduct[],
  shippingFee = 0,
  shopVoucher = 0
): number =>
  products.reduce(
    (partialSubtotal, currentProduct) =>
      partialSubtotal +
      currentProduct.price_after_discount * currentProduct.quantity,
    0
  ) +
  shippingFee -
  shopVoucher;

export const calculateTotal = (
  cart: CartGroupedByMerchant[],
  marketplaceVoucher = 0
): number =>
  cart.reduce(
    (partialTotal, currentMerchant) =>
      partialTotal + calculateSubtotal(currentMerchant.products),
    0
  ) - marketplaceVoucher;

export const calculateTotalWeight = (products: CartProduct[]): number =>
  products.reduce(
    (partialTotalWeight, currentProduct) =>
      partialTotalWeight +
      currentProduct.product_weight * currentProduct.quantity,
    0
  );
