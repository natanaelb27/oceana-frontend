import { Button, Input } from 'react-daisyui';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { titleCase } from '../../../utils/titleCase';
import { Image } from '../../common';
import {
  CalculatedRefundDetails,
  OrderDetail,
  OrderDetailRefund,
} from '../../../types/component';
import { useLazyGetCalculatedRefundDetailsQuery } from '../../../store/services/refundService';
import { ChangeEvent, MouseEvent } from 'react';
import { handleNumberInvalidKey } from '../../../utils/validation';

type SelectOrderDetail = {
  orderDetailID: string;
  selectOrderDetail: boolean;
  quantity: number;
  totalQuantity: number;
  estimatedRefundPrice: number;
};

type ContentProps = {
  orderDetailData: OrderDetail;
  selectedOrderDetail: SelectOrderDetail[];
  setSelectedOrderDetail: (s: SelectOrderDetail[]) => void;
  idx: number;
  errorOrderDetail: string | undefined;
};

const OrderDetailSelection = ({
  orderDetailData,
  selectedOrderDetail,
  setSelectedOrderDetail,
  idx,
  errorOrderDetail,
}: ContentProps) => {
  const handleSelectOrderDetailChange = (
    e: ChangeEvent<HTMLInputElement>,
    orderDetailData: OrderDetail
  ) => {
    setSelectedOrderDetail(
      [...selectedOrderDetail].map((object) => {
        if (object.orderDetailID === orderDetailData.order_detail_id) {
          return {
            ...object,
            selectOrderDetail: e.target.checked,
          };
        } else return object;
      })
    );
  };

  const handleInputChange = (n: number) => {
    let newInput = n;
    if (Number(n) < 1) {
      newInput = 1;
    }
    if (Number(n) > orderDetailData?.quantity) {
      newInput = orderDetailData?.quantity;
    }

    setSelectedOrderDetail(
      [...selectedOrderDetail].map((object) => {
        if (object.orderDetailID === orderDetailData.order_detail_id) {
          return {
            ...object,
            quantity: newInput,
          };
        } else return object;
      })
    );
  };

  const handleChangeInputRefundItemQuantity = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newInput = Number(e.target.value);
    handleInputChange(newInput);
  };

  const handleDecreaseRefundItemQuantity = () => {
    handleInputChange((selectedOrderDetail?.at(idx)?.quantity || 1) - 1);
  };

  const handleAddRefundItemQuantity = () => {
    handleInputChange((selectedOrderDetail?.at(idx)?.quantity || 1) + 1);
  };

  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center'>
        <input
          type='checkbox'
          className='checkbox checkbox-success'
          checked={selectedOrderDetail.at(idx)?.selectOrderDetail}
          onChange={(e) => {
            handleSelectOrderDetailChange(e, orderDetailData);
          }}
        />
        <div className=' h-14 w-14 md:h-16 md:w-16 ml-2 mr-2 h-'>
          <Image
            src={orderDetailData.product_image || ''}
            className='rounded-lg h-full w-full'
          />
        </div>
        <div className='h-16 flex flex-col justify-center'>
          <span className='mt-2 md:mt-0 w-60 md:w-full truncate'>
            {orderDetailData.product_name}
          </span>
          {orderDetailData.product_variations && (
            <span className='text-sm mt-0.5'>
              {titleCase(orderDetailData.product_variations)}
            </span>
          )}
        </div>
      </div>
      <div className='flex flex-col items-center gap-1'>
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
            value={selectedOrderDetail[idx]?.quantity || 1}
            min={1}
            max={orderDetailData.quantity}
            onChange={handleChangeInputRefundItemQuantity}
            type='number'
            onKeyDown={handleNumberInvalidKey}
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
        <div className='text-sm'>
          {selectedOrderDetail?.at(idx)?.quantity || 1}/
          {orderDetailData.quantity}{' '}
          {(orderDetailData.quantity || 0) > 0 ? 'items' : 'item'}
        </div>
        {errorOrderDetail ? (
          <span className='text-xs text-error'>{errorOrderDetail}</span>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetailSelection;
