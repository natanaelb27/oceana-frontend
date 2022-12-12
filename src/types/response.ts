import {
  Address,
  Category,
  Merchant,
  MerchantVoucher,
  Metadata,
  OrderList,
  OrderListDetail,
  Product,
  ProductDetail,
  Profile,
  Role,
  User,
  CartGroupedByMerchant,
  SealabsPayTransaction,
  PurchasedQuantities,
  UpdateCart,
  ShopInformation,
  ViewPost,
  FavoriteProduct,
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

export type GetProductDetailsResponse = {
  data: ProductDetail | null;
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
  data: UpdateCart | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetPurchasedQuantitiesResponse = {
  data: PurchasedQuantities | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
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

export type CreateMerchantVoucherResponse = {
  data: {
    id: number;
    merchant_id: number;
    code: string;
    start_datetime: string;
    end_datetime: string;
    discount_type: string;
    discount: number;
    minimum_spend_amount: number;
    maximum_discount_amount: number;
    maximum_quota: number;
    current_quota: number;
    created_at: string;
    updated_at: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateMerchantVoucherResponse = {
  data: {
    id: number;
    merchant_id: number;
    code: string;
    start_datetime: string;
    end_datetime: string;
    discount_type: string;
    discount: number;
    minimum_spend_amount: number;
    maximum_discount_amount: number;
    maximum_quota: number;
    current_quota: number;
    created_at: string;
    updated_at: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type DeleteMerchantVoucherResponse = {
  data: {
    id: number;
    merchant_id: number;
    code: string;
    start_datetime: string;
    end_datetime: string;
    discount_type: string;
    discount: number;
    minimum_spend_amount: number;
    maximum_discount_amount: number;
    maximum_quota: number;
    current_quota: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
  };
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type SealabsPayRedirectResponse = {
  data: string | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetShopInformationResponse = {
  data: ShopInformation | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type SealabsPayPaymentResponse = {
  data: SealabsPayTransaction | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type ViewPostResponse = {
  data: ViewPost | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type FavoriteProductResponse = {
  data: FavoriteProduct | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetFavoriteProductResponse = {
  data: FavoriteProduct | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
