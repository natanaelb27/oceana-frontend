import { CityDetails } from '../component';

export interface DistrictDetails {
  id: number;
  name: string;
  city_id: number;
  city: CityDetails;
}
