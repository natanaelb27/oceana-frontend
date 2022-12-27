export interface RajaOngkirShippingServiceCost {
  value: number;
  etd: string;
  note: string;
}

export interface RajaOngkirShippingService {
  courier_service_id: number;
  service: string;
  description: string;
  cost: RajaOngkirShippingServiceCost[];
}
