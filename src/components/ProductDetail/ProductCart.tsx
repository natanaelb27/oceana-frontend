import React from 'react';
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
  selectedVariations: number[];
  productMerchantPromotionID?: number | null;
  userMaxPurchaseQuantity?: number;
  maxPurchaseQuantity?: number;
  handleClickAddToCart: () => void;
  defaultImage: string;
  selectedVariantImage: string;
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
  selectedVariations,
  productMerchantPromotionID,
  userMaxPurchaseQuantity,
  maxPurchaseQuantity,
  handleClickAddToCart,
  defaultImage,
  selectedVariantImage,
}: ProductCartProps) => {
  const renderPurchaseButtons = () => {
    if (
      purchasedQuantitiesStock ||
      (stock > 0 && selectedVariations.length < productVariations.length)
    ) {
      return (
        <div>
          <Button
            color='primary'
            endIcon={<HiShoppingCart className='text-lg' />}
            className='w-full mb-2.5'
            onClick={handleClickAddToCart}
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
      );
    }
  };
  return (
    <Card className='shadow'>
      <div className='p-4'>
        {productVariations.length !== 0 && (
          <div>
            <div className='flex items-center gap-2'>
              <img
                src={`${
                  selectedVariantImage === ''
                    ? defaultImage
                    : selectedVariantImage
                }`}
                className='w-20'
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    'https://cdn.shopify.com/s/files/1/0332/8881/4637/products/noimageavailable_7b25b64a-d5f8-423b-a498-8a2785ea69b2_2000x.jpg?v=1669356395';
                }}
              />
              {productVariation &&
              productVariations.length === selectedVariations.length ? (
                <p className='line-clamp-1'>{titleCase(productVariation)}</p>
              ) : (
                <p className='line-clamp-1'>No selected variation</p>
              )}
            </div>
            <Divider />
          </div>
        )}
        <div className='mb-2 font-bold text-lg'>Quantity</div>
        <div className='flex justify-between items-center flex-wrap gap-2'>
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
                (productVariations.length === selectedVariations.length &&
                  purchasedQuantitiesStock &&
                  purchasedQuantitiesStock <= quantity) ||
                (productVariations.length === selectedVariations.length &&
                  productVariations.length > 0 &&
                  purchasedQuantitiesStock === 0)
                  ? true
                  : false
              }
            >
              +
            </Button>
          </InputGroup>
          {purchasedQuantitiesStock &&
          productVariations.length === selectedVariations.length ? (
            <p className='min-w-fit line-clamp-1'>
              Stock: {purchasedQuantitiesStock}
            </p>
          ) : productVariations.length === selectedVariations.length &&
            purchasedQuantitiesStock === 0 ? (
            <p className='min-w-fit line-clamp-1'>
              Stock: {purchasedQuantitiesStock}
            </p>
          ) : (
            <p className='min-w-fit line-clamp-1'>Stock: {stock}</p>
          )}
        </div>
        {productMerchantPromotionID !== null &&
        userMaxPurchaseQuantity &&
        maxPurchaseQuantity &&
        Math.min(userMaxPurchaseQuantity, maxPurchaseQuantity) === quantity &&
        quantity !== 0 ? (
          <div className='mt-1 text-sm text-red-600'>
            Purchase quantity is at maximum threshold, increasing quantity may
            cause increase in price
          </div>
        ) : (
          <div></div>
        )}
        {productVariations.length === 0 && stock === 0 ? (
          <div className='text-sm mt-1 text-red-600'>
            There are {stock} items left
          </div>
        ) : productVariations.length === 0 &&
          stock < quantity &&
          stock !== 0 ? (
          <div className='text-sm mt-1 text-red-600'>
            There are only {stock} items left
          </div>
        ) : purchasedQuantitiesStock === 0 &&
          quantity !== 0 &&
          productVariations.length === selectedVariations.length ? (
          <div className='text-sm mt-1 text-red-600'>
            There are {purchasedQuantitiesStock} items left
          </div>
        ) : stock !== 0 && purchasedQuantitiesStock !== 0 && quantity === 0 ? (
          <div className='text-sm mt-1 text-red-600'>
            Minimum purchase of this product is 1 item
          </div>
        ) : purchasedQuantitiesStock &&
          purchasedQuantitiesStock !== 0 &&
          purchasedQuantitiesStock < quantity &&
          productVariations.length === selectedVariations.length ? (
          <div className='text-sm mt-1 text-red-600'>
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
          ) : productVariations.length === selectedVariations.length &&
            purchasedQuantitiesPrice &&
            purchasedQuantitiesStock !== 0 ? (
            <h5 className='font-bold text-xl'>
              {toRupiah(purchasedQuantitiesPrice * quantity)}
            </h5>
          ) : (
            <h5 className='font-bold text-xl'>{toRupiah(0)}</h5>
          )}
        </div>
        {renderPurchaseButtons()}
      </div>
    </Card>
  );
};

export default ProductCart;
