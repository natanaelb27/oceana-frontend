import { Metadata, WalletDetails } from '../component';

export type GetWalletDetailsResponse = {
  data: WalletDetails | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
