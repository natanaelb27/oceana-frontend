import { OrderDetailRefund } from '../../types/component/';
import { RefundQuery } from '../../types/query';

export const toCreateRefundOrderRequest = (
  order_detail: OrderDetailRefund[],
  reason: string,
  photo: File[],
  video: File[]
): FormData => {
  const formData = new FormData();
  const orderDetailString = JSON.stringify(order_detail);

  for (let i = 0; i < photo.length; i++) {
    formData.append('photo_' + (i + 1), photo[i]);
  }

  if (video.length > 0) {
    formData.append('video', video[0]);
  }

  formData.append('reason', reason);
  formData.append('order_detail_refund_form', orderDetailString);

  return formData;
};

export const toRefundQuery = (query: RefundQuery) => {
  let result = '';

  result += 'sort=' + query.sort;
  result += '&sort-by=' + query.sortBy;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search-invoice=' + query.searchInvoice;
  result += '&filter-grouped-status=' + query.filterGroupedStatus;
  result += '&filter-status=' + query.filterStatus;
  result += '&filter-start-date=' + query.filterStartDate;
  result += '&filter-end-date=' + query.filterEndDate;
  return result;
};
