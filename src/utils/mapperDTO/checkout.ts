import { CheckoutCartOrderItem } from '../../types/component/checkout';
import { PayCartWithWalletRequest } from '../../types/request/checkout';

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
