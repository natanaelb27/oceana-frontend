export enum ProductsSortBy {
  Default = 0,
  Recommended,
  Newest,
  BestSeller,
  HighestPrice,
  LowestPrice,
}

export enum ProductsSortByString {
  Default = '',
  Recommended = 'recommended',
  Newest = 'newest',
  BestSeller = 'most-buy',
  Price = 'price',
}

export enum ProductsSortString {
  HighestPrice = 'desc',
  LowestPrice = 'asc',
}

export enum FavoriteProductsSortBy {
  Default = 0,
  RecentlySaved,
  OldestSaved,
  HighestPrice,
  LowestPrice,
}

export enum FavoriteProductsSortByString {
  Default = '',
  Saved = 'saved',
  Price = 'price',
}

export enum FavoriteProductsSortString {
  RecentlySaved = 'desc',
  OldestSaved = 'asc',
  HighestPrice = 'desc',
  LowestPrice = 'asc',
}

export enum ReviewsSort {
  Latest = 0,
  HighestRating,
  LowestRating,
}
