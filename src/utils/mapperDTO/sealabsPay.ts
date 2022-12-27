import {
  PaymentSealabsPayRequest,
  RegisterSealabsPayRequest,
} from '../../types/request';

export const toSealabsPayPaymentRequest = (
  nameOnCard: string | null,
  cardNumber: string,
  amount: string
): PaymentSealabsPayRequest => ({
  name_on_card: nameOnCard,
  card_number: cardNumber,
  amount,
});

export const toSealabsPayRegisterRequest = (
  nameOnCard: string,
  cardNumber: string,
  txnId: string,
  signature: string
): RegisterSealabsPayRequest => ({
  name_on_card: nameOnCard,
  card_number: cardNumber,
  txn_id: txnId,
  signature,
});
