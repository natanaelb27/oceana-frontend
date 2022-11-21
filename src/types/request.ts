export type Query = {
  sort: string;
  search: string;
  limit: number;
  page: number;
};

export type LoginRequest = {
  login_credentials: string;
  password: string; 
}

export type RegisterRequest = {
  full_name: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
}