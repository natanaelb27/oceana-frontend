import {
  SealabsPayPaymentRequest,
  SealabsPayRegisterRequest,
} from '../../types/request';

export const toSealabsPayPaymentRequest = (
  nameOnCard: string | null,
  cardNumber: string,
  amount: string
): SealabsPayPaymentRequest => ({
  name_on_card: nameOnCard,
  card_number: cardNumber,
  amount,
});

export const toSealabsPayRegisterRequest = (
  nameOnCard: string,
  cardNumber: string,
  txnId: string,
  signature: string
): SealabsPayRegisterRequest => ({
  name_on_card: nameOnCard,
  card_number: cardNumber,
  txn_id: txnId,
  signature,
});
