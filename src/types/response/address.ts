import { Address, Metadata } from '../component';

export type GetAddressesResponse = {
  data: Address[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAddressResponse = {
  data: Address | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CreateAddressResponse = {
  data: {
    id: string;
    user_id: string;
    name: string;
    detail: string;
    sub_district_id: number;
    is_default: boolean;
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateAddressResponse = {
  data: {
    id: string;
    user_id: string;
    name: string;
    detail: string;
    sub_district_id: number;
    is_default: boolean;
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type DeleteAddressResponse = {
  data: {
    id: string;
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
