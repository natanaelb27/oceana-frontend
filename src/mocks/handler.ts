import { rest } from 'msw';
import { GetAllCategoryResponse, GetProfileResponse } from '../types/response';
import { toCategoryQuery } from '../utils/mapperDTO';
import { categoriesMock } from './categories';
import { buyerProfileMocks } from './profile';

const BASE_URL = process.env.REACT_APP_API_URL;

export const handlers = [
  rest.get(`${BASE_URL}/profile`, (_, res, ctx) =>
    res(ctx.status(200), ctx.json<GetProfileResponse>(buyerProfileMocks))
  ),
  rest.get(
    `${BASE_URL}/categories?${toCategoryQuery({
      categoryID: 0,
      levelDepth: 1,
    })}`,
    (_, res, ctx) =>
      res(ctx.status(200), ctx.json<GetAllCategoryResponse>(categoriesMock))
  ),
];
