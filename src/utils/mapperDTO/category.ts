import { CategoryQuery } from '../../types/query';

export const toCategoryQuery = (query: CategoryQuery) => {
  let result = '';

  result += 'category-id=' + query.categoryID;
  result += '&level-depth=' + query.levelDepth;

  return result;
};
