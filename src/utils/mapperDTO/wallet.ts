import { WalletTopUpRequest } from '../../types/request';

export const toWalletTopUpRequest = (
  cardNumber: string,
  txnId: string,
  amount: string,
  merchantCode: string,
  status: string,
  message: string,
  signature: string
): WalletTopUpRequest => ({
  card_number: cardNumber,
  txn_id: txnId,
  amount,
  merchant_code: merchantCode,
  status,
  message,
  signature,
});
