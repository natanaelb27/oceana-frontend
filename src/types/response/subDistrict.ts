import { Metadata } from '../component';

export type ProvinceResponse = {
  id: number;
  name: string;
};

export type CityResponse = {
  id: number;
  name: string;
};

export type DistrictResponse = {
  id: number;
  name: string;
};

export type SubDistrictResponse = {
  id: number;
  name: string;
  zip_code: string;
};

export type GetSubDistrictsResponse = {
  data: {
    provinces: ProvinceResponse[];
    cities: CityResponse[];
    districts: DistrictResponse[];
    sub_districts: SubDistrictResponse[];
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
