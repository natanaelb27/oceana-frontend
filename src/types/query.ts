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
  rating: number;
  merchantCities: string[];
  courierServices: string[];
  status: string;
} & Query;

export type MerchantVoucherQuery = {
  limit: number;
  page: number;
  sortBy: string;
  sort: string;
  searchVoucherCode: string;
  filterVoucherStatus: string;
  filterVoucherAvailability?: string;
  merchantID: number;
};

export type MerchantPromotionQuery = {
  limit: number;
  page: number;
  searchPromotionName: string;
  filterPromotionStatus: string;
};

export type MarketplaceVoucherQuery = {
  limit: number;
  page: number;
  sortBy: string;
  sort: string;
  searchVoucherName: string;
  filterVoucherStatus: string;
  filterVoucherAvailability: string;
};

export type TransactionHistoryQuery = {
  search: string;
  filterOrderStatus: string;
  filterOngoingOrderStatus: string;
  filterStartTransactionDate: string;
  filterEndTransactionDate: string;
  filterIsReviewed: string;
  limit: number;
  page: number;
};

export type CategoryQuery = {
  categoryID?: number;
  levelDepth: number;
};

export type CityQuery = {
  search: string;
};

export type SubDistrictQuery = {
  province: string;
  city: string;
  district: string;
};

export type PurchasedQuantitiesQuery = {
  product_id: number;
  product_item_id: number;
  quantity: number;
};

export type MerchantProductQuery = {
  categoryID: number;
  priceMinimum: number;
  priceMaximum: number;
  merchantCities: string[];
  courierServices: string[];
} & Query;

export type ReviewQuery = {
  sort: string;
  sort_by: string;
  limit: number;
  page: number;
  media: boolean;
  comment: boolean;
  rating: number[];
};

export type AvailableProductQuery = {
  search: string;
  filterCategory: number;
  filterStartDatetime: Date | null;
  filterEndDatetime: Date | null;
};

export type RefundQuery = {
  sort: string;
  sortBy: string;
  limit: number;
  page: number;
  searchInvoice: string;
  filterGroupedStatus: string;
  filterStatus: string;
  filterStartDate: string;
  filterEndDate: string;
};

export type WalletHistoryQuery = {
  filterType: string;
  filterStartTransactionDate: string;
  filterEndTransactionDate: string;
  limit: number;
  page: number;
};
