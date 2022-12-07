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
import { ProductVariation } from '../../types/component';

import { toRupiah } from '../../utils/convert';
import { titleCase } from '../../utils/titleCase';

type ProductCartProps = {
  stock: number;
  quantity: number;
  handleClickAddQuantity: () => void;
  handleClickDecreaseQuantity: () => void;
  handleChangeQuantity: (e: React.SyntheticEvent) => void;
  purchasedQuantitiesStock?: number;
  purchasedQuantitiesPrice?: number;
  productVariation?: string;
  productVariations: ProductVariation[];
  productPrice: number;
  isLoading?: boolean;
};

const ProductCart = ({
  stock,
  quantity,
  handleClickAddQuantity,
  handleClickDecreaseQuantity,
  handleChangeQuantity,
  purchasedQuantitiesStock,
  purchasedQuantitiesPrice,
  productVariation,
  productVariations,
  productPrice,
  isLoading,
}: ProductCartProps) => {
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

  console.log(productVariations);

  return (
    <Card className='shadow'>
      <div className='p-4'>
        {productVariations.length !== 0 && (
          <div>
            <div className='flex items-center gap-2'>
              <Avatar src='https://picsum.photos/200' size='sm' />
              {productVariation ? (
                <p className='line-clamp-1'>{titleCase(productVariation)}</p>
              ) : (
                <p className='line-clamp-1'>No selected variation</p>
              )}
            </div>
            <Divider />
          </div>
        )}
        <div className='mb-2 font-bold text-lg'>Quantity</div>
        <div className='flex justify-between items-center'>
          <InputGroup size='sm' className='max-w-fit'>
            <Button
              size='sm'
              onClick={handleClickDecreaseQuantity}
              disabled={quantity === 0}
            >
              -
            </Button>
            <Input
              size='sm'
              value={quantity || 0}
              onChange={handleChangeQuantity}
              className='w-16 text-center'
            />
            <Button
              size='sm'
              onClick={handleClickAddQuantity}
              disabled={
                stock <= quantity ||
                (purchasedQuantitiesStock &&
                  purchasedQuantitiesStock !== 0 &&
                  purchasedQuantitiesStock <= quantity)
                  ? true
                  : false
              }
            >
              +
            </Button>
          </InputGroup>
          {purchasedQuantitiesStock ? (
            <p className='min-w-fit line-clamp-1'>
              Stock: {purchasedQuantitiesStock}
            </p>
          ) : purchasedQuantitiesStock === 0 ? (
            <p className='min-w-fit line-clamp-1'>
              Stock: {purchasedQuantitiesStock}
            </p>
          ) : (
            <p className='min-w-fit line-clamp-1'>Stock: {stock}</p>
          )}
        </div>
        {productVariations.length === 0 && stock < quantity && stock !== 0 && (
          <div className='mt-2 text-red-500'>
            There are only {stock} items left
          </div>
        )}
        {productVariations.length === 0 && stock === 0 && (
          <div className='mt-2 text-red-500'>There are {stock} items left</div>
        )}
        {productVariations.length !== 0 && purchasedQuantitiesStock === 0 && (
          <div className='mt-2 text-red-500'>
            There are {purchasedQuantitiesStock} items left
          </div>
        )}
        {stock !== 0 && purchasedQuantitiesStock !== 0 && quantity === 0 && (
          <div className='mt-2 text-red-500'>
            Minimum purchase of this product is 1 item
          </div>
        )}
        {purchasedQuantitiesStock &&
        purchasedQuantitiesStock !== 0 &&
        purchasedQuantitiesStock < quantity ? (
          <div className='mt-2 text-red-500'>
            There are only {purchasedQuantitiesStock} items left
          </div>
        ) : (
          <div></div>
        )}
        <Divider />
        <div className='flex justify-between items-center mb-4'>
          <p>Subtotal</p>
          {productVariations.length === 0 ? (
            <h5 className='font-bold text-xl'>
              {toRupiah(productPrice * quantity)}
            </h5>
          ) : !purchasedQuantitiesPrice ? (
            <h5 className='font-bold text-xl'>{toRupiah(0)}</h5>
          ) : (
            <h5 className='font-bold text-xl'>
              {toRupiah(purchasedQuantitiesPrice * quantity)}
            </h5>
          )}
        </div>
        {productVariations.length === 0 && stock !== 0 ? (
          <div>
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
        ) : (
          productVariations.length > 0 &&
          purchasedQuantitiesStock !== 0 && (
            <div>
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
          )
        )}
      </div>
    </Card>
  );
};

export default ProductCart;
