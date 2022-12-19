export interface SealabsPayAccount {
  id: string;
  card_number: string;
  active_date: string;
  name_on_card: string;
  is_default: boolean;
}

export interface SealabsPayTransaction {
  txn_id: string;
  amount: string;
  merchant_code: string;
  status: string;
  message: string;
  signature: string;
}
