export type GetRajaOngkirShippingCostRequest = {
  origin: number;
  destination: number;
  weight: number;
  courier: string;
  product_ids: number[];
};
