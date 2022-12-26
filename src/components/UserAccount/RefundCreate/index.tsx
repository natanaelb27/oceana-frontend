import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Card, Divider, Input, Textarea } from 'react-daisyui';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { MEDIA_TYPE } from '../../../constants';
import { useGetOrderDetailsQuery } from '../../../store/services/orderService';
import {
  useCreateRefundOrderMutation,
  useLazyGetCalculatedRefundDetailsQuery,
} from '../../../store/services/refundService';
import { OrderDetailRefund } from '../../../types/component/refund';
import { toRupiah } from '../../../utils/convert';
import { toCreateRefundOrderRequest } from '../../../utils/mapperDTO/refund';
import { titleCase } from '../../../utils/titleCase';
import { Image } from '../../common';
import UploadFileCard from '../../common/UploadFileCard';

type SelectOrderDetail = {
  orderDetailID: string;
  selectOrderDetail: boolean;
  quantity: number;
  totalQuantity: number;
  price: number;
};

type Errors = {
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
  const [orderDetail] = useState<OrderDetailRefund[]>([]);
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Errors>({
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
      price: 0,
    },
  ]);
  const [totalRefund, setTotalRefund] = useState(0);
  const [createRefundOrder] = useCreateRefundOrderMutation();
  const { data: orderDetailsData, isLoading: orderDetailsIsLoading } =
    useGetOrderDetailsQuery(orderID);
  const [getCalculatedRefundDetails, { data: calculatedRefundDetailsData }] =
    useLazyGetCalculatedRefundDetailsQuery();

  useEffect(() => {
    if (!orderDetailsData?.data) {
      return;
    }
    const selectedOrderDetail: SelectOrderDetail[] = [];
    orderDetailsData.data.order_details.forEach((order_detail) => {
      selectedOrderDetail.push({
        orderDetailID: order_detail.order_detail_id,
        quantity: 0,
        selectOrderDetail: false,
        totalQuantity: order_detail.quantity,
        price: 0,
      });
    });
    setSelectedOrderDetail(selectedOrderDetail);
  }, [orderDetailsData]);

  const handleSelectOrderDetail = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedOrderDetailCopy = [...selectedOrderDetail];
    const orderDetailID = e.target.parentElement?.parentElement?.id;
    e.target.checked;
    selectedOrderDetailCopy.map((orderDetail) => {
      if (orderDetail.orderDetailID === orderDetailID) {
        orderDetail.selectOrderDetail = !orderDetail.selectOrderDetail;
        if (orderDetail.price === 0) {
          getCalculatedRefundDetails({
            id: orderDetail.orderDetailID,
            query: 'quantity=1',
          });
          if (!calculatedRefundDetailsData?.data) {
            return;
          }
          orderDetail.price = calculatedRefundDetailsData.data.amount_user_get;
        }
        if (orderDetail.selectOrderDetail && orderDetail.quantity !== 0) {
          setTotalRefund(totalRefund + orderDetail.price);
        } else if (
          orderDetail.selectOrderDetail === false &&
          orderDetail.quantity !== 0
        ) {
          setTotalRefund(totalRefund - orderDetail.price);
        }
      }
    });
    setSelectedOrderDetail(selectedOrderDetailCopy);
  };

  const handleAddRefundItemQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const orderDetailID =
      target.parentElement?.parentElement?.parentElement?.id;
    const selectedOrderDetailCopy = [...selectedOrderDetail];
    selectedOrderDetailCopy.map((orderDetail) => {
      if (orderDetail.orderDetailID === orderDetailID) {
        if (orderDetail.quantity === orderDetail.totalQuantity) {
          return;
        }
        orderDetail.quantity += 1;
        if (orderDetail.price === 0) {
          getCalculatedRefundDetails({
            id: orderDetail.orderDetailID,
            query: 'quantity=1',
          });
          if (!calculatedRefundDetailsData?.data) {
            return;
          }
          orderDetail.price = calculatedRefundDetailsData.data.amount_user_get;
        }

        if (orderDetail.selectOrderDetail === true) {
          setTotalRefund(totalRefund + orderDetail.price);
        }
      }
    });
    setSelectedOrderDetail(selectedOrderDetailCopy);
  };

  const handleDecreaseRefundItemQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const orderDetailID =
      target.parentElement?.parentElement?.parentElement?.id;
    const selectedOrderDetailCopy = [...selectedOrderDetail];
    selectedOrderDetailCopy.map((orderDetail) => {
      if (orderDetail.orderDetailID === orderDetailID) {
        if (orderDetail.quantity === 0) {
          return;
        }
        orderDetail.quantity -= 1;
        if (orderDetail.selectOrderDetail === true) {
          setTotalRefund(totalRefund - orderDetail.price);
        }
      }
    });
    setSelectedOrderDetail(selectedOrderDetailCopy);
  };

  const handleSubmitRefundClick = () => {
    selectedOrderDetail.forEach((orderDetailData) => {
      if (orderDetailData.quantity !== 0)
        orderDetail.push({
          order_detail_id: orderDetailData.orderDetailID,
          quantity: orderDetailData.quantity,
        });
    });
    const newErrors = { ...errors };
    if (totalRefund === 0) {
      newErrors.selectedOrderDetail =
        'You must select an order detail to refund';
    }
    if (reason === '') {
      newErrors.reason = 'You must submit a reason to refund';
    }
    if (images.length === 0 && videos.length === 0) {
      newErrors.media = 'You must submit at least one media file to refund';
    }
    setErrors(newErrors);
    if (
      totalRefund === 0 ||
      reason === '' ||
      images.length + videos.length === 0
    ) {
      return;
    }
    createRefundOrder([
      toCreateRefundOrderRequest(orderDetail, reason, images, videos),
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
      <Card className='shadow-lg'>
        <Card.Body>
          <div className='font-bold text-xl'>Which Items Are Missing?</div>
          {orderDetailsData.data.order_details.map((order_detail, i) => (
            <div key={i} id={order_detail.order_detail_id}>
              <div className='flex items-center mt-3'>
                <input
                  type='checkbox'
                  className='checkbox checkbox-success'
                  checked={selectedOrderDetail[i]?.selectOrderDetail}
                  onChange={handleSelectOrderDetail}
                />
                <div className=' h-14 w-14 md:h-16 md:w-16 ml-2 mr-2 h-'>
                  <Image
                    src={order_detail.product_image || ''}
                    className='rounded-lg h-full w-full'
                  />
                </div>
                <div className='h-16 flex flex-col'>
                  <div className='justify-start mt-2 md:mt-0 w-60 md:w-full truncate'>
                    {order_detail.product_name}
                  </div>
                  {order_detail.product_variations && (
                    <div className='text-sm mt-0.5'>
                      {titleCase(order_detail.product_variations)}
                    </div>
                  )}
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <div className='flex items-center justify-end gap-1'>
                  <Button
                    className='btn-ghost'
                    shape='circle'
                    size='sm'
                    onClick={handleDecreaseRefundItemQuantity}
                  >
                    <AiOutlineMinusCircle
                      size={'2em'}
                      className='text-primary pointer-events-none'
                      pointerEvents={'none'}
                    />
                  </Button>
                  <Input
                    size='sm'
                    className='w-14 text-center border-2 border-primary'
                    value={selectedOrderDetail[i]?.quantity}
                    readOnly
                  />
                  <Button
                    className='btn-ghost'
                    shape='circle'
                    size='sm'
                    onClick={handleAddRefundItemQuantity}
                  >
                    <AiOutlinePlusCircle
                      size='2em'
                      className='text-primary pointer-events-none'
                      pointerEvents={'none'}
                    />
                  </Button>
                </div>
                <div className='mt-2 mr-7 text-sm'>
                  {selectedOrderDetail[i]?.quantity}/
                  {orderDetailsData.data?.order_details.length} items
                </div>
              </div>
            </div>
          ))}
          <Divider />
          <div className='flex justify-between'>
            <div>Total Refund</div>
            <div className='font-bold'>{toRupiah(totalRefund)}</div>
          </div>
          <span className='text-xs text-error'>
            {errors.selectedOrderDetail}
          </span>
        </Card.Body>
      </Card>
      <Card className='mt-2 shadow-lg'>
        <Card.Body>
          <div className='font-bold text-xl'>Reason for Refund</div>
          <Textarea
            onChange={handleChangeReason}
            value={reason}
            placeholder='Reason...'
          />
          <span className='text-xs text-error'>{errors.reason}</span>
        </Card.Body>
      </Card>
      <Card className='mt-2 shadow-lg '>
        <Card.Body>
          <div className='font-bold text-xl'>Photo & Video Proof</div>
          <div>
            Max. of 5 pictures and 1 video (Format .jpg, .jpeg, .png, .mp4,
            .mkv, .mov){' '}
          </div>
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
      <div className='flex justify-end'>
        <Button
          className='w-full md:w-48 mt-3 bg-primary hover:bg-secondary border-none transition-all duration-300'
          onClick={handleSubmitRefundClick}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default RefundCreate;
