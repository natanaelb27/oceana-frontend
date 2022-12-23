import { TransactionHistoryQuery } from '../../types/query';

export const toTransactionHistoryQuery = (query: TransactionHistoryQuery) => {
  let result = '';

  result += 'limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search=' + query.search;
  result += '&filter-order-status=' + query.filterOrderStatus;
  result += '&filter-ongoing-order-status=' + query.filterOngoingOrderStatus;
  result +=
    '&filter-start-transaction-date=' + query.filterStartTransactionDate;
  result += '&filter-end-transaction-date=' + query.filterEndTransactionDate;
  result += '&filter-is-reviewed=' + query.filterIsReviewed;

  return result;
};
