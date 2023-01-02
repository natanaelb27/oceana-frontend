import React, { ChangeEvent, useEffect, useState } from 'react';
import { Card, Divider } from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import {
  LIMIT_REVIEWS_IN_PRODUCT_PAGE,
  LIMIT_SIMILAR_PRODUCTS_IN_PRODUCT_PAGE,
} from '../../constants';
import { PRODUCT_STATUS } from '../../constants/index';
import {
  useIncrementUserCartMutation,
  useLazyGetUserCartQuery,
  useUpdateUserCartMutation,
} from '../../store/services/cartService';
import {
  useFavoriteProductMutation,
  useLazyGetFavoriteProductQuery,
} from '../../store/services/favoriteProductService';
import { useLazyGetMyShopProfileQuery } from '../../store/services/myShopService';
import {
  useLazyGetAllProductsQuery,
  useLazyGetProductDetailQuery,
  useLazyGetPurchasedQuantitiesQuery,
  useViewPostMutation,
} from '../../store/services/productService';
import { useLazyGetAllReviewsQuery } from '../../store/services/reviewService';
import { useGetShopInformationQuery } from '../../store/services/shopService';
import { selectRole } from '../../store/slices/authSlice';
import { setCheckout, unsetCheckout } from '../../store/slices/checkoutSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  CartGroupedByMerchant,
  CartProduct,
  ProductModel,
} from '../../types/component';
import { PurchasedQuantitiesQuery, ReviewQuery } from '../../types/query';
import { UpdateUserCartResponse } from '../../types/response';
import { Role } from '../../types/role';
import { ReviewsSort } from '../../types/sort';
import { validateUserRole } from '../../utils/auth';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import {
  toProductQuery,
  toPurchasedQuantitiesQuery,
  toReviewQuery,
} from '../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { ProductCard } from '../common';
import ProductCart from './ProductCart';
import ProductDescription from './ProductDescription';
import ProductMedia from './ProductMedia';
import Reviews from './Reviews';
import ReviewStatsAndFilter from './ReviewStatsAndFilter';
import ShopBanner from './ShopBanner';

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
    sort_by: '',
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
  const [getPurchasedQuantities, { data: getPurchasedQuantitiesData }] =
    useLazyGetPurchasedQuantitiesQuery();
  const [
    getMyShopProfile,
    { data: myShopProfileData, isLoading: myShopProfileIsLoading },
  ] = useLazyGetMyShopProfileQuery();
  const [getUserCart] = useLazyGetUserCartQuery();
  const [getReviews, { data: getReviewsData }] = useLazyGetAllReviewsQuery();
  const [updateUserCart] = useUpdateUserCartMutation();
  const [incrementUserCart] = useIncrementUserCartMutation();
  
  const {
    data: getShopInformationData,
    isLoading: getShopInformationIsLoading,
  } = useGetShopInformationQuery(String(getProductDetailData?.data?.merchant_id));

  const [getFavoriteData, { data: getFavoriteProductData }] =
    useLazyGetFavoriteProductQuery();
  const [
    getAllSimilarProducts,
    {
      data: getAllSimilarProductsData,
      isLoading: getAllSimilarProductsIsLoading,
    },
  ] = useLazyGetAllProductsQuery();
  const [
    getMerchantSimilarProducts,
    {
      data: getMerchantSimilarProductsData,
      isLoading: getMerchantSimilarProductsIsLoading,
    },
  ] = useLazyGetAllProductsQuery();
  const [selectedVariations, setSelectedVariations] = useState<number[]>([]);
  const [selectedVariantImage, setSelectedVariantImage] = useState<string>('');
  const [disablePurchase, setDisablePurchase] = useState<boolean>(false);
  const [disabledVariants, setDisabledVariants] = useState<number[][]>([]);
  const [productSelected, setProductSelected] = useState<ProductModel | null>(
    null
  );

  const [productItemName, setProductItemName] = useState<string>('');
  const [productItemPrice, setProductItemPrice] = useState<number>(0);
  const [productLikeCount, setProductLikeCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sort, setSort] = useState<ReviewsSort>(ReviewsSort.Latest);

  const roleCode = useAppSelector(selectRole);
  const role = validateUserRole(roleCode);

  const handleClickVariation = (e: React.SyntheticEvent) => {
    setProductSelected(null);
    setPurchasedQuantitiesQuery({
      product_id: Number(productID),
      product_item_id: 0,
      quantity: 1,
    });

    if (!getProductDetailData?.data) {
      return;
    }
    const target = e.target as HTMLInputElement;
    const indexes = target.id.split('-');
    const variationIndex = Number(indexes[0]);
    const optionIndex = Number(indexes[1]);
    let selectedVariationsCopy: number[] = [...selectedVariations];

    if (selectedVariationsCopy[variationIndex] === optionIndex) {
      const arr = new Array(getProductDetailData.data.product_variation.length);
      for (let i = 0; i < arr.length; i++) {
        if (variationIndex === i) {
          continue;
        }
        arr[i] = selectedVariationsCopy[i];
      }
      selectedVariationsCopy = arr;
    } else {
      selectedVariationsCopy[variationIndex] = optionIndex;
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
      setProductSelected(foundProductModel);
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

    if (getProductDetailData?.data?.product_model.length === 1) {
      purchasedQuantitiesQueryCopy.product_item_id =
        getProductDetailData?.data?.product_model.at(0)?.product_item_id || 0;
    }

    setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  };

  const handleClickDecreaseQuantity = () => {
    const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
    if (purchasedQuantitiesQueryCopy.quantity === 0) {
      return;
    }
    purchasedQuantitiesQueryCopy.quantity -= 1;

    if (getProductDetailData?.data?.product_model.length === 1) {
      purchasedQuantitiesQueryCopy.product_item_id =
        getProductDetailData?.data?.product_model.at(0)?.product_item_id || 0;
    }

    setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  };

  // const handleChangeQuantity = (e: React.SyntheticEvent) => {
  //   const target = e.target as HTMLInputElement;
  //   if (isNaN(Number(target.value)) || Number(target.value) <= 0) {
  //     return;
  //   }

  //   if (
  //     Number(target.value) >=
  //     (productSelected?.stock_quantity ||
  //       getProductDetailData?.data?.total_stock ||
  //       0)
  //   ) {
  //     setPurchasedQuantitiesQuery({
  //       ...purchasedQuantitiesQuery,
  //       quantity:
  //         productSelected?.stock_quantity ||
  //         getProductDetailData?.data?.total_stock ||
  //         0,
  //     });
  //     return;
  //   }

  //   if (Number(target.value) > 999) {
  //     const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
  //     purchasedQuantitiesQueryCopy.quantity = 999;
  //     setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  //     return;
  //   }
  //   const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };
  //   purchasedQuantitiesQueryCopy.quantity = Number(target.value);
  //   setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  // };

  const handleChangeQuantity = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    if (isNaN(Number(target.value)) || Number(target.value) <= 0) {
      return;
    }

    const purchasedQuantitiesQueryCopy = { ...purchasedQuantitiesQuery };

    if (
      Number(target.value) >=
      (productSelected?.stock_quantity ||
        getProductDetailData?.data?.total_stock ||
        0)
    ) {
      purchasedQuantitiesQueryCopy.quantity =
        productSelected?.stock_quantity ||
        getProductDetailData?.data?.total_stock ||
        0;
    } else if (Number(target.value) > 999) {
      purchasedQuantitiesQueryCopy.quantity = 999;
    } else {
      purchasedQuantitiesQueryCopy.quantity = Number(target.value);
    }

    if (getProductDetailData?.data?.product_model.length === 1) {
      purchasedQuantitiesQueryCopy.product_item_id =
        getProductDetailData?.data?.product_model.at(0)?.product_item_id || 0;
    }

    setPurchasedQuantitiesQuery(purchasedQuantitiesQueryCopy);
  };

  const handleClickBuyNow = () => {
    if (
      selectedVariations.filter((items) => typeof items === 'number').length <
      (getProductDetailData?.data?.product_variation.length || 0)
    ) {
      notifyErrorToast('Please select product variation first');
      return;
    }

    if (roleCode) {
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
          getUserCart()
            .unwrap()
            .then((res) => {
              const { data: userCart } = res;
              dispatch(unsetCheckout());

              const toCheckout: CartGroupedByMerchant[] = [];
              const cartProducts: CartProduct[] = [];
              const cartByMerchant = userCart?.filter(
                (cartByMerchant) =>
                  cartByMerchant.products.filter(
                    (product) => product.product_item_id === productItemID
                  ).length > 0
              ) as CartGroupedByMerchant[];

              const productInCart = cartByMerchant[0].products.filter(
                (product) => product.product_item_id === productItemID
              )[0];
              const cartProduct: CartProduct = {
                carts_id: productInCart.carts_id,
                price: productInCart.price,
                price_after_discount: productInCart.price_after_discount,
                product_id: productInCart.product_id,
                product_item_id: productInCart.product_item_id,
                product_media_url: productInCart.product_media_url,
                product_merchant_promotion_id:
                  productInCart.product_merchant_promotion_id,
                product_name: productInCart.product_name,
                product_variation: productInCart.product_variation,
                product_weight: productInCart.product_weight,
                stock_quantity: productInCart.stock_quantity,
                quantity: purchasedQuantitiesQuery.quantity,
              };
              cartProducts.push(cartProduct);

              const toCheckoutProductItem: CartGroupedByMerchant = {
                city_id: cartByMerchant[0].city_id,
                merchant_id: cartByMerchant[0].merchant_id,
                merchant_province: cartByMerchant[0].merchant_province,
                name: cartByMerchant[0].name,
                products: cartProducts,
              };
              toCheckoutProductItem.products[0].quantity =
                purchasedQuantitiesQuery.quantity;
              toCheckout.push(toCheckoutProductItem);

              dispatch(setCheckout({ cartGroupedByMerchants: toCheckout }));
              navigate('/checkout');
            });
        })
        .catch((err) => {
          if (err && 'data' in err) {
            const data = err.data as UpdateUserCartResponse;
            notifyErrorToast(capitalizeFirstLetter(data.message));
          }
        });
    } else {
      navigate('/login');
    }
  };

  const handleClickAddToCart = () => {
    if (
      selectedVariations.filter((items) => typeof items === 'number').length <
      (getProductDetailData?.data?.product_variation.length || 0)
    ) {
      notifyErrorToast('Please select product variation first');
      return;
    }

    if (roleCode) {
      let productItemID = 0;
      if (getProductDetailData?.data?.product_variation.length === 0) {
        productItemID =
          getProductDetailData.data.product_model[0].product_item_id;
      } else {
        productItemID = purchasedQuantitiesQuery.product_item_id;
      }
      incrementUserCart({
        product_item_id: productItemID,
        quantity: purchasedQuantitiesQuery.quantity,
        action: 'increment',
      })
        .unwrap()
        .then(() => {
          notifySuccessToast('Product has been added to cart');
        })
        .catch((err) => {
          if (err && 'data' in err) {
            const data = err.data as UpdateUserCartResponse;
            notifyErrorToast(capitalizeFirstLetter(data.message));
          }
        });
      getPurchasedQuantities(
        toPurchasedQuantitiesQuery({
          product_item_id: productItemID,
          product_id: Number(productID),
          quantity: purchasedQuantitiesQuery.quantity,
        })
      );
    } else {
      navigate('/login');
    }
  };

  const handleClickFavoriteProduct = () => {
    if (roleCode) {
      favoriteProduct(productID)
        .unwrap()
        .then((res) => {
          if (!res.data) {
            return;
          }
          if (res.data.is_favorite) {
            notifySuccessToast('Product added to favorite list');
            setProductLikeCount(productLikeCount + 1);
          } else {
            notifySuccessToast('Product removed from favorite list');
            setProductLikeCount(productLikeCount - 1);
          }
        });
    } else {
      navigate('/login');
    }
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
    setDisablePurchase(false);
    const fetchData = () => {
      if (role === Role.Buyer || role === Role.Seller) {
        viewPost(productID);
        getFavoriteData(productID);
      }
      if (role === Role.Seller) {
        getMyShopProfile();
      }
      getProductDetail(productID).then(({ data }) => {
        if (!data?.data) {
          return;
        }
        setProductLikeCount(data.data.like_count);
        if (data.data.product_variation.length === 0) {
          if (role === Role.Buyer || role === Role.Seller) {
            setProductSelected(data.data.product_model[0]);
            getPurchasedQuantities(
              toPurchasedQuantitiesQuery({
                product_item_id: data.data.product_model[0].product_item_id,
                product_id: Number(productID),
                quantity: purchasedQuantitiesQuery.quantity,
              })
            );
          } else {
            setProductSelected(data.data.product_model[0]);
          }
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
            rating: 0,
            merchantCities: [],
            courierServices: [],
            status: PRODUCT_STATUS.ACTIVE,
          })
        );
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
            rating: 0,
            merchantCities: [],
            courierServices: [],
            status: PRODUCT_STATUS.ACTIVE,
          })
        );
      });
      getReviews({
        id: Number(productID),
        query: toReviewQuery(reviewQuery),
      });
    };

    fetchData();
  }, [productID, merchantID]);

  useEffect(() => {
    if (
      myShopProfileData &&
      getShopInformationData &&
      getShopInformationData.data
    ) {
      if (myShopProfileData.data.name === getShopInformationData.data.name) {
        setDisablePurchase(true);
      }
    }
  }, [myShopProfileData, getShopInformationData]);

  useEffect(() => {
    if (purchasedQuantitiesQuery.product_item_id === 0) {
      return;
    }

    if (role !== Role.Buyer && role !== Role.Seller) {
      return;
    }

    getPurchasedQuantities(toPurchasedQuantitiesQuery(purchasedQuantitiesQuery))
      .unwrap()
      .then(({ data }) => {
        if (!data) {
          return;
        }
      });
  }, [purchasedQuantitiesQuery]);

  useEffect(() => {
    getReviews({ id: Number(productID), query: toReviewQuery(reviewQuery) });
  }, [reviewQuery]);

  useEffect(() => {
    if (selectedVariations.length > 0) {
      setDisabledVariants([]);
      const finalArr: number[][] = [
        ...Array(getProductDetailData?.data?.product_variation?.length),
      ].map(() => [...Array(0)]);
      getProductDetailData?.data?.product_model?.map((model) => {
        model.variation_index.map((eModel, idx) => {
          if (eModel === selectedVariations.at(idx)) {
            if (model.stock_quantity === 0) {
              model.variation_index.map((vi, viIdx) => {
                if (viIdx !== idx) {
                  finalArr[viIdx]?.push(vi);
                }
              });
            }
          }
        });
      });
      setDisabledVariants(finalArr);
    }
  }, [selectedVariations]);

  const handleChangeReviewPage = (n: number) => {
    setReviewQuery({
      ...reviewQuery,
      page: n,
    });
  };

  const handleChangeFilterReviewWithMedia = () => {
    setReviewQuery({
      ...reviewQuery,
      media: !reviewQuery.media,
      page: 1,
    });
  };

  const handleChangeFilterReviewRating = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);
    const ratingCopy = [...reviewQuery.rating];
    if (ratingCopy.includes(value)) {
      const index = ratingCopy.indexOf(value);
      if (index > -1) {
        ratingCopy.splice(index, 1);
      }
    } else {
      ratingCopy.push(value);
    }
    setReviewQuery({
      ...reviewQuery,
      rating: ratingCopy,
      page: 1,
    });
  };

  const handleChangeFilterReviewComments = () => {
    setReviewQuery({
      ...reviewQuery,
      comment: !reviewQuery.comment,
      page: 1,
    });
  };

  const handleChangeReviewSort = (e: ChangeEvent<HTMLSelectElement>) => {
    const sort = Number(e.target.value);
    if (sort === ReviewsSort.Latest) {
      setReviewQuery({
        ...reviewQuery,
        sort_by: 'latest',
      });
    } else if (sort === ReviewsSort.HighestRating) {
      setReviewQuery({
        ...reviewQuery,
        sort_by: 'highest-rating',
      });
    } else if (sort === ReviewsSort.LowestRating) {
      setReviewQuery({
        ...reviewQuery,
        sort_by: 'lowest-rating',
      });
    }
    setSort(sort);
  };

  if (
    !getProductDetailData?.data ||
    !getShopInformationData?.data ||
    !getMerchantSimilarProductsData?.data ||
    !getAllSimilarProductsData?.data ||
    getProductDetailIsLoading ||
    getShopInformationIsLoading ||
    getMerchantSimilarProductsIsLoading ||
    getAllSimilarProductsIsLoading ||
    getProductDetailIsFetching
  ) {
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
              <ShopBanner />
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
            <div className='col-span-12 md:col-span-3'>
              <ReviewStatsAndFilter isLoading={true} />
            </div>
            <div className='col-span-12 md:col-span-6'>
              <Reviews isLoading={true} />
              <Reviews isLoading={true} />
              <Reviews isLoading={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto'>
      <div className='px-4 py-10'>
        <div className='grid grid-cols-12 gap-4 gap-y-10 md:gap-10 relative'>
          <div className='col-span-12 md:col-span-9'>
            <div className='grid grid-cols-12 gap-4 gap-y-10'>
              <div className='col-span-12 md:col-span-4'>
                {getProductDetailData?.data && (
                  <ProductMedia
                    images={getProductDetailData?.data?.images}
                    videos={getProductDetailData?.data?.videos}
                    variantImages={
                      getProductDetailData?.data?.product_variation?.[0]
                        ?.image || []
                    }
                    selectedVariantImage={
                      selectedVariantImage ===
                      getProductDetailData?.data?.images?.[0]
                        ? ''
                        : selectedVariantImage
                    }
                    handleClickFavoriteProduct={handleClickFavoriteProduct}
                    favoriteProductValue={Boolean(
                      getFavoriteProductData?.data?.is_favorite
                    )}
                    productLikeCount={productLikeCount}
                  />
                )}
              </div>
              <div className='col-span-12 md:col-span-8'>
                <ProductDescription
                  userRoleCode={roleCode}
                  productVariations={
                    getProductDetailData.data.product_variation
                  }
                  productDetail={getProductDetailData.data}
                  shopInformation={getShopInformationData.data}
                  handleClickVariation={handleClickVariation}
                  selectedVariations={selectedVariations}
                  selectedModel={productSelected}
                  purchasedQuantitiesPrice={
                    getPurchasedQuantitiesData?.data?.price
                  }
                  purchasedQuantitiesProductMerchantPromotionID={
                    getPurchasedQuantitiesData?.data
                      ?.product_merchant_promotion_id
                  }
                  productItemPrice={productItemPrice}
                  disabledVariants={disabledVariants}
                  disablePurchase={disablePurchase}
                />
              </div>
              <div className='col-span-12 md:hidden relative'>
                <ProductCart
                  userRoleCode={roleCode}
                  selectedModel={productSelected}
                  stock={getProductDetailData.data.total_stock}
                  quantity={purchasedQuantitiesQuery.quantity}
                  handleClickAddQuantity={handleClickAddQuantity}
                  handleClickDecreaseQuantity={handleClickDecreaseQuantity}
                  handleChangeQuantity={handleChangeQuantity}
                  purchasedQuantitiesStock={
                    getPurchasedQuantitiesData?.data?.stock
                  }
                  purchasedQuantitiesPrice={
                    getPurchasedQuantitiesData?.data?.price
                  }
                  productVariation={productItemName}
                  productVariations={
                    getProductDetailData.data.product_variation
                  }
                  productPrice={getProductDetailData.data.price}
                  selectedVariations={selectedVariations}
                  productMerchantPromotionID={
                    getPurchasedQuantitiesData?.data
                      ?.product_merchant_promotion_id
                  }
                  userMaxPurchaseQuantity={
                    getPurchasedQuantitiesData?.data?.user_max_purchase_quantity
                  }
                  maxPurchaseQuantity={
                    getPurchasedQuantitiesData?.data?.max_purchase_quantity
                  }
                  handleClickAddToCart={handleClickAddToCart}
                  handleClickBuyNow={handleClickBuyNow}
                  defaultImage={getProductDetailData.data.images[0]}
                  selectedVariantImage={selectedVariantImage}
                  disablePurchase={disablePurchase}
                />
              </div>
              <div className='col-span-12 md:col-span-4'>
                <ReviewStatsAndFilter
                  handleChangeFilterReviewWithMedia={
                    handleChangeFilterReviewWithMedia
                  }
                  handleChangeFilterReviewRating={
                    handleChangeFilterReviewRating
                  }
                  handleChangeFilterReviewComments={
                    handleChangeFilterReviewComments
                  }
                  productReviewDetails={
                    getProductDetailData.data.product_review_details
                  }
                />
              </div>
              <div className='col-span-12 md:col-span-8'>
                <Reviews
                  reviewData={getReviewsData?.data}
                  reviewMetadata={getReviewsData?.metadata}
                  handleChangeReviewPage={handleChangeReviewPage}
                  handleChangeReviewSort={handleChangeReviewSort}
                  sortValue={sort}
                />
              </div>
            </div>
          </div>
          <div className='hidden md:block md:col-span-3 relative'>
            <ProductCart
              userRoleCode={roleCode}
              selectedModel={productSelected}
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
              handleClickAddToCart={handleClickAddToCart}
              handleClickBuyNow={handleClickBuyNow}
              defaultImage={getProductDetailData.data.images[0]}
              selectedVariantImage={selectedVariantImage}
              disablePurchase={disablePurchase}
            />
          </div>
        </div>
        {getAllSimilarProductsData.data.length > 1 && (
          <>
            <div className='font-bold text-2xl my-3'>
              Similar Products For You
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
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
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
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
