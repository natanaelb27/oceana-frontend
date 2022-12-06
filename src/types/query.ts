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

export type TransactionHistoryQuery = {
  search: string;
  filterOrderStatus: string;
  filterOngoingOrderStatus: string;
  filterStartTransactionDate: string;
  filterEndTransactionDate: string;
  limit: number;
  page: number;
};

export type PurchasedQuantitiesQuery = {
  product_id: number;
  product_item_id: number;
  quantity: number;
}
