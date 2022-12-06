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
  maximum_quota: number;
};
