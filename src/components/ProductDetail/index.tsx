import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'react-daisyui';
import {
  useLazyGetProductDetailQuery,
  useLazyGetPurchasedQuantitiesQuery,
  useViewPostMutation,
} from '../../store/services/productService';
import { toPurchasedQuantitiesQuery } from '../../utils/mapperDTO';
import ProductCart from './ProductCart';
import ProductDescription from './ProductDescription';
import ProductMedia from './ProductMedia';
import Reviews from './Reviews';
import ReviewStatsAndFilter from './ReviewStatsAndFilter';
import ShopBanner from './ShopBanner';
import { PurchasedQuantitiesQuery } from '../../types/query';
import { useGetShopInformationQuery } from '../../store/services/shopService';
import { useUpdateUserCartMutation } from '../../store/services/cartService';
import { notifySuccessToast } from '../../utils/toast';
import { useAppSelector } from '../../store/store';
import { selectRole } from '../../store/slices/authSlice';
import { validateUserRole } from '../../utils/auth';
import { Role } from '../../types/role';

type ProductDetailProps = {
  merchantID?: string;
  productID?: string;
};

const ProductDetail = ({ merchantID, productID }: ProductDetailProps) => {
  const [purchasedQuantitiesQuery, setPurchasedQuantitiesQuery] =
    useState<PurchasedQuantitiesQuery>({
      product_id: Number(productID),
      product_item_id: 0,
      quantity: 1,
    });
  const [viewPost, { isLoading: viewPostIsLoading, error: viewPostError }] =
    useViewPostMutation();
  const [
    getProductDetail,
    { data: getProductDetailData, isLoading: getProductDetailIsLoading },
  ] = useLazyGetProductDetailQuery();
  const [
    getPurchasedQuantities,
    {
      data: getPurchasedQuantitiesData,
      isLoading: getPurchasedQuantitiesIsLoading,
    },
  ] = useLazyGetPurchasedQuantitiesQuery();
  const [updateUserCart, { isLoading }] = useUpdateUserCartMutation();
  const {
    data: getShopInformationData,
    isLoading: getShopInformationIsLoading,
  } = useGetShopInformationQuery(merchantID);
  const [selectedVariations, setSelectedVariations] = useState<number[]>([]);
  const [selectedVariantImage, setSelectedVariantImage] = useState<string>('');
  const [productItemName, setProductItemName] = useState('');
  const [productItemPrice, setProductItemPrice] = useState(0);

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
      if (selectedVariationsCopy[variationIndex] === optionIndex) {
        console.log('here');
        if (
          getProductDetailData.data.product_variation.length === 2 &&
          variationIndex === 1
        ) {
          selectedVariationsCopy.splice(variationIndex, 1);
        } else {
          selectedVariationsCopy.length = 0;
        }
      } else {
        selectedVariationsCopy[variationIndex] = optionIndex;
      }
    }
    if (
      getProductDetailData.data.product_variation[0].image[
        selectedVariationsCopy[0]
      ] === undefined
    ) {
      setSelectedVariantImage(getProductDetailData.data.images[0]);
    } else {
      setSelectedVariantImage(
        getProductDetailData.data.product_variation[0].image[
          selectedVariationsCopy[0]
        ]
      );
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
      console.log({ foundProductModel });
      if (!foundProductModel) {
        return;
      }
      setProductItemName(foundProductModel.product_variations);
      setProductItemPrice(foundProductModel.price);
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
    if (Number(target.value) > 999) {
      const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
      purchasedQuantitiesQueryCopy.quantity = 999;
      setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
      return;
    }
    const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
    purchasedQuantitiesQueryCopy.quantity = Number(target.value);
    setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  };

  const handleClckAddToCart = () => {
    let productItemID = 0;
    if (getProductDetailData?.data?.product_variation.length === 0) {
      productItemID =
        getProductDetailData.data.product_model[0].product_item_id;
    } else {
      productItemID = purchasedQuantitiesQuery.product_item_id;
    }
    updateUserCart({
      product_item_id: productItemID,
      quantity: purchasedQuantitiesQuery.quantity,
    })
      .unwrap()
      .then(() => {
        notifySuccessToast(
          `${purchasedQuantitiesQuery.quantity} items has been added to cart`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!productID || !merchantID) {
    return null;
  }

  const roleCode = useAppSelector(selectRole);
  const role = validateUserRole(roleCode);

  useEffect(() => {
    viewPost(productID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Successfully view post');
      })
      .catch((err) => {
        console.error(err);
      });
    getProductDetail(productID).then(({ data }) => {
      console.log({ data: data?.data });
      if (!data?.data) {
        return;
      }
      if (data.data.product_variation.length === 0) {
        getPurchasedQuantities(
          toPurchasedQuantitiesQuery({
            product_item_id: data.data.product_model[0].product_item_id,
            product_id: Number(productID),
            quantity: purchasedQuantitiesQuery.quantity,
          })
        )
          .unwrap()
          .then((res) => {
            console.log(res.data?.product_merchant_promotion_id);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }, []);

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

  if (
    getProductDetailIsLoading ||
    !getProductDetailData?.data ||
    !getShopInformationData?.data ||
    getShopInformationIsLoading
  ) {
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
            <ShopBanner />
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
            <ProductMedia
              images={getProductDetailData.data.images}
              selectedVariantImage={selectedVariantImage}
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <ProductDescription
              productVariations={getProductDetailData.data.product_variation}
              productDetail={getProductDetailData.data}
              shopInformation={getShopInformationData.data}
              handleClickVariation={handleClickVariation}
              selectedVariations={selectedVariations}
              purchasedQuantitiesPrice={getPurchasedQuantitiesData?.data?.price}
              productItemPrice={productItemPrice}
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
              productVariation={productItemName}
              productVariations={getProductDetailData.data.product_variation}
              productPrice={getProductDetailData.data.price}
              selectedVariations={selectedVariations}
              productMerchantPromotionID={
                getPurchasedQuantitiesData?.data?.product_merchant_promotion_id
              }
              userMaxPurchaseQuantity={
                getPurchasedQuantitiesData?.data?.user_max_purchase_quantity
              }
              maxPurchaseQuantity={
                getPurchasedQuantitiesData?.data?.max_purchase_quantity
              }
              handleClickAddToCart={handleClckAddToCart}
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
