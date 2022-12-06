import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'react-daisyui';
import {
  useGetProductDetailQuery,
  useGetPurchasedQuantitiesQuery,
  useLazyGetPurchasedQuantitiesQuery,
} from '../../store/services/productService';
import { toPurchasedQuantitiesQuery } from '../../utils/mapperDTO';
import ProductCart from './ProductCart';
import ProductDescription from './ProductDescription';
import ProductMedia from './ProductMedia';
import Reviews from './Reviews';
import ReviewStatsAndFilter from './ReviewStatsAndFilter';
import ShopBanner from './ShopBanner';
import { PurchasedQuantitiesQuery } from '../../types/query';

type ProductDetailProps = {
  productID: string | undefined;
};

const ProductDetail = ({ productID }: ProductDetailProps) => {
  const [purchasedQuantitiesQuery, setPurchasedQuantitiesQuery] =
    useState<PurchasedQuantitiesQuery>({
      product_id: Number(productID),
      product_item_id: 0,
      quantity: 1,
    });
  const { data: getProductDetailData, isLoading: getProductDetailIsLoading } =
    useGetProductDetailQuery(productID);
  const [
    getPurchasedQuantities,
    {
      data: getPurchasedQuantitiesData,
      isLoading: getPurchasedQuantitiesIsLoading,
    },
  ] = useLazyGetPurchasedQuantitiesQuery();
  const [selectedVariations, setSelectedVariations] = useState<number[]>([]);
  const [productVariation, setProductVariation] = useState('');

  const handleClickVariation = (e: React.SyntheticEvent) => {
    if (!getProductDetailData?.data) {
      return;
    }

    const target = e.target as HTMLInputElement;
    const indexes = target.id.split('-');
    const variationIndex = Number(indexes[0]);
    const optionIndex = Number(indexes[1]);
    const selectedVariationsCopy: number[] = [...selectedVariations];
    if (selectedVariationsCopy.length < variationIndex + 1) {
      selectedVariationsCopy.push(optionIndex);
    } else {
      selectedVariationsCopy[variationIndex] = optionIndex;
    }
    setSelectedVariations(selectedVariationsCopy);
    if (
      selectedVariationsCopy.length ===
      getProductDetailData.data.product_model[0].variation_index.length
    ) {
      const foundProductModel = getProductDetailData.data.product_model.find(
        (row) =>
          JSON.stringify(row.variation_index) ===
          JSON.stringify(selectedVariationsCopy)
      );
      console.log({foundProductModel});
      if (!foundProductModel) {
        return;
      }
      setProductVariation(foundProductModel.product_variations);
      const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
      purchasedQuantitiesQueryCopy.product_item_id =
        foundProductModel.product_item_id;
      purchasedQuantitiesQueryCopy.quantity = 1;
      setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
    }
  };

  const handleClickAddQuantity = () => {
    const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
    purchasedQuantitiesQueryCopy.quantity += 1;
    setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  };

  const handleClickDecreaseQuantity = () => {
    const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
    if (purchasedQuantitiesQueryCopy.quantity === 0) {
      return;
    }
    purchasedQuantitiesQueryCopy.quantity -= 1;
    setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  };

  const handleChangeQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    if (isNaN(Number(target.value))) {
      return;
    }
    const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
    purchasedQuantitiesQueryCopy.quantity = Number(target.value);
    setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  };

  useEffect(() => {
    if (purchasedQuantitiesQuery.product_item_id === 0) {
      return;
    }
    getPurchasedQuantities(toPurchasedQuantitiesQuery(purchasedQuantitiesQuery))
      .unwrap()
      .then((res) => {
        console.log(res);
        // console.log(getPurchasedQuantitiesData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [purchasedQuantitiesQuery]);

  // if (!getProductDetailData?.data) {
  //   return <div>404</div>;
  // }
  
  if (getProductDetailIsLoading || !getProductDetailData?.data) {
    return (
      <div className='p-4 md:p-10 animate-pulse'>
        <div className='grid grid-cols-12 gap-4 md:gap-10'>
          <div className='col-span-12 md:col-span-3'>
            <Card className='shadow max-w-sm'>
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
            <ShopBanner isLoading />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <Card className='shadow max-w-sm'>
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
    );
  }

  return (
    <div className='container mx-auto'>
      <div className='px-4 py-10'>
        <div className='grid grid-cols-12 gap-4 gap-y-10 md:gap-10'>
          <div className='col-span-12 md:col-span-3'>
            <ProductMedia />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <ProductDescription
              productDetail={getProductDetailData.data}
              handleClickVariation={handleClickVariation}
              selectedVariations={selectedVariations}
              purchasedQuantitiesPrice={getPurchasedQuantitiesData?.data?.price}
            />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <ProductCart
              stock={getProductDetailData.data.total_stock}
              quantity={purchasedQuantitiesQuery.quantity}
              handleClickAddQuantity={handleClickAddQuantity}
              handleClickDecreaseQuantity={handleClickDecreaseQuantity}
              handleChangeQuantity={handleChangeQuantity}
              purchasedQuantitiesStock={getPurchasedQuantitiesData?.data?.stock}
              purchasedQuantitiesPrice={getPurchasedQuantitiesData?.data?.price}
              productVariation={productVariation}
              productVariations={getProductDetailData.data.product_variation}
              productPrice={getProductDetailData.data.price}
            />
          </div>
          <div className='col-span-12 md:col-span-3'>
            <ReviewStatsAndFilter />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <Reviews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
