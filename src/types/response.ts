import {
  Address,
  Category,
  Merchant,
  MerchantVoucher,
  Metadata,
  Product,
  Profile,
  Role,
  User,
} from './component';

export type GetRolesResponse = {
  data: User[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type LoginResponse = {
  data: Role | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type RegisterResponse = {
  data: Profile | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetProfileResponse = {
  data: Profile | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateProfileResponse = {
  data: Profile | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAllCategoryResponse = {
  data: Category[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

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

export type GetAllProductsResponse = {
  data: Product[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateMerchantResponse = {
  data: Merchant | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetMerchantResponse = {
  data: Merchant;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetMerchantVoucherResponse = {
  data: {
    merchant_voucher: MerchantVoucher[];
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetMerchantVoucherDetailsResponse = {
  data: MerchantVoucher;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
