import { City, Metadata } from '../component';

export type GetAllCityResponse = {
  data: City[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
