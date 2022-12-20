export interface CourierService {
  id: number;
  code: string;
  description: string;
  is_selected: boolean;
  courier: Courier[];
}

export interface Courier {
  id: number;
  province_id: number;
  code: string;
  name: string;
  logo_url: string;
  is_selected: boolean;
  courier_services: CourierService[];
}

export interface Shipment {
  preorder_day: number;
  is_print_label: boolean;
  couriers: Courier[];
}
