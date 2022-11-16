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