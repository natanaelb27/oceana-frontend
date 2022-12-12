import { Province } from '../component';

export interface City {
  id: number;
  name: string;
  province_id: number;
  province: Province;
}
