import { District } from '../component';

export interface SubDistrict {
  id: number;
  name: string;
  district_id: number;
  district: District;
  zip_code: string;
}
