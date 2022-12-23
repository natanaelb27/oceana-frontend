import { cartApi } from '../store/services/cartService';
import {
  CartGroupedByMerchant,
  CartProduct,
  DeliveryService,
  MarketplaceVoucher,
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

export const calculateTotalBeforeShipping = (
  checkout: CartGroupedByMerchant[]
): number =>
  checkout.reduce(
    (partialTotal, currentMerchant) =>
      partialTotal + calculateSubtotal(currentMerchant.products),
    0
  );

export const calculateTotalWithShipping = (
  checkout: CartGroupedByMerchant[],
  deliveryService: DeliveryService | null
): number =>
  checkout.reduce(
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
  );

export const calculateTotal = (
  checkout: CartGroupedByMerchant[],
  deliveryService: DeliveryService | null,
  marketplaceVoucher: MarketplaceVoucher | null
): number => {
  if (!marketplaceVoucher) {
    return checkout.reduce(
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
    );
  }

  let total = 0;
  const totalBeforeShipping = calculateTotalBeforeShipping(checkout);
  const shippingFee =
    calculateTotalWithShipping(checkout, deliveryService) - totalBeforeShipping;
  if (marketplaceVoucher?.discount_type.toLocaleLowerCase() === 'percentage') {
    const discount = Math.min(
      (marketplaceVoucher.discount / 100) * totalBeforeShipping,
      marketplaceVoucher.maximum_discount_amount
    );
    total = totalBeforeShipping - discount + shippingFee;
  } else {
    total = totalBeforeShipping - marketplaceVoucher?.discount + shippingFee;
  }

  return total;
};

export const calculateTotalWeight = (products: CartProduct[]): number =>
  products.reduce(
    (partialTotalWeight, currentProduct) =>
      partialTotalWeight +
      currentProduct.product_weight * currentProduct.quantity,
    0
  );
