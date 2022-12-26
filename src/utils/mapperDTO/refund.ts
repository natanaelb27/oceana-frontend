import { OrderDetailRefund } from '../../types/component/refund';

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
