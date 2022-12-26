import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Textarea } from 'react-daisyui';
import { useNavigate, useParams } from 'react-router-dom';
import { DELIVERY_STATUS, MEDIA_TYPE } from '../../../constants';
import { useGetOrderDetailsQuery } from '../../../store/services/orderService';
import {
  useCreateRefundOrderMutation,
  useLazyGetCalculatedRefundDetailsQuery,
} from '../../../store/services/refundService';
import { OrderDetailRefund } from '../../../types/component/refund';
import { toRupiah } from '../../../utils/convert';
import { toCreateRefundOrderRequest } from '../../../utils/mapperDTO/refund';
import UploadFileCard from '../../common/UploadFileCard';
import OrderDetailSelection from './OrderDetailSelection';

type SelectOrderDetail = {
  orderDetailID: string;
  selectOrderDetail: boolean;
  quantity: number;
  totalQuantity: number;
  estimatedRefundPrice: number;
};

type Errors = {
  orderDetail: string[];
  selectedOrderDetail: string;
  reason: string;
  media: string;
};

const RefundCreate = () => {
  const navigate = useNavigate();
  const { orderID } = useParams();
  if (!orderID) {
    return null;
  }
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Errors>({
    orderDetail: [],
    selectedOrderDetail: '',
    reason: '',
    media: '',
  });
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<
    SelectOrderDetail[]
  >([
    {
      orderDetailID: '',
      quantity: 0,
      selectOrderDetail: false,
      totalQuantity: 0,
      estimatedRefundPrice: 0,
    },
  ]);
  const [totalRefund, setTotalRefund] = useState(0);
  const [createRefundOrder, { isLoading: createRefundOrderIsLoading }] =
    useCreateRefundOrderMutation();
  const {
    data: orderDetailsData,
    isLoading: orderDetailsIsLoading,
    error: orderDetailsError,
  } = useGetOrderDetailsQuery(orderID);
  const [getCalculatedRefundDetails] = useLazyGetCalculatedRefundDetailsQuery();

  if (
    !orderDetailsIsLoading &&
    orderDetailsData?.data?.order_status != DELIVERY_STATUS.COMPLAINED
  ) {
    navigate('/user/refund');
  }

  if (!orderDetailsIsLoading && orderDetailsError) {
    navigate('/user/refund');
  }

  useEffect(() => {
    if (!orderDetailsData?.data) {
      return;
    }
    const selectedOrderDetail: SelectOrderDetail[] = [];
    orderDetailsData.data.order_details.forEach((order_detail) => {
      getCalculatedRefundDetails({
        id: order_detail.order_detail_id,
        query: 'quantity=1',
      })
        .unwrap()
        .then((data) => {
          const amount = data?.data?.amount_user_get || 0;
          selectedOrderDetail.push({
            orderDetailID: order_detail.order_detail_id,
            quantity: 1,
            selectOrderDetail: false,
            totalQuantity: order_detail.quantity,
            estimatedRefundPrice: amount,
          });
        });
    });
    setSelectedOrderDetail(selectedOrderDetail);
  }, [orderDetailsData]);

  useEffect(() => {
    let sumAmount = 0;
    selectedOrderDetail.forEach((order_detail) => {
      if (order_detail.selectOrderDetail && order_detail.quantity > 0) {
        sumAmount += order_detail.quantity * order_detail.estimatedRefundPrice;
      }
    });
    setTotalRefund(Math.round(sumAmount));
  }, [selectedOrderDetail]);

  const handleSubmitRefundClick = () => {
    setErrors({
      orderDetail: [],
      selectedOrderDetail: '',
      reason: '',
      media: '',
    });

    const newErrors: Errors = {
      orderDetail: [],
      selectedOrderDetail: '',
      reason: '',
      media: '',
    };

    const selectedOD: OrderDetailRefund[] = [];
    const errorOD: string[] = [];

    selectedOrderDetail.forEach((orderDetailData) => {
      if (orderDetailData.selectOrderDetail) {
        if (orderDetailData.quantity !== 0) {
          selectedOD.push({
            order_detail_id: orderDetailData.orderDetailID,
            quantity: orderDetailData.quantity,
          });
          errorOD.push('');
        } else {
          errorOD.push('Input Required');
        }
      }
    });

    newErrors.orderDetail = errorOD;

    if (totalRefund === 0) {
      newErrors.selectedOrderDetail =
        'You must select an order detail to refund';
    }
    if (reason.trim() === '') {
      newErrors.reason = 'You must submit a reason to refund';
    }
    if (images.length === 0 && videos.length === 0) {
      newErrors.media = 'You must submit at least one media file to refund';
    }

    setErrors(newErrors);

    const isOrderDetailNotError = (value: string) => value === '';

    if (
      !newErrors.orderDetail.every(isOrderDetailNotError) ||
      newErrors.selectedOrderDetail != '' ||
      newErrors.reason != '' ||
      newErrors.media != ''
    ) {
      return;
    }

    createRefundOrder([
      toCreateRefundOrderRequest(selectedOD, reason, images, videos),
      orderID,
    ]).then(() => {
      navigate('/user/refund');
    });
  };

  const handleChangeReason = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setReason(target.value);
  };

  if (!orderDetailsData?.data || orderDetailsIsLoading) {
    return null;
  }

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Create Refund</h5>
      <Divider />
      <div className='flex flex-col gap-5'>
        <Card className='shadow'>
          <Card.Body>
            <span className='font-bold text-xl'>Which Items Are Missing?</span>
            <div className='flex flex-col gap-5'>
              {orderDetailsData.data.order_details.map((order_detail, i) => {
                return (
                  <OrderDetailSelection
                    key={i}
                    orderDetailData={order_detail}
                    selectedOrderDetail={selectedOrderDetail}
                    setSelectedOrderDetail={setSelectedOrderDetail}
                    idx={i}
                    errorOrderDetail={errors.orderDetail.at(i)}
                  ></OrderDetailSelection>
                );
              })}
            </div>
            <Divider className='m-0' />
            <div className='flex justify-between'>
              <span className='text-sm'>Estimated Total Refund</span>
              <div className='text-sm font-bold'>{toRupiah(totalRefund)}</div>
            </div>
            <span className='text-xs text-error'>
              {errors.selectedOrderDetail}
            </span>
          </Card.Body>
        </Card>
        <Card className='shadow'>
          <Card.Body>
            <div className='font-bold text-xl'>Reason for Refund</div>
            <Textarea
              onChange={handleChangeReason}
              value={reason}
              placeholder='Reason...'
              className='resize-none'
            />
            <span className='text-xs text-error'>{errors.reason}</span>
          </Card.Body>
        </Card>
        <Card className='shadow'>
          <Card.Body>
            <div className='font-bold text-xl'>Photo & Video Proof</div>
            <span className='text-xs'>
              Max. of 5 pictures and 1 video (Format .jpg, .jpeg, .png, .mp4,
              .mkv, .mov){' '}
            </span>
            <div className='flex items-center gap-2'>
              <UploadFileCard
                files={images}
                setFiles={setImages}
                uploadLimit={5}
                fileType={MEDIA_TYPE.IMAGE}
              />
              <UploadFileCard
                files={videos}
                setFiles={setVideos}
                uploadLimit={1}
                fileType={MEDIA_TYPE.VIDEO}
              />
            </div>
            <span className='text-xs text-error'>{errors.media}</span>
          </Card.Body>
        </Card>
      </div>
      <div className='flex justify-end'>
        <Button
          className='w-full md:w-48 mt-3 bg-primary hover:bg-secondary border-none transition-all duration-300'
          onClick={handleSubmitRefundClick}
          loading={createRefundOrderIsLoading}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default RefundCreate;
