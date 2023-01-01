import React, { useState } from 'react';
import { Avatar, Badge, Button, Divider, Tabs, Tooltip } from 'react-daisyui';
import { HiStar } from 'react-icons/hi';
import { Link, NavLink } from 'react-router-dom';

import { ProductTab } from '../../types/tab';
import { toCompact, toRupiah } from '../../utils/convert';
import {
  ProductDetail,
  ProductModel,
  ProductSnapshot,
  ProductVariation,
  ShopInformation,
} from '../../types/component';
import { titleCase } from '../../utils/titleCase';
import { stringCompare } from '../../utils/validation';
import { DISCOUNT_TYPE } from '../../constants';
import { toUrl } from '../../utils/toUrl';
import { Image } from '../common';

type ProductDescriptionProps = {
  productSnapshotDetail: ProductSnapshot;
};

const ProductDescription = ({
  productSnapshotDetail,
}: ProductDescriptionProps) => {
  const [tab, setTab] = useState<ProductTab>(ProductTab.Specification);
  const renderTabContent = (tab: ProductTab) => {
    if (tab === ProductTab.Specification) {
      return (
        <div className='bg-base-200 p-4 text-sm'>
          <p className='mb-2'>Conditon: {productSnapshotDetail.condition}</p>
          <p className='mb-2'>Unit Weight: {productSnapshotDetail.weight}g</p>
        </div>
      );
    }

    if (tab === ProductTab.Description) {
      return (
        <div className='bg-base-200 p-4 text-sm'>
          <p className='prose-sm whitespace-pre-line'>
            {productSnapshotDetail.description}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h5 className='text-xl font-medium md:line-clamp-2'>
        {productSnapshotDetail.name}
      </h5>
      <h4 className='text-3xl font-bold mb-2.5'>
        {toRupiah(productSnapshotDetail.price)}
      </h4>

      <Tabs variant='bordered' value={tab} onChange={setTab}>
        <Tabs.Tab value={ProductTab.Specification}>Specification</Tabs.Tab>
        <Tabs.Tab value={ProductTab.Description}>Description</Tabs.Tab>
      </Tabs>
      {renderTabContent(tab)}
      <div className='flex flex-col gap-2 mt-4'>
        <span className='font-bold'>Shop Info</span>
        <div className='flex gap-4 items-center'>
          {productSnapshotDetail.merchant_photo ? (
            <div className='avatar'>
              <div className='w-20 rounded-full'>
                <Image
                  src={productSnapshotDetail.merchant_photo}
                  alt='Shop Banner'
                />
              </div>
            </div>
          ) : (
            <Avatar
              size='sm'
              shape='circle'
              letters={productSnapshotDetail.shop_name.charAt(0)}
            />
          )}
          <Link
            to={`/shops/${productSnapshotDetail.merchant_id}`}
            className='font-bold mb-2.5 line-clamp-1 link link-hover'
          >
            {productSnapshotDetail.shop_name}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
