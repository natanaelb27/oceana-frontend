export type RegisterSealabsPayRequest = {
  name_on_card: string;
  card_number: string;
  txn_id: string;
  signature: string;
};

export type PaymentSealabsPayRequest = {
  name_on_card: string | null;
  card_number: string;
  amount: string;
};
