import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'react-daisyui';
import {
  useFavoriteProductMutation,
  useGetFavoriteProductQuery,
  useLazyGetAllProductsQuery,
  useLazyGetProductDetailQuery,
  useLazyGetPurchasedQuantitiesQuery,
  useViewPostMutation,
} from '../../store/services/productService';
import {
  toProductQuery,
  toPurchasedQuantitiesQuery,
  toReviewQuery,
} from '../../utils/mapperDTO';
import ProductCart from './ProductCart';
import ProductDescription from './ProductDescription';
import ProductMedia from './ProductMedia';
import Reviews from './Reviews';
import ReviewStatsAndFilter from './ReviewStatsAndFilter';
import ShopBanner from './ShopBanner';
import { PurchasedQuantitiesQuery, ReviewQuery } from '../../types/query';
import { useGetShopInformationQuery } from '../../store/services/shopService';
import { useUpdateUserCartMutation } from '../../store/services/cartService';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { useAppSelector } from '../../store/store';
import { selectRole } from '../../store/slices/authSlice';
import { validateUserRole } from '../../utils/auth';
import { Role } from '../../types/role';
import {
  GetPurchasedQuantitiesResponse,
  UpdateUserCartResponse,
} from '../../types/response';
import {
  LIMIT_REVIEWS_IN_PRODUCT_PAGE,
  LIMIT_SIMILAR_PRODUCTS_IN_PRODUCT_PAGE,
} from '../../constants';
import { ProductCard } from '../common';
import { useLazyGetAllReviewsQuery } from '../../store/services/reviewService';

type ProductDetailProps = {
  merchantID?: string;
  productID?: string;
};

