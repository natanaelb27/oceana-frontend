import { City } from '../component';

export interface District {
  id: number;
  name: string;
  city_id: number;
  city: City;
}
