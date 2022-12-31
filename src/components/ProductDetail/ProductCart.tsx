import React from 'react';
import { Button, Card, Divider, Input } from 'react-daisyui';
import { HiShoppingBag, HiShoppingCart } from 'react-icons/hi';
import { ProductModel, ProductVariation } from '../../types/component';

import { toRupiah } from '../../utils/convert';
import { titleCase } from '../../utils/titleCase';
import { Image } from '../common';

type ProductCartProps = {
  userRoleCode: string | null;
  selectedModel: ProductModel | null;
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
  handleClickBuyNow: () => void;
  defaultImage: string;
  selectedVariantImage: string;
  disablePurchase: boolean;
};

const ProductCart = ({
  userRoleCode,
  selectedModel,
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
  handleClickBuyNow,
  defaultImage,
  selectedVariantImage,
  disablePurchase,
}: ProductCartProps) => {
  const renderPurchaseButtons = () => {
    return (
      <div>
        <Button
          color='primary'
          endIcon={<HiShoppingCart className='text-lg' />}
          className='w-full mb-2.5 text-xs lg:text-sm'
          disabled={
            disablePurchase || purchasedQuantitiesStock === 0 || stock === 0
          }
          onClick={handleClickAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          color='primary'
          variant='outline'
          endIcon={<HiShoppingBag className='text-lg' />}
          className='w-full mb-2.5 text-xs lg:text-sm'
          onClick={handleClickBuyNow}
        >
          Buy Now
        </Button>
      </div>
    );
  };

  console.log(
    userRoleCode,
    purchasedQuantitiesStock,
    selectedVariations.filter((items) => typeof items === 'number').length ===
      (productVariations.length || 0) && userRoleCode,
    selectedVariations.filter((items) => typeof items === 'number').length ===
      (productVariations.length || 0) && userRoleCode
      ? 'tes'
      : 'haha',
    quantity,
    stock
  );

  return (
    <Card className='shadow sticky top-24'>
      <div className='p-4'>
        {productVariations.length !== 0 && (
          <div>
            <div className='flex items-center gap-2'>
              <Image
                src={`${
                  selectedVariantImage === ''
                    ? defaultImage
                    : selectedVariantImage
                }`}
                className='w-20'
                alt='Cart Image'
              />
              {productVariation &&
              productVariations.length ===
                selectedVariations.filter((items) => typeof items === 'number')
                  .length ? (
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
          <div className='max-w-fit'>
            <Button
              size='sm'
              onClick={handleClickDecreaseQuantity}
              disabled={quantity === 0 || quantity === 1}
              className='rounded-r-none'
            >
              -
            </Button>
            <Input
              size='sm'
              value={quantity || 0}
              onChange={handleChangeQuantity}
              className='w-16 text-center rounded-none'
            />
            <Button
              size='sm'
              onClick={handleClickAddQuantity}
              disabled={
                selectedVariations.filter((items) => typeof items === 'number')
                  .length === (productVariations.length || 0) && userRoleCode
                  ? (purchasedQuantitiesStock || 0) <= quantity
                  : (selectedModel?.stock_quantity || stock || 0) <= quantity
              }
              className='rounded-l-none'
            >
              +
            </Button>
          </div>
          {userRoleCode &&
          productVariations.length ===
            selectedVariations.filter((items) => typeof items === 'number')
              .length ? (
            <p className='min-w-fit line-clamp-1'>
              Stock: {purchasedQuantitiesStock}
            </p>
          ) : !userRoleCode &&
            productVariations.length ===
              selectedVariations.filter((items) => typeof items === 'number')
                .length ? (
            <p className='min-w-fit line-clamp-1'>
              Stock: {selectedModel?.stock_quantity}
            </p>
          ) : (
            <p className='min-w-fit line-clamp-1'>Stock: {stock}</p>
          )}
        </div>
        {selectedVariations.filter((items) => typeof items === 'number')
          .length === (productVariations.length || 0) &&
        purchasedQuantitiesStock !== 0 &&
        productMerchantPromotionID !== null &&
        userMaxPurchaseQuantity &&
        maxPurchaseQuantity &&
        Math.min(userMaxPurchaseQuantity, maxPurchaseQuantity) === quantity ? (
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
          productVariations.length ===
            selectedVariations.filter((items) => typeof items === 'number')
              .length ? (
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
          productVariations.length ===
            selectedVariations.filter((items) => typeof items === 'number')
              .length ? (
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
          ) : productVariations.length ===
              selectedVariations.filter((items) => typeof items === 'number')
                .length &&
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
