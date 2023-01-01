import { rest } from 'msw';
import {
  LIMIT_HOME_ALL_PRODUCTS,
  LIMIT_HOME_RECOMMENDED_PRODUCTS,
  PRODUCT_STATUS,
} from '../constants';
import {
  GetAllCategoryResponse,
  GetAllProductsResponse,
} from '../types/response';
import { ProductsSortByString } from '../types/sort';
import { toCategoryQuery, toProductQuery } from '../utils/mapperDTO';
import { categoriesMock } from './categories';
import { productsMock } from './products';

const BASE_URL = process.env.REACT_APP_API_URL;

export const handlers = [
  rest.get(
    `${BASE_URL}/categories?${toCategoryQuery({
      categoryID: 0,
      levelDepth: 1,
    })}`,
    (_, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json<GetAllCategoryResponse>(categoriesMock),
        ctx.delay(30)
      )
  ),
  rest.get(
    `${BASE_URL}/products?${toProductQuery({
      search: '',
      sort: '',
      sortBy: ProductsSortByString.Recommended,
      limit: LIMIT_HOME_RECOMMENDED_PRODUCTS,
      page: 1,
      merchantID: 0,
      categoryID: 0,
      priceMinimum: 0,
      priceMaximum: 0,
      rating: 0,
      merchantCities: [],
      courierServices: [],
      status: PRODUCT_STATUS.ACTIVE,
    })}`,
    (_, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json<GetAllProductsResponse>(productsMock),
        ctx.delay(30)
      )
  ),
  rest.get(
    `${BASE_URL}/products?${toProductQuery({
      search: '',
      sort: '',
      sortBy: ProductsSortByString.Default,
      limit: LIMIT_HOME_ALL_PRODUCTS,
      page: 1,
      merchantID: 0,
      categoryID: 0,
      priceMinimum: 0,
      priceMaximum: 0,
      rating: 0,
      merchantCities: [],
      courierServices: [],
      status: PRODUCT_STATUS.ACTIVE,
    })}`,
    (_, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json<GetAllProductsResponse>(productsMock),
        ctx.delay(30)
      )
  ),
];
