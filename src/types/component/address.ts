export interface Address {
  id: string;
  user_id: string;
  phone_number: string;
  name: string;
  detail: string;
  sub_district_id: number;
  sub_district: string;
  zip_code: string;
  district_id: number;
  district: string;
  city_id: number;
  city: string;
  province_id: number;
  province: string;
  is_default: boolean;
  is_shop_address: boolean;
}
