import { DistrictDetails } from '../component';

export interface SubDistrictDetails {
  id: number;
  name: string;
  district_id: number;
  district: DistrictDetails;
  zip_code: string;
}
