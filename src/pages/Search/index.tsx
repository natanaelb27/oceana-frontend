import { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { CgClose } from 'react-icons/cg';
import { TbError404 } from 'react-icons/tb';
import { useSearchParams } from 'react-router-dom';
import { Pager, ProductCard, SortBar } from '../../components/common';
import NoData from '../../components/common/NoData';
import { FilterSidebar } from '../../components/Search';
import { LIMIT_SEARCH_PRODUCTS_LIST } from '../../constants';
import { useGetAllCityQuery } from '../../store/services/cityService';
import { useGetAllProductsQuery } from '../../store/services/productService';
import { ProductQuery } from '../../types/query';
import {
  ProductsSortString,
  ProductsSortBy,
  ProductsSortByString,
} from '../../types/sort';
import { toRupiah } from '../../utils/convert';
import { toProductQuery } from '../../utils/mapperDTO';

const Search = () => {
  const [sort, setSort] = useState(ProductsSortBy.Default);
  const [productQuery, setProductQuery] = useState<ProductQuery>({
    search: '',
    sort: '',
    sortBy: '',
    limit: LIMIT_SEARCH_PRODUCTS_LIST,
    page: 1,
    merchantID: 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    rating: 0,
    merchantCities: [],
    courierServices: [],
  });
  const [searchParams] = useSearchParams();
  const { data: resGetAllProducts } = useGetAllProductsQuery(
    toProductQuery(productQuery)
  );

  const q = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort-by') || '';

  useEffect(() => {
    if (sortBy === ProductsSortByString.Recommended) {
      handleSortChange(ProductsSortBy.Recommended);
    }

    setProductQuery({
      ...productQuery,
      search: q,
      sortBy,
    });
  }, [q, sortBy]);

  const handleSortChange = (productSort: ProductsSortBy) => {
    let sortBy = '';
    let sort = '';
    if (productSort === ProductsSortBy.BestSeller) {
      sortBy = ProductsSortByString.BestSeller;
      sort = ProductsSortByString.Default;
    } else if (productSort === ProductsSortBy.Recommended) {
      sortBy = ProductsSortByString.Recommended;
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

  // render product not found
  // if (resGetAllProducts?.data?.length === 0) {
  //   return (
  //     <div className='mx-auto container'>
  //       <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
  //         <div className='col-span-1'>
  //           <FilterSidebar
  //             productQuery={productQuery}
  //             setProductQuery={setProductQuery}
  //           />
  //         </div>
  //         <div
  //           id='product-list-search-page'
  //           className='col-span-4 flex flex-col'
  //         >
  //           <div className='product-list-header'>
  //             <div className='ml-2 flex items-center gap-2 text-lg'>
  //               <AiOutlineInfoCircle />
  //               <p>
  //                 Search results for &quot;
  //                 <strong>{searchParams.get('q')}</strong>&quot;
  //               </p>
  //             </div>
  //             <div className='mt-6'>
  //               <SortBar sort={sort} onSortChange={handleSortChange} />
  //             </div>
  //           </div>
  //           <div className='mt-6 flex flex-col items-center text-center text-error animate-pulse'>
  //             <TbError404 className='text-9xl' />
  //             <h3 className='text-3xl font-bold'>
  //               Oof, product not found... Please try again!
  //             </h3>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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

  return (
    <div className='mx-auto container'>
      <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
        <div className='col-span-1'>
          <FilterSidebar
            productQuery={productQuery}
            setProductQuery={setProductQuery}
          />
        </div>
        <div id='product-list-search-page' className='col-span-4 flex flex-col'>
          <div className='product-list-header'>
            <div className='ml-2 flex items-center gap-2 text-lg'>
              <AiOutlineInfoCircle />
              <p>
                Search results for &quot;
                <strong>{searchParams.get('q')}</strong>&quot;
              </p>
            </div>
            <div className='mt-6'>
              <SortBar sort={sort} onSortChange={handleSortChange} />
            </div>
            {productQuery.merchantCities.length > 0 ||
            productQuery.priceMinimum ||
            productQuery.priceMaximum ||
            productQuery.rating ? (
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
                  {productQuery.rating ? (
                    <div className='border-2 pl-4 pr-2 py-2 rounded-2xl flex items-center gap-2'>
                      <span className='whitespace-nowrap'>
                        {productQuery.rating} and above
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
          {resGetAllProducts?.data && resGetAllProducts?.data?.length > 0 ? (
            <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
              {resGetAllProducts?.data?.map((product, n) => (
                <ProductCard key={n} product={product} />
              ))}
            </div>
          ) : productQuery.merchantCities.length > 0 ||
            productQuery.priceMinimum ||
            productQuery.priceMaximum ||
            productQuery.rating ? (
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
              <NoData title='Oops, it seems that there are no products that match the keyword...'></NoData>
            </div>
          )}
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
