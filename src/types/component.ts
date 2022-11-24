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

export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  province_id: number;
  province: Province;
}

export interface District {
  id: number;
  name: string;
  city_id: number;
  city: City;
}

export interface SubDistrict {
  id: number;
  name: string;
  district_id: number;
  district: District;
  zip_code: string;
}

export interface Address {
  id: string;
  user_id: string;
  user: Profile;
  name: string;
  detail: string;
  sub_district_id: number;
  sub_district: SubDistrict;
  is_default: boolean;
}
export interface Category {
  id: number;
  name: string;
  level: number;
  category: Category[];
}
