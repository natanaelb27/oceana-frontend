import { SubDistrictQuery } from '../../types/query';

export const toSubDistrictQuery = (query: SubDistrictQuery) => {
  let result = '';

  result += 'province=' + query.province;
  result += '&city=' + query.city;
  result += '&district=' + query.district;

  return result;
};
