import { ReviewQuery } from '../../types/query';

export const toReviewQuery = (query: ReviewQuery) => {
  let result = '';

  result += 'sort=' + query.sort;
  result += '&sort-by=' + query.sort_by;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&media=' + query.media;
  result += '&comment=' + query.comment;
  result += '&rating=' + query.rating.join(',');
  return result;
};