const ProductDetail = ({ merchantID, productID }: ProductDetailProps) => {
  if (!productID || !merchantID) {
    return null;
  }

  const [purchasedQuantitiesQuery, setPurchasedQuantitiesQuery] =
    useState<PurchasedQuantitiesQuery>({
      product_id: Number(productID),
      product_item_id: 0,
      quantity: 1,
    });
  const [reviewQuery, setReviewQuery] = useState<ReviewQuery>({
    sort: '',
    limit: LIMIT_REVIEWS_IN_PRODUCT_PAGE,
    page: 1,
    media: false,
    comment: false,
    rating: [],
  });
  const [viewPost] = useViewPostMutation();
  const [favoriteProduct] = useFavoriteProductMutation();
  const [
    getProductDetail,
    {
      data: getProductDetailData,
      isLoading: getProductDetailIsLoading,
      isFetching: getProductDetailIsFetching,
    },
  ] = useLazyGetProductDetailQuery();
  const [
    getPurchasedQuantities,
    {
      data: getPurchasedQuantitiesData,
      isFetching: getPurchasedQuantitiesIsFetching,
    },
  ] = useLazyGetPurchasedQuantitiesQuery();
  const [
    getReviews,
    {
      data: getReviewsData,
      isLoading: getReviewsIsLoading,
      isFetching: getReviewsIsFetching,
    },
  ] = useLazyGetAllReviewsQuery();
  const [updateUserCart] = useUpdateUserCartMutation();
  const {
    data: getShopInformationData,
    isLoading: getShopInformationIsLoading,
  } = useGetShopInformationQuery(merchantID);
  const { data: getFavoriteProduct, isLoading: getFavoriteProductIsLoading } =
    useGetFavoriteProductQuery(productID);
  const [
    getAllSimilarProducts,
    {
      data: getAllSimilarProductsData,
      isLoading: getAllSimilarProductsIsLoading,
      isFetching: getAllSimilarProductsIsFetching,
    },
  ] = useLazyGetAllProductsQuery();
  const [
    getMerchantSimilarProducts,
    {
      data: getMerchantSimilarProductsData,
      isLoading: getMerchantSimilarProductsIsLoading,
      isFetching: getMerchantSimilarProductsIsFetching,
    },
  ] = useLazyGetAllProductsQuery();
  const [selectedVariations, setSelectedVariations] = useState<number[]>([]);
  const [selectedVariantImage, setSelectedVariantImage] = useState<string>('');
  const [productItemName, setProductItemName] = useState<string>('');
  const [productItemPrice, setProductItemPrice] = useState<number>(0);
  const roleCode = useAppSelector(selectRole);
  const role = validateUserRole(roleCode);

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
        notifySuccessToast('Product has been added to cart');
      })
      .catch((err) => {
        if (err && 'data' in err) {
          const data = err.data as UpdateUserCartResponse;
          notifyErrorToast(data.message);
        }
      });
  };

  const handleClickFavoriteProduct = () => {
    favoriteProduct(productID)
      .unwrap()
      .then((res) => {
        if (!res.data) {
          return;
        }
        if (res.data.is_favorite) {
          notifySuccessToast('Product added to favorite list');
        } else {
          notifySuccessToast('Product removed from favorite list');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setSelectedVariations([]);
    setSelectedVariantImage('');
    setProductItemName('');
    setProductItemPrice(0);
    setPurchasedQuantitiesQuery({
      product_id: Number(productID),
      product_item_id: 0,
      quantity: 1,
    });
    const fetchData = () => {
      if (role === Role.Buyer || role === Role.Seller) {
        viewPost(productID);
      }
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
            .then(({ data }) => {
              if (!data) {
                return;
              }
            })
            .catch((err) => {
              if (err && 'data' in err) {
                const data = err.data as GetPurchasedQuantitiesResponse;
                notifyErrorToast(data.message);
              }
            });
        }
        getAllSimilarProducts(
          toProductQuery({
            search: '',
            sort: '',
            sortBy: '',
            limit: LIMIT_SIMILAR_PRODUCTS_IN_PRODUCT_PAGE,
            page: 1,
            merchantID: 0,
            categoryID: data.data.category_id,
            priceMinimum: 0,
            priceMaximum: 0,
            merchantCities: [],
            courierServices: [],
          })
        )
          .unwrap()
          .then((res) => {
            console.log({ res });
          })
          .catch((err) => {
            console.error(err);
          });
        getMerchantSimilarProducts(
          toProductQuery({
            search: '',
            sort: '',
            sortBy: '',
            limit: LIMIT_SIMILAR_PRODUCTS_IN_PRODUCT_PAGE,
            page: 1,
            merchantID: Number(merchantID),
            categoryID: data.data.category_id,
            priceMinimum: 0,
            priceMaximum: 0,
            merchantCities: [],
            courierServices: [],
          })
        )
          .unwrap()
          .then((res) => {
            console.log({ res });
          })
          .catch((err) => {
            console.error(err);
          });
      });
      getReviews({
        id: Number(productID),
        query: toReviewQuery(reviewQuery),
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchData();
  }, [productID, merchantID]);

  useEffect(() => {
    if (purchasedQuantitiesQuery.product_item_id === 0) {
      return;
    }
    getPurchasedQuantities(toPurchasedQuantitiesQuery(purchasedQuantitiesQuery))
      .unwrap()
      .then(({ data }) => {
        if (!data) {
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [purchasedQuantitiesQuery]);

  useEffect(() => {
    getReviews({ id: Number(productID), query: toReviewQuery(reviewQuery) })
      .unwrap()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [reviewQuery]);

  const handlePageChange = (n: number) => {
    setReviewQuery({
      ...reviewQuery,
      page: n,
    });
  };

  if (
    !getProductDetailData?.data ||
    !getShopInformationData?.data ||
    !getMerchantSimilarProductsData?.data ||
    !getAllSimilarProductsData?.data ||
    getProductDetailIsLoading ||
    getShopInformationIsLoading ||
    getMerchantSimilarProductsIsLoading ||
    getAllSimilarProductsIsLoading
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
              handleClickFavoriteProduct={handleClickFavoriteProduct}
              favoriteProductValue={Boolean(
                getFavoriteProduct?.data?.is_favorite
              )}
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
              getPurchasedQuantitiesIsFetching={
                getPurchasedQuantitiesIsFetching
              }
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
            <Reviews
              reviewData={getReviewsData?.data}
              reviewMetadata={getReviewsData?.metadata}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
        {getAllSimilarProductsData.data.length > 1 && (
          <>
            <div className='font-bold text-2xl my-3'>
              Similar Products For You
            </div>
            <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
              {getAllSimilarProductsData?.data?.map((product, n) => {
                if (product.id !== Number(productID)) {
                  return <ProductCard key={n} product={product} />;
                }
              })}
            </div>
          </>
        )}
        {getMerchantSimilarProductsData.data.length > 1 && (
          <>
            <div className='font-bold text-2xl my-3'>
              Similar Products From This Store
            </div>
            <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
              {getMerchantSimilarProductsData?.data?.map((product, n) => {
                if (product.id !== Number(productID)) {
                  return <ProductCard key={n} product={product} />;
                }
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
