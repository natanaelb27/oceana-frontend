import {
  CartGroupedByMerchant,
  CartProduct,
  DeliveryService,
  MarketplaceVoucher,
  MerchantVoucher,
  MerchantVouchers,
} from '../types/component';

export const calculateDiscount = (
  voucher: MarketplaceVoucher | MerchantVoucher,
  totalBeforeShipping: number
) => {
  return !voucher
    ? 0
    : voucher.discount_type.toLocaleLowerCase() === 'percentage'
    ? Math.min(
        (voucher.discount / 100) * totalBeforeShipping,
        voucher.maximum_discount_amount
      )
    : voucher.discount;
};

export const calculateSubtotalBeforeShipping = (products: CartProduct[]) =>
  products.reduce(
    (partialSubtotal, currentProduct) =>
      partialSubtotal +
      currentProduct.price_after_discount * currentProduct.quantity,
    0
  );

export const calculateSubtotal = (
  products: CartProduct[],
  shippingFee = 0,
  merchantVoucher?: MerchantVoucher | null
): number => {
  const subtotalBeforeShipping = calculateSubtotalBeforeShipping(products);
  if (!merchantVoucher) {
    return subtotalBeforeShipping + shippingFee;
  }

  const discount = calculateDiscount(merchantVoucher, subtotalBeforeShipping);
  const subtotal = subtotalBeforeShipping - discount + shippingFee;

  return subtotal;
};

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
  deliveryService?: DeliveryService | null
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

export const calculateTotalDiscount = (
  checkout: CartGroupedByMerchant[],
  merchantVouchers: MerchantVouchers
) =>
  checkout.reduce(
    (partialDiscountTotal, currentMerchant) =>
      partialDiscountTotal +
      calculateDiscount(
        merchantVouchers[currentMerchant.merchant_id] as MerchantVoucher,
        calculateSubtotalBeforeShipping(currentMerchant.products)
      ),
    0
  );

export const calculateTotal = (
  checkout: CartGroupedByMerchant[],
  deliveryService: DeliveryService | null,
  marketplaceVoucher: MarketplaceVoucher | null,
  merchantVouchers: MerchantVouchers | null
): number => {
  const totalBeforeShipping = calculateTotalBeforeShipping(checkout);
  const shippingFee =
    calculateTotalWithShipping(checkout, deliveryService) - totalBeforeShipping;
  const discountMarketplace = !marketplaceVoucher
    ? 0
    : calculateDiscount(marketplaceVoucher, totalBeforeShipping);
  const discountMerchants = !merchantVouchers
    ? 0
    : calculateTotalDiscount(checkout, merchantVouchers);
  const total =
    totalBeforeShipping - discountMarketplace - discountMerchants + shippingFee;

  return total;
};

export const calculateTotalWeight = (products: CartProduct[]): number =>
  products.reduce(
    (partialTotalWeight, currentProduct) =>
      partialTotalWeight +
      currentProduct.product_weight * currentProduct.quantity,
    0
  );

export const isMarketplaceVoucher = (
  voucher: MarketplaceVoucher | MerchantVoucher
): boolean => 'name' in voucher;
