export type Query = {
  search: string;
  sort: string;
  sortBy: string;
  limit: number;
  page: number;
};

export type ProductQuery = {
  merchantID: number;
  categoryID: number;
  priceMinimum: number;
  priceMaximum: number;
  merchantCities: string[];
  courierServices: string[];
} & Query;

export type MerchantVoucherQuery = {
  filterVoucherStatus: string;
  merchantID: number;
  searchVoucherCode: string;
} & Query;

export type MerchantProductQuery = {
  categoryID: number;
  priceMinimum: number;
  priceMaximum: number;
  merchantCities: string[];
  courierServices: string[];
} & Query;