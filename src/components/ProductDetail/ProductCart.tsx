import React, { ChangeEvent, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Input,
  InputGroup,
} from 'react-daisyui';
import { HiShoppingBag, HiShoppingCart } from 'react-icons/hi';

import { toRupiah } from '../../utils/convert';

type ProductCartProps = {
  stock: number;
  quantity: number;
  handleClickAddQuantity: () => void;
  handleClickDecreaseQuantity: () => void;
  handleChangeQuantity: (e: React.SyntheticEvent) => void;
  purchased_quantities_stock?: number;
  isLoading?: boolean;
};

const ProductCart = ({
  stock,
  quantity,
  handleClickAddQuantity,
  handleClickDecreaseQuantity,
  handleChangeQuantity,
  purchased_quantities_stock,
  isLoading,
}: ProductCartProps) => {
  // const [quantity, setQuantity] = useState<number>(1);

  // const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;

  //   if (value === '') {
  //     setQuantity(0);

  //     return;
  //   }

  //   if (isNaN(Number(value))) {
  //     return;
  //   }

  //   setQuantity(Number(value));
  // };

  if (isLoading) {
    return (
      <Card className='shadow animate-pulse'>
        <div className='p-4'>
          <div className='flex items-center gap-2'>
            <div className='h-12 w-12 bg-base-200'></div>
            <div className='h-4 bg-base-200 rounded-full w-2/5 mb-2.5'></div>
          </div>
          <Divider />
          <div className='flex items-center'>
            <div className='h-6 bg-base-200 rounded-full w-full'></div>
          </div>
          <Divider />
          <div className='flex justify-between items-center mb-4'>
            <div className='h-4 bg-base-200 rounded-full w-full'></div>
          </div>
          <div className='h-8 bg-base-200 rounded-full w-full mb-2.5'></div>
          <div className='h-8 bg-base-200 rounded-full w-full'></div>
        </div>
      </Card>
    );
  }

  // console.log({ purchased_quantities_stock });

  return (
    <Card className='shadow'>
      <div className='p-4'>
        <div className='flex items-center gap-2'>
          <Avatar src='https://picsum.photos/200' size='sm' />
          <p className='line-clamp-1'>BLOB, Black</p>
        </div>
        <Divider />
        <div className='flex items-center'>
          <InputGroup size='sm' className='flex-1'>
            <Button size='sm' onClick={handleClickDecreaseQuantity}>
              -
            </Button>
            <Input
              size='sm'
              value={quantity}
              onChange={handleChangeQuantity}
              className='w-16 text-center'
            />
            <Button size='sm' onClick={handleClickAddQuantity}>
              +
            </Button>
          </InputGroup>
          {purchased_quantities_stock ? (
            <p className='flex-1 line-clamp-1'>
              Stock: {purchased_quantities_stock}
            </p>
          ) : purchased_quantities_stock === 0 ? (
            <p className='flex-1 line-clamp-1'>Stock: {purchased_quantities_stock}</p>
          ) : (
            <p className='flex-1 line-clamp-1'>Stock: {stock}</p>
          )}
          {/* <p className='flex-1 line-clamp-1'>Stock: {stock}</p> */}
        </div>
        <Divider />
        <div className='flex justify-between items-center mb-4'>
          <p>Subtotal</p>
          <h5 className='font-bold text-xl'>{toRupiah(430000)}</h5>
        </div>
        <Button
          color='primary'
          endIcon={<HiShoppingCart className='text-lg' />}
          className='w-full mb-2.5'
        >
          Add to Cart
        </Button>
        <Button
          color='primary'
          variant='outline'
          endIcon={<HiShoppingBag className='text-lg' />}
          className='w-full mb-2.5'
        >
          Buy Now
        </Button>
      </div>
    </Card>
  );
};

export default ProductCart;
