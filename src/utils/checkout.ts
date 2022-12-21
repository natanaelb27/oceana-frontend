import {
  CartGroupedByMerchant,
  CartProduct,
  DeliveryService,
} from '../types/component';

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
  deliveryService: DeliveryService | null,
  marketplaceVoucher = 0
): number =>
  cart.reduce(
    (partialTotal, currentMerchant) =>
      partialTotal +
      calculateSubtotal(
        currentMerchant.products,
        !deliveryService
          ? 0
          : deliveryService[currentMerchant.merchant_id]?.courier_services[0]
              .shipping_fee
      ),
    0
  ) - marketplaceVoucher;

export const calculateTotalWeight = (products: CartProduct[]): number =>
  products.reduce(
    (partialTotalWeight, currentProduct) =>
      partialTotalWeight +
      currentProduct.product_weight * currentProduct.quantity,
    0
  );
