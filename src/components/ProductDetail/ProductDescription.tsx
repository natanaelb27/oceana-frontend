import React, { useState } from 'react';
import { Badge, Button, Divider, Tabs, Tooltip } from 'react-daisyui';
import { HiStar } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

import { ProductTab } from '../../types/tab';
import { toCompact, toRupiah } from '../../utils/convert';
import ShopBanner from './ShopBanner';
import {
  ProductDetail,
  ProductVariation,
  ShopInformation,
} from '../../types/component';
import { titleCase } from '../../utils/titleCase';

type ProductDescriptionProps = {
  productVariations: ProductVariation[];
  productDetail: ProductDetail;
  shopInformation: ShopInformation;
  handleClickVariation: (e: React.SyntheticEvent) => void;
  selectedVariations: number[];
  purchasedQuantitiesPrice?: number;
  productItemPrice?: number;
};

const ProductDescription = ({
  productVariations,
  productDetail,
  shopInformation,
  handleClickVariation,
  selectedVariations,
  purchasedQuantitiesPrice,
  productItemPrice,
}: ProductDescriptionProps) => {
  const [tab, setTab] = useState<ProductTab>(ProductTab.Specification);

  const renderTabContent = (tab: ProductTab) => {
    if (tab === ProductTab.Specification) {
      return (
        <div className='bg-base-200 p-4 text-sm'>
          <p className='mb-2'>Conditon: {productDetail.condition}</p>
          <p className='mb-2'>Unit Weight: {productDetail.weight}g</p>
          <p>
            Category:{' '}
            <NavLink to='/category' className='font-bold text-primary'>
              {productDetail.category}
            </NavLink>
          </p>
        </div>
      );
    }

    if (tab === ProductTab.Description) {
      return (
        <div className='bg-base-200 p-4 text-sm'>
          <p className='prose-sm'>{productDetail.description}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h5 className='text-lg font-medium md:line-clamp-2'>
        {productDetail.name}
      </h5>
      <div className='flex flex-row items-center mb-2.5'>
        {toCompact(50000)} sold |{' '}
        <Tooltip message='Rating' color='warning'>
          <HiStar className='text-warning text-lg' />
        </Tooltip>{' '}
        {productDetail.rating_star} ({productDetail.rating_count} rating)
      </div>
      {purchasedQuantitiesPrice &&
      selectedVariations.length === productVariations.length ? (
        <h4 className='text-4xl font-bold mb-2.5'>
          {toRupiah(purchasedQuantitiesPrice)}
        </h4>
      ) : productDetail.price_after_discount &&
        productDetail.price_after_discount ===
          productDetail.price_max_after_discount ? (
        <h4 className='text-4xl font-bold mb-2.5'>
          {toRupiah(productDetail.price_after_discount)}
        </h4>
      ) : productDetail.price_min_after_discount &&
        productDetail.price_max_after_discount ? (
        <h4 className='text-4xl font-bold mb-2.5'>
          {toRupiah(productDetail.price_min_after_discount)}-
          {toRupiah(productDetail.price_max_after_discount)}
        </h4>
      ) : productDetail.price_min === productDetail.price_max ? (
        <h4 className='text-4xl font-bold mb-2.5'>
          {toRupiah(productDetail.price)}
        </h4>
      ) : (
        <h4 className='text-4xl font-bold mb-2.5'>
          {toRupiah(productDetail.price_min)}-
          {toRupiah(productDetail.price_max)}
        </h4>
      )}
      {productDetail.price_after_discount ? (
        <div className='flex items-center'>
          <Tooltip message='Murah Lebay' color='success'>
            <Badge color='success' size='sm' className='truncate'>
              {productDetail.discount}%
            </Badge>
          </Tooltip>
          {productDetail.price_min === productDetail.price_max ? (
            <h5 className='text-lg line-through ml-1'>
              {toRupiah(productDetail.price)}
            </h5>
          ) : selectedVariations.length === productVariations.length && productItemPrice ? (
            <h5 className='text-lg line-through ml-1'>
              {toRupiah(productItemPrice)}
            </h5>
          ) : (
            <h5 className='text-lg line-through ml-1'>
              {toRupiah(productDetail.price_min)}-
              {toRupiah(productDetail.price_max)}
            </h5>
          )}
        </div>
      ) : (
        <div></div>
      )}

      <Divider />
      <div className='flex flex-col gap-4'>
        {productDetail.product_variation.map((variation, variationIndex) => (
          <div key={variation.name}>
            <p className='font-bold mb-2'>{titleCase(variation.name)}:</p>
            <div className='flex flex-wrap gap-1'>
              {variation.options.map((option, optionIndex) => (
                <Button
                  id={`${variationIndex}-${optionIndex}`}
                  size='sm'
                  variant='outline'
                  className={`font-normal normal-case btn-primary disabled:btn-outline ${
                    selectedVariations[variationIndex] === optionIndex
                      ? 'btn-active'
                      : ''
                  }`}
                  key={option}
                  disabled={
                    selectedVariations.length !== variationIndex - 1
                      ? false
                      : true
                  }
                  onClick={handleClickVariation}
                >
                  {titleCase(option)}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {productDetail.product_variation.length !== 0 && <Divider />}
      <Tabs variant='bordered' value={tab} onChange={setTab}>
        <Tabs.Tab value={ProductTab.Specification}>Specification</Tabs.Tab>
        <Tabs.Tab value={ProductTab.Description}>Description</Tabs.Tab>
      </Tabs>
      {renderTabContent(tab)}
      <Divider />
      <ShopBanner shopInformation={shopInformation} />
    </div>
  );
};

export default ProductDescription;
