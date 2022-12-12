export type LoginRequest = {
  login_credentials: string;
  password: string;
};

export type RegisterRequest = {
  full_name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
};

export type LoginWithGoogleRequest = {
  google_id: string;
  full_name: string;
  email: string;
  image_url: string;
};

export type RegisterWithGoogleRequest = {
  google_id: string;
  full_name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
  image_url: string;
};

export type UpdateProfileRequest = {
  full_name?: string;
  gender?: string;
  birthdate?: string;
};

export type UpdateProfileEmailRequest = {
  email: string;
};

export type CreateAddressRequest = {
  name: string;
  detail: string;
  sub_district_id: number;
};

export type UpdateAddressRequest = {
  name: string;
  detail: string;
  sub_district_id: number;
};

export type CreateMerchantVoucherRequest = {
  code: string;
  start_datetime: string;
  end_datetime: string;
  discount_type: string;
  discount: number;
  minimum_spend_amount: number;
  maximum_discount_amount: number | null;
  maximum_quota: number;
};
export type UpdateUserCartRequest = {
  product_item_id: number;
  quantity: number;
};
