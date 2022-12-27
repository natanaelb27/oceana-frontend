import { Metadata, RajaOngkirShippingService } from '../component';

export type GetRajaOngkirShippingCostResponse = {
  data: {
    code: string;
    name: string;
    costs: RajaOngkirShippingService[];
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
