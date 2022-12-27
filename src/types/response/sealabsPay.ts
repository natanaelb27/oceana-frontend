import {
  Metadata,
  SealabsPayAccount,
  SealabsPayTransaction,
} from '../component';

export type RedirectSealabsPayResponse = {
  data: string | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type PaymentSealabsPayResponse = {
  data: SealabsPayTransaction | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAllSealabsPayResponse = {
  data: SealabsPayAccount[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type RegisterSealabsPayResponse = {
  data: null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type DeleteSealabsPayResponse = {
  data: null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
