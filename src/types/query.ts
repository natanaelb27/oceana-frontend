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
  limit: number;
  page: number;
  sortBy: string;
  sort: string;
  searchVoucherCode: string;
  filterVoucherStatus: string;
  merchantID: number;
};

export type TransactionHistoryQuery = {
  search: string;
  filterOrderStatus: string;
  filterOngoingOrderStatus: string;
  filterStartTransactionDate: string;
  filterEndTransactionDate: string;
  limit: number;
  page: number;
};

export type SubDistrictQuery = {
  province: string;
  city: string;
  district: string;
};
