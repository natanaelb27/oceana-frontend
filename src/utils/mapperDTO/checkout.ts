import { CheckoutCartOrderItem } from '../../types/component';
import {
  PayCartWithWalletRequest,
  ProductCheckCourierServiceRequest,
} from '../../types/request';

export const toPayCartWithWalletRequest = (
  cartOrderItems: CheckoutCartOrderItem[],
  cartIDs: number[],
  marketplaceVoucherID: number | null,
  addressID: string,
  pin: string,
  totalPayment: number
): PayCartWithWalletRequest => ({
  cart_order_items: cartOrderItems,
  cart_ids: cartIDs,
  marketplace_voucher_id: marketplaceVoucherID,
  address_id: addressID,
  pin,
  total_payment: totalPayment,
});

export const toProductCheckCourierService = (
  courierCode: string,
  courierServiceCode: string,
  productIDs: number[]
): ProductCheckCourierServiceRequest => ({
  courier_code: courierCode,
  courier_service_code: courierServiceCode,
  product_ids: productIDs,
});
