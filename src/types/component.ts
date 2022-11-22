export interface Metadata {
  records_total: number;
  records_filter: number;
  page: number;
}

export interface User {
  id: string;
  name: string;
}

export interface Role {
  role: string;
}

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  gender?: string;
  photo?: string;
  birthdate?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  level: number;
  category: Category[];
}