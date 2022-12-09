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

export type UpdateUserCartRequest = {
  product_item_id: number;
  quantity: number;
};

export type SealabsPayPaymentRequest = {
  card_number: string;
  amount: string;
};
