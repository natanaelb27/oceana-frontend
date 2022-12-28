export type WalletTransactionHistory = {
  id: string;
  wallet_id: string;
  amount: number;
  transaction_datetime: string;
  transaction_type: string;
  type: string;
};

export type WalletDetails = {
  id: string;
  user_id: string;
  balance: number;
  is_active: boolean;
  wallet_transaction_history: WalletTransactionHistory[];
};
