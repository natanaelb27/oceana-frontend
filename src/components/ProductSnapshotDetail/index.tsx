import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Card, Divider } from 'react-daisyui';
import {
  useLazyGetAllProductsQuery,
  useLazyGetProductDetailQuery,
  useLazyGetPurchasedQuantitiesQuery,
  useViewPostMutation,
} from '../../store/services/productService';
import {
  useFavoriteProductMutation,
  useLazyGetFavoriteProductQuery,
} from '../../store/services/favoriteProductService';
import { useLazyGetAllReviewsQuery } from '../../store/services/reviewService';
import { useGetShopInformationQuery } from '../../store/services/shopService';
import {
  useIncrementUserCartMutation,
  useUpdateUserCartMutation,
} from '../../store/services/cartService';
import {
  toProductQuery,
  toPurchasedQuantitiesQuery,
  toReviewQuery,
} from '../../utils/mapperDTO';
import ProductDescription from './ProductDescription';
import ProductMedia from './ProductMedia';
import { PurchasedQuantitiesQuery, ReviewQuery } from '../../types/query';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { useAppSelector } from '../../store/store';
import { selectRole } from '../../store/slices/authSlice';
import { validateUserRole } from '../../utils/auth';
import { Role } from '../../types/role';
import {
  GetProductSnapshotResponse,
  UpdateUserCartResponse,
} from '../../types/response';
import {
  LIMIT_REVIEWS_IN_PRODUCT_PAGE,
  LIMIT_SIMILAR_PRODUCTS_IN_PRODUCT_PAGE,
} from '../../constants';
import { ProductCard } from '../common';
import { ReviewsSort } from '../../types/sort';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_STATUS } from '../../constants/index';
import { useLazyGetMyShopProfileQuery } from '../../store/services/myShopService';
import { ProductModel, ProductSnapshot } from '../../types/component';
import { toStringDate } from '../../utils/convert';
import { toUrl } from '../../utils/toUrl';

type ProductSnapshotDetailProps = {
  productSnapshotData?: GetProductSnapshotResponse;
};

const ProductSnapshotDetail = ({
  productSnapshotData,
}: ProductSnapshotDetailProps) => {
  const navigate = useNavigate();
  const handleNavigateProductPage = (
    productName: string,
    merchantID: number,
    productID: number
  ) => {
    navigate(`/products/${toUrl(productName)}-i.${merchantID}-${productID}`);
  };

  if (!productSnapshotData) {
    return (
      <div className='container mx-auto'>
        <div className='p-4 md:p-10 animate-pulse'>
          <div className='grid grid-cols-12 gap-4 md:gap-10'>
            <div className='col-span-12 md:col-span-3'>
              <Card className='shadow max-w'>
                <div className='h-64 w-full bg-base-200 rounded'></div>
                <div className='p-4'>
                  <div className='h-12 w-full bg-base-200 rounded-full'></div>
                </div>
              </Card>
            </div>
            <div className='col-span-12 md:col-span-6'>
              <div className='grid grid-col-12 gap-4 mb-10'>
                <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              </div>
              <Divider />
              <div className='grid grid-col-12 gap-4 mb-10'>
                <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
                <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              </div>
              <Divider />
            </div>
            <div className='col-span-12 md:col-span-3'>
              <Card className='shadow max-w'>
                <div className='p-4'>
                  <div className='h-36 w-full bg-base-200 rounded-md'></div>
                  <Divider />
                  <div className='h-12 w-full bg-base-200 rounded-md mb-4'></div>
                  <div className='h-12 w-full bg-base-200 rounded-md'></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <div className='px-4 pt-4 pb-10'>
        <div className='rounded-md border border-black bg-base-300 p-4 mb-4'>
          <span className='text-sm'>
            The following shows the details of the products ordered on{' '}
          </span>
          <span className='font-bold text-sm'>
            {toStringDate(productSnapshotData?.data?.transaction_datetime)}
          </span>
        </div>
        <div className='grid grid-cols-12 gap-4 gap-y-10 md:gap-10 relative'>
          <div className='col-span-12 md:col-span-9'>
            <div className='grid grid-cols-12 gap-4 gap-y-10'>
              <div className='col-span-12 md:col-span-4'>
                <ProductMedia
                  images={productSnapshotData.data.images}
                  videos={productSnapshotData.data.videos}
                />
              </div>
              <div className='col-span-12 md:col-span-8'>
                <ProductDescription
                  productSnapshotDetail={productSnapshotData.data}
                />
              </div>
              <div className='col-span-12 md:hidden relative flex items-center justify-center'>
                <div className='flex flex-col w-full '>
                  <Button
                    className='normal-case btn-primary w-full'
                    disabled={
                      productSnapshotData?.data?.current_status ===
                      PRODUCT_STATUS.INACTIVE
                    }
                    onClick={() => {
                      handleNavigateProductPage(
                        productSnapshotData?.data?.current_product_name,
                        productSnapshotData?.data?.merchant_id,
                        productSnapshotData?.data?.product_id
                      );
                    }}
                  >
                    View Product Page
                  </Button>
                  {productSnapshotData?.data?.current_status ===
                  PRODUCT_STATUS.INACTIVE ? (
                    <span className='text-sm text-error'>
                      Product is currently inactive
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className='hidden md:block md:col-span-3 relative'>
            <Button
              className='normal-case btn-primary w-full'
              disabled={
                productSnapshotData?.data?.current_status ===
                PRODUCT_STATUS.INACTIVE
              }
              onClick={() => {
                handleNavigateProductPage(
                  productSnapshotData?.data?.current_product_name,
                  productSnapshotData?.data?.merchant_id,
                  productSnapshotData?.data?.product_id
                );
              }}
            >
              View Product Page
            </Button>
            {productSnapshotData?.data?.current_status ===
            PRODUCT_STATUS.INACTIVE ? (
              <span className='text-sm text-error'>
                Product is currently inactive
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSnapshotDetail;
