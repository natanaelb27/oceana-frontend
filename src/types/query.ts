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
