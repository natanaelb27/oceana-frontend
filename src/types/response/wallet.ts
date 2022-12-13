import { Metadata, WalletDetails } from '../component';

export type GetWalletDetailsResponse = {
  data: WalletDetails | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
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
