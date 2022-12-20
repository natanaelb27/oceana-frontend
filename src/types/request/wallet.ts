export type ActivateWalletRequest = {
  pin: string;
  pin_confirmation: string;
};

export type WalletTopUpRequest = {
  card_number: string;
  txn_id: string;
  amount: string;
  merchant_code: string;
  status: string;
  message: string;
  signature: string;
};

export type ChangeWalletPinRequest = {
  pin: string;
  pin_confirmation: string;
};
