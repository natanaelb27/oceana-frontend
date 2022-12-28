import { WalletHistoryQuery } from '../../types/query';
import { WalletTopUpRequest } from '../../types/request';

export const toWalletTopUpRequest = (
  cardNumber: string,
  txnId: string,
  amount: string,
  merchantCode: string,
  status: string,
  message: string,
  signature: string
): WalletTopUpRequest => ({
  card_number: cardNumber,
  txn_id: txnId,
  amount,
  merchant_code: merchantCode,
  status,
  message,
  signature,
});

export const toWalletHistoryQuery = (query: WalletHistoryQuery) => {
  let result = '';

  result += 'limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&filter-type=' + query.filterType;
  result +=
    '&filter-start-transaction-date=' + query.filterStartTransactionDate;
  result += '&filter-end-transaction-date=' + query.filterEndTransactionDate;

  return result;
};
