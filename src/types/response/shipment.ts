import { Shipment } from '../component/shipment';
import { Metadata } from '../component/metadata';

export type GetShipmentResponse = {
  data: Shipment | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateShipmentResponse = GetShipmentResponse;
