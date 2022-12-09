import {
  Address,
  Category,
  CategoryDetails,
  Merchant,
  Metadata,
  OrderList,
  OrderListDetail,
  Product,
  Profile,
  Role,
  User,
  CartGroupedByMerchant,
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

export type GetUserCartResponse = {
  data: CartGroupedByMerchant[] | null;
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

export type UpdateUserCartResponse = {
  id: number;
  product_item_id: number;
  user_id: string;
  quantity: number;
};

export type GetAllTransactionHistoryResponse = {
  data: {
    order_list: OrderList[];
  } | null;
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

export type GetOrderDetailsResponse = {
  data: OrderListDetail | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetMerchantResponse = {
  data: Merchant | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetAncestorsCategoryResponse = {
  data: CategoryDetails[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
