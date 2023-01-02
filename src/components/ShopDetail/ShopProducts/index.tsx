import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Form, Input, InputGroup } from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import { HiSearch } from 'react-icons/hi';
import { useSearchParams } from 'react-router-dom';
import { Pager, ProductCard, SortBar } from '../../../components/common';
import NoData from '../../../components/common/NoData';
import { LIMIT_SEARCH_PRODUCTS_LIST, PRODUCT_STATUS } from '../../../constants';
import { useGetAllCityQuery } from '../../../store/services/cityService';
import { useGetAllProductsQuery } from '../../../store/services/productService';
import { ProductQuery } from '../../../types/query';
import {
  ProductsSortBy,
  ProductsSortByString,
  ProductsSortString,
} from '../../../types/sort';
import { toRupiah } from '../../../utils/convert';
import { toProductQuery } from '../../../utils/mapperDTO';
import FilterSidebar from './FilterSidebar';

type CategoryFilter = {
  id: number;
  name: string;
};

type ContentProps = {
  merchantID?: string;
};

const ShopProducts = ({ merchantID }: ContentProps) => {
  const [sort, setSort] = useState(ProductsSortBy.BestSeller);
  const [productQuery, setProductQuery] = useState<ProductQuery>({
    search: '',
    sort: '',
    sortBy: '',
    limit: LIMIT_SEARCH_PRODUCTS_LIST,
    page: 1,
    merchantID: Number(merchantID) || 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    rating: 0,
    merchantCities: [],
    courierServices: [],
    status: PRODUCT_STATUS.ACTIVE,
  });
  const [searchParams] = useSearchParams();
  const { data: resGetAllProducts } = useGetAllProductsQuery(
    toProductQuery(productQuery)
  );

  const [search, setSearch] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setProductQuery({
      ...productQuery,
      page: 1,
      search: search,
    });
  };

  const handleSearchClick = () => {
    setProductQuery({
      ...productQuery,
      page: 1,
      search: search,
    });
  };

  const sortBy = searchParams.get('sort-by') || ProductsSortByString.BestSeller;

  useEffect(() => {
    if (sortBy === ProductsSortByString.Recommended) {
      handleSortChange(ProductsSortBy.Recommended);
    }

    setProductQuery({
      ...productQuery,
      sortBy,
    });
  }, [sortBy]);

  const handleSortChange = (productSort: ProductsSortBy) => {
    let sortBy = '';
    let sort = '';
    if (productSort === ProductsSortBy.BestSeller) {
      sortBy = ProductsSortByString.BestSeller;
      sort = ProductsSortByString.Default;
    } else if (productSort === ProductsSortBy.Recommended) {
      sortBy = ProductsSortByString.Recommended;
      sort = ProductsSortByString.Default;
    } else if (productSort === ProductsSortBy.Newest) {
      sortBy = ProductsSortByString.Newest;
      sort = ProductsSortByString.Default;
    } else if (productSort === ProductsSortBy.HighestPrice) {
      sortBy = ProductsSortByString.Price;
      sort = ProductsSortString.HighestPrice;
    } else if (productSort === ProductsSortBy.LowestPrice) {
      sortBy = ProductsSortByString.Price;
      sort = ProductsSortString.LowestPrice;
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

  const handleClearSearchFilter = () => {
    setSearch('');
    setProductQuery({
      ...productQuery,
      search: '',
    });
  };

  const handleClearRatingFilter = () => {
    setProductQuery({
      ...productQuery,
      rating: 0,
    });
  };

  const handleClickResetFilter = () => {
    setSearch('');
    setProductQuery({
      ...productQuery,
      merchantCities: [],
      search: '',
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

  if (!resGetAllProducts?.data) {
    return (
      <div className='mx-auto container'>
        <div className='p-4 grid grid-cols-1 md:grid-cols-7 gap-4 md:py-10 md:gap-10'>
          <div className='col-span-2'>
            <FilterSidebar
              productQuery={productQuery}
              merchantID={merchantID}
              setProductQuery={setProductQuery}
              setCategoryFilter={setCategoryFilter}
            />
          </div>
          <div
            className='col-span-5 flex flex-col'
            id='product-list-search-page'
          >
            <div className='product-list-header'>
              <div className='flex gap-3'>
                <div className='ml-2 flex items-center gap-2 text-lg'>
                  <span className='font-bold'>Shop Products</span>
                </div>
                <Form onSubmit={handleFormSubmit} className='w-full md:w-auto'>
                  <InputGroup>
                    <Input
                      type='text'
                      placeholder='Search...'
                      className='w-full md:max-w-xs'
                      value={search}
                      onChange={handleSearchChange}
                    />
                    <Button onClick={handleSearchClick}>
                      <HiSearch className='text-lg' />
                    </Button>
                  </InputGroup>
                </Form>
              </div>
              <div className='mt-6'>
                <SortBar sort={sort} onSortChange={handleSortChange} />
              </div>
            </div>
            {
              <div className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4'>
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
    <div className='mx-auto container lg:w-3/5 w-full'>
      <div className='p-4 grid grid-cols-1 md:grid-cols-7 gap-4 md:py-10 md:gap-10'>
        <div className='col-span-2'>
          <FilterSidebar
            productQuery={productQuery}
            merchantID={merchantID}
            setProductQuery={setProductQuery}
            setCategoryFilter={setCategoryFilter}
          />
        </div>
        <div className='col-span-5 flex flex-col' id='product-list-search-page'>
          <div className='product-list-header'>
            <div className='flex gap-3'>
              <div className='ml-2 flex items-center gap-2 text-lg'>
                <span className='font-bold'>Shop Products</span>
              </div>
              <Form onSubmit={handleFormSubmit} className='w-full md:w-auto'>
                <InputGroup>
                  <Input
                    type='text'
                    placeholder='Search...'
                    className='w-full md:max-w-xs'
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <Button onClick={handleSearchClick}>
                    <HiSearch className='text-lg' />
                  </Button>
                </InputGroup>
              </Form>
            </div>
            <div className='mt-6'>
              <SortBar sort={sort} onSortChange={handleSortChange} />
            </div>
            {productQuery.search ||
            productQuery.merchantCities.length > 0 ||
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
                  {productQuery.search ? (
                    <div className='border-2 pl-4 pr-2 py-2 rounded-2xl flex items-center gap-2'>
                      <span className='whitespace-nowrap'>
                        Search: {productQuery.search}
                      </span>
                      <Button
                        size='xs'
                        shape='circle'
                        color='ghost'
                        className=''
                        onClick={() => {
                          handleClearSearchFilter();
                        }}
                      >
                        <CgClose className='text-xs' />
                      </Button>
                    </div>
                  ) : null}
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
              <div className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4'>
                {resGetAllProducts?.data?.map((product, n) => (
                  <ProductCard key={n} product={product} />
                ))}
              </div>
            ) : productQuery.search ||
              productQuery.merchantCities.length > 0 ||
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
                <NoData title='Oops, it seems that there are no products available'></NoData>
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

export default ShopProducts;
