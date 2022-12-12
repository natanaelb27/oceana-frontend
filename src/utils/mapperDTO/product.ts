import { ProductQuery, PurchasedQuantitiesQuery } from '../../types/query';

export const toProductQuery = (query: ProductQuery) => {
  let result = '';

  result += 'search=' + query.search;
  result += '&sort-by=' + query.sortBy;
  result += '&sort=' + query.sort;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&merchant-id=' + query.merchantID;
  result += '&category-id=' + query.categoryID;
  result += '&price-minimum=' + query.priceMinimum;
  result += '&price-maximum=' + query.priceMaximum;
  result += '&merchant-cities=' + query.merchantCities.join(',');
  result += '&courier-services=' + query.courierServices.join(',');

  return result;
};

export const toPurchasedQuantitiesQuery = (query: PurchasedQuantitiesQuery) => {
  let result = '';

  result += 'product-id=' + query.product_id;
  result += '&product-item-id=' + query.product_item_id;
  result += '&quantity=' + query.quantity;
  return result;
};
