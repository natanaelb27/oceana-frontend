import { CityQuery } from '../../types/query';

export const toCityQuery = (query: CityQuery) => {
  let result = '';

  result += 'search=' + query.search;

  return result;
};
