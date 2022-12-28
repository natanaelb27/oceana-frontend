import { useEffect, useState } from 'react';
import { Button, Checkbox } from 'react-daisyui';
import { HiHeart, HiMenuAlt2, HiOutlineTrash } from 'react-icons/hi';
import { CgClose } from 'react-icons/cg';
import { useSearchParams } from 'react-router-dom';
import {
  FavoriteSortBar,
  Pager,
  ProductCard,
} from '../../../components/common';
import NoData from '../../../components/common/NoData';
import { FilterSidebar } from '../../../components/Search';
import { LIMIT_SEARCH_PRODUCTS_LIST, PRODUCT_STATUS } from '../../../constants';
import {
  useDeleteBatchFavoriteProductsMutation,
  useGetAllUserFavoriteProductsQuery,
} from '../../../store/services/profileService';
import { useGetAllCityQuery } from '../../../store/services/cityService';
import { ProductQuery } from '../../../types/query';
import {
  FavoriteProductsSortBy,
  FavoriteProductsSortByString,
  FavoriteProductsSortString,
} from '../../../types/sort';
import { toRupiah } from '../../../utils/convert';
import { toProductQuery } from '../../../utils/mapperDTO';
import { SelectedProduct } from '../../../types/component';
import { notifySuccessToast } from '../../../utils/toast';

type CategoryFilter = {
  id: number;
  name: string;
};

