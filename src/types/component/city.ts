import { ProvinceDetails } from '../component';

export interface City {
  id: number;
  name: string;
}

export interface CityDetails {
  id: number;
  name: string;
  province_id: number;
  province: ProvinceDetails;
}
