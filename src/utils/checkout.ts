import {
  AvailableProductsForDelivery,
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

export const calculateSubtotalBeforeShipping = (
  products: CartProduct[],
  availableProductForDelivery?: number[]
) =>
  !availableProductForDelivery || availableProductForDelivery.length === 0
    ? products.reduce(
        (partialSubtotal, currentProduct) =>
          partialSubtotal +
          currentProduct.price_after_discount * currentProduct.quantity,
        0
      )
    : products
        .filter((product) =>
          availableProductForDelivery.includes(product.product_id)
        )
        .reduce(
          (partialSubtotal, currentProduct) =>
            partialSubtotal +
            currentProduct.price_after_discount * currentProduct.quantity,
          0
        );

export const calculateSubtotal = (
  products: CartProduct[],
  shippingFee = 0,
  merchantVoucher?: MerchantVoucher | null,
  availableProductForDelivery?: number[]
): number => {
  const subtotalBeforeShipping = calculateSubtotalBeforeShipping(
    products,
    availableProductForDelivery
  );
  if (!merchantVoucher) {
    return subtotalBeforeShipping + shippingFee;
  }

  const discount = calculateDiscount(merchantVoucher, subtotalBeforeShipping);
  const subtotal = subtotalBeforeShipping - discount + shippingFee;

  return subtotal;
};

export const calculateTotalBeforeShipping = (
  checkout: CartGroupedByMerchant[],
  availableProductForDelivery?: AvailableProductsForDelivery
): number =>
  checkout.reduce(
    (partialTotal, currentMerchant) =>
      partialTotal +
      calculateSubtotal(
        currentMerchant.products,
        0,
        null,
        availableProductForDelivery
          ? availableProductForDelivery[currentMerchant.merchant_id]
          : []
      ),
    0
  );

export const calculateTotalWithShipping = (
  checkout: CartGroupedByMerchant[],
  deliveryService?: DeliveryService | null,
  availableProductForDelivery?: AvailableProductsForDelivery
): number =>
  checkout.reduce(
    (partialTotal, currentMerchant) =>
      partialTotal +
      calculateSubtotal(
        currentMerchant.products,
        !deliveryService
          ? 0
          : deliveryService[currentMerchant.merchant_id]?.courier_services[0]
              .shipping_fee,
        null,
        availableProductForDelivery
          ? availableProductForDelivery[currentMerchant.merchant_id]
          : []
      ),
    0
  );

export const calculateTotalMerchantDiscount = (
  checkout: CartGroupedByMerchant[],
  merchantVouchers: MerchantVouchers,
  availableProductForDelivery?: AvailableProductsForDelivery
) =>
  checkout.reduce(
    (partialDiscountTotal, currentMerchant) =>
      partialDiscountTotal +
      calculateDiscount(
        merchantVouchers[currentMerchant.merchant_id] as MerchantVoucher,
        calculateSubtotalBeforeShipping(
          currentMerchant.products,
          availableProductForDelivery
            ? availableProductForDelivery[currentMerchant.merchant_id]
            : []
        )
      ),
    0
  );

export const calculateTotal = (
  checkout: CartGroupedByMerchant[],
  deliveryService: DeliveryService | null,
  marketplaceVoucher: MarketplaceVoucher | null,
  merchantVouchers: MerchantVouchers | null,
  availableProductForDelivery?: AvailableProductsForDelivery
): number => {
  const totalBeforeShipping = calculateTotalBeforeShipping(
    checkout,
    availableProductForDelivery
  );
  const shippingFee =
    calculateTotalWithShipping(
      checkout,
      deliveryService,
      availableProductForDelivery
    ) - totalBeforeShipping;
  const discountMarketplace = !marketplaceVoucher
    ? 0
    : calculateDiscount(marketplaceVoucher, totalBeforeShipping);
  const discountMerchants = !merchantVouchers
    ? 0
    : calculateTotalMerchantDiscount(
        checkout,
        merchantVouchers,
        availableProductForDelivery
      );
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
