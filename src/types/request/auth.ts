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