const Search = () => {
  const [sort, setSort] = useState(FavoriteProductsSortBy.RecentlySaved);
  const [productQuery, setProductQuery] = useState<ProductQuery>({
    search: '',
    sort: FavoriteProductsSortString.RecentlySaved,
    sortBy: FavoriteProductsSortByString.Saved,
    limit: LIMIT_SEARCH_PRODUCTS_LIST,
    page: 1,
    merchantID: 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    rating: 0,
    merchantCities: [],
    courierServices: [],
    status: PRODUCT_STATUS.ACTIVE,
  });
  const [searchParams] = useSearchParams();
  const { data: resGetAllProducts } = useGetAllUserFavoriteProductsQuery(
    toProductQuery(productQuery)
  );
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct>({});
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [
    deleteBatchFavoriteProduct,
    { isLoading: deleteBatchFavoriteProductIsLoading },
  ] = useDeleteBatchFavoriteProductsMutation();

  const q = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort-by') || '';

  useEffect(() => {
    if (sortBy === FavoriteProductsSortByString.Recommended) {
      handleSortChange(FavoriteProductsSortBy.Recommended);
    }

    setProductQuery({
      ...productQuery,
      search: q,
      sortBy,
    });
  }, [q, sortBy]);

  const handleCheckboxClick = (id: number) => {
    const newSelectedProducts = { ...selectedProducts };

    try {
      if (!newSelectedProducts?.[id]) {
        newSelectedProducts[id] = true;
      } else {
        delete newSelectedProducts?.[id];
      }
    } finally {
      setSelectedProducts(newSelectedProducts);
    }
  };

  const handleSortChange = (productSort: FavoriteProductsSortBy) => {
    let sortBy = '';
    let sort = '';
    if (productSort === FavoriteProductsSortBy.BestSeller) {
      sortBy = FavoriteProductsSortByString.BestSeller;
      sort = FavoriteProductsSortByString.Default;
    } else if (productSort === FavoriteProductsSortBy.Recommended) {
      sortBy = FavoriteProductsSortByString.Recommended;
      sort = FavoriteProductsSortByString.Default;
    } else if (productSort === FavoriteProductsSortBy.RecentlySaved) {
      sortBy = FavoriteProductsSortByString.Saved;
      sort = FavoriteProductsSortString.RecentlySaved;
    } else if (productSort === FavoriteProductsSortBy.OldestSaved) {
      sortBy = FavoriteProductsSortByString.Saved;
      sort = FavoriteProductsSortString.OldestSaved;
    } else if (productSort === FavoriteProductsSortBy.HighestPrice) {
      sortBy = FavoriteProductsSortByString.Price;
      sort = FavoriteProductsSortString.HighestPrice;
    } else if (productSort === FavoriteProductsSortBy.LowestPrice) {
      sortBy = FavoriteProductsSortByString.Price;
      sort = FavoriteProductsSortString.LowestPrice;
    }

    setSort(productSort);
    setProductQuery({
      ...productQuery,
      sortBy,
      sort,
    });
  };

  const handlePageChange = (n: number) => {
    setProductQuery({
      ...productQuery,
      page: n,
    });
  };

  const { data: resGetAllCity } = useGetAllCityQuery('');

  const handleClearLocationFilter = (id: number) => {
    const updatedList: string[] = [...productQuery.merchantCities];

    updatedList.splice(productQuery.merchantCities.indexOf(id.toString()), 1);

    setProductQuery({
      ...productQuery,
      merchantCities: updatedList,
    });
  };

  const handleClearRatingFilter = () => {
    setProductQuery({
      ...productQuery,
      rating: 0,
    });
  };

  const handleClickResetFilter = () => {
    setProductQuery({
      ...productQuery,
      merchantCities: [],
      priceMinimum: 0,
      priceMaximum: 0,
      rating: 0,
      categoryID: 0,
    });
  };

  const handleClearPriceMinimumFilter = () => {
    setProductQuery({
      ...productQuery,
      priceMinimum: 0,
    });
  };

  const handleClearPriceMaximumFilter = () => {
    setProductQuery({
      ...productQuery,
      priceMaximum: 0,
    });
  };

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>({
    id: 0,
    name: '',
  });

  const handleClearCategoryFilter = () => {
    setProductQuery({
      ...productQuery,
      categoryID: 0,
    });

    setCategoryFilter({
      id: 0,
      name: '',
    });
  };

  const handleManageClick = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  const handleDeleteClick = () => {
    deleteBatchFavoriteProduct({
      product_ids: Object.entries(selectedProducts).map(([key]) => Number(key)),
    })
      .unwrap()
      .then(() => {
        notifySuccessToast(
          'You have successfully deleted products from your wishlist'
        );
      })
      .finally(() => {
        setIsDeleteMode(false);
        setSelectedProducts({});
      });
  };

  if (!resGetAllProducts?.data) {
    return (
      <div className='mx-auto container'>
        <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
          <div className='col-span-1'>
            <FilterSidebar
              productQuery={productQuery}
              setProductQuery={setProductQuery}
              setCategoryFilter={setCategoryFilter}
            />
          </div>
          <div
            id='product-list-search-page'
            className='col-span-4 flex flex-col'
          >
            <div className='product-list-header'>
              <div className='flex justify-between'>
                <div className='ml-2 flex items-center gap-2 text-lg'>
                  <HiHeart className='text-3xl text-secondary' />
                  <span className='font-bold text-2xl'>Wishlist</span>
                </div>
                {isDeleteMode ? (
                  <div className='flex gap-1'>
                    <Button
                      onClick={handleDeleteClick}
                      color='error'
                      loading={deleteBatchFavoriteProductIsLoading}
                    >
                      Delete
                    </Button>
                    <Button onClick={handleManageClick}>Cancel</Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleManageClick}
                    color='info'
                    startIcon={<HiMenuAlt2 className='text-lg' />}
                  >
                    Manage
                  </Button>
                )}
              </div>
              <div className='mt-6'>
                <FavoriteSortBar sort={sort} onSortChange={handleSortChange} />
              </div>
            </div>
            {
              <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
                {Array.from({ length: 25 }, (_, index) => index + 1).map(
                  (n) => (
                    <ProductCard key={n} />
                  )
                )}
              </div>
            }
            <div className='mt-6 flex justify-center'>
              <Pager
                page={productQuery.page}
                totalPage={
                  resGetAllProducts?.metadata?.total_pages
                    ? resGetAllProducts.metadata.total_pages
                    : 0
                }
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto container'>
      <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
        <div className='col-span-1'>
          <FilterSidebar
            productQuery={productQuery}
            setProductQuery={setProductQuery}
            setCategoryFilter={setCategoryFilter}
          />
        </div>
        <div id='product-list-search-page' className='col-span-4 flex flex-col'>
          <div className='product-list-header'>
            <div className='flex justify-between'>
              <div className='ml-2 flex items-center gap-2 text-lg'>
                <HiHeart className='text-3xl text-secondary' />
                <span className='font-bold text-2xl'>Wishlist</span>
              </div>
              {isDeleteMode ? (
                <div className='flex gap-1'>
                  <Button
                    onClick={handleDeleteClick}
                    color='error'
                    startIcon={<HiOutlineTrash className='text-lg' />}
                    loading={deleteBatchFavoriteProductIsLoading}
                  >
                    Delete
                  </Button>
                  <Button onClick={handleManageClick}>Cancel</Button>
                </div>
              ) : (
                <Button
                  onClick={handleManageClick}
                  color='info'
                  startIcon={<HiMenuAlt2 className='text-lg' />}
                >
                  Manage
                </Button>
              )}
            </div>
            <div className='mt-6'>
              <FavoriteSortBar sort={sort} onSortChange={handleSortChange} />
            </div>
            {productQuery.merchantCities.length > 0 ||
            productQuery.priceMinimum ||
            productQuery.priceMaximum ||
            productQuery.rating ||
            productQuery.categoryID ? (
              <div className='flex gap-3 items-center mt-3'>
                <div className='flex gap-3 p-1 w-full items-center overflow-x-auto overflow-y-hidden'>
                  {productQuery.merchantCities.length > 0
                    ? resGetAllCity?.data
                        ?.filter(({ id }) =>
                          productQuery.merchantCities.includes(id.toString())
                        )
                        .map((city, i) => {
                          return (
                            <div
                              key={i}
                              className='border-2 pl-4 pr-2 py-2 rounded-2xl flex items-center gap-2'
                            >
                              <span className='whitespace-nowrap'>
                                {city.name}
                              </span>
                              <Button
                                size='xs'
                                shape='circle'
                                color='ghost'
                                className=''
                                onClick={() => {
                                  handleClearLocationFilter(city.id);
                                }}
                              >
                                <CgClose className='text-xs' />
                              </Button>
                            </div>
                          );
                        })
                    : null}
                  {productQuery.priceMinimum ? (
                    <div className='border-2 pl-4 pr-2 py-2 rounded-2xl flex items-center gap-2'>
                      <span className='whitespace-nowrap'>
                        Min: {toRupiah(productQuery.priceMinimum)}
                      </span>
                      <Button
                        size='xs'
                        shape='circle'
                        color='ghost'
                        className=''
                        onClick={() => {
                          handleClearPriceMinimumFilter();
                        }}
                      >
                        <CgClose className='text-xs' />
                      </Button>
                    </div>
                  ) : null}
                  {productQuery.priceMaximum ? (
                    <div className='border-2 pl-4 pr-2 py-2 rounded-2xl flex items-center gap-2'>
                      <span className='whitespace-nowrap'>
                        Max: {toRupiah(productQuery.priceMaximum)}
                      </span>
                      <Button
                        size='xs'
                        shape='circle'
                        color='ghost'
                        className=''
                        onClick={() => {
                          handleClearPriceMaximumFilter();
                        }}
                      >
                        <CgClose className='text-xs' />
                      </Button>
                    </div>
                  ) : null}
                  {productQuery.categoryID ? (
                    <div className='border-2 pl-4 pr-2 py-2 rounded-2xl flex items-center gap-2'>
                      <span className='whitespace-nowrap'>
                        {categoryFilter.name}
                      </span>
                      <Button
                        size='xs'
                        shape='circle'
                        color='ghost'
                        className=''
                        onClick={() => {
                          handleClearCategoryFilter();
                        }}
                      >
                        <CgClose className='text-xs' />
                      </Button>
                    </div>
                  ) : null}
                  {productQuery.rating ? (
                    <div className='border-2 pl-4 pr-2 py-2 rounded-2xl flex items-center gap-2'>
                      <span className='whitespace-nowrap'>
                        ⭐ {productQuery.rating} and above
                      </span>
                      <Button
                        size='xs'
                        shape='circle'
                        color='ghost'
                        className=''
                        onClick={() => {
                          handleClearRatingFilter();
                        }}
                      >
                        <CgClose className='text-xs' />
                      </Button>
                    </div>
                  ) : null}
                </div>
                <Button
                  className='normal-case text-sm btn-outline btn-primary'
                  onClick={handleClickResetFilter}
                >
                  Reset Filter
                </Button>
              </div>
            ) : null}
          </div>
          {resGetAllProducts?.data &&
            (resGetAllProducts.data.length > 0 ? (
              <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
                {resGetAllProducts?.data?.map((product, n) => (
                  <div key={n} className='relative'>
                    {isDeleteMode && (
                      <div className='absolute w-full bg-gradient-to-b from-base-300 to-transparent h-14 z-10'>
                        <Checkbox
                          color='secondary'
                          className='absolute right-2 top-2'
                          checked={Boolean(selectedProducts?.[product.id])}
                          onChange={() => handleCheckboxClick(product.id)}
                        />
                      </div>
                    )}
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : productQuery.merchantCities.length > 0 ||
              productQuery.priceMinimum ||
              productQuery.priceMaximum ||
              productQuery.rating ||
              productQuery.categoryID ? (
              <div className='mt-4'>
                <NoData
                  title='Oops, there are no products that match the filter...'
                  message='Try to reset or change your filter'
                  buttonMessage='Reset Filter'
                  buttonHandleClick={handleClickResetFilter}
                ></NoData>
              </div>
            ) : (
              <div className='mt-4'>
                <NoData
                  title='Oh no, your wishlist is empty!'
                  message='Try to add your favorite product to this list'
                ></NoData>
              </div>
            ))}
          <div className='mt-6 flex justify-center'>
            <Pager
              page={productQuery.page}
              totalPage={
                resGetAllProducts?.metadata?.total_pages
                  ? resGetAllProducts.metadata.total_pages
                  : 0
              }
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
