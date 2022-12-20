export interface RajaOngkirShippingServiceCost {
  value: number;
  etd: string;
  note: string;
}

export interface RajaOngkirShippingService {
  service: string;
  description: string;
  cost: RajaOngkirShippingServiceCost[];
}
