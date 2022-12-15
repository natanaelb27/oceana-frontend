export type SealabsPayRegisterRequest = {
  name_on_card: string;
  card_number: string;
  txn_id: string;
  signature: string;
};

export type SealabsPayPaymentRequest = {
  name_on_card: string | null;
  card_number: string;
  amount: string;
};
