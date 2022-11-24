import { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { TbError404 } from 'react-icons/tb';
import { useSearchParams } from 'react-router-dom';
import { Pager, ProductCard, SortBar } from '../../components/common';
import { FilterSidebar } from '../../components/Search';
import { useGetAllProductsQuery } from '../../store/services/productService';
import { ProductQuery } from '../../types/query';
import { ProductsSort } from '../../types/sort';
import { toProductQuery } from '../../utils/mapperDTO';

const Search = () => {
  const [sort, setSort] = useState(ProductsSort.Default);
  const [productQuery, setProductQuery] = useState<ProductQuery>({
    search: '',
    sort: '',
    sortBy: '',
    limit: 30,
    page: 1,
    merchantID: 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    merchantCities: [],
    courierServices: [],
  });
  const [searchParams] = useSearchParams();
  const { data: resGetAllProducts } = useGetAllProductsQuery(
    toProductQuery(productQuery)
  );

  const q = searchParams.get('q');

  useEffect(() => {
    if (q === null) {
      return;
    }

    setProductQuery({
      ...productQuery,
      search: q,
    });
  }, [q]);

  const handleSortChange = (productSort: ProductsSort) => {
    let sortBy = '';
    let sort = '';
    if (productSort === ProductsSort.BestSeller) {
      sortBy = 'best-seller';
      sort = '';
    } else if (productSort === ProductsSort.MostPopular) {
      sortBy = 'recommended';
      sort = '';
    } else if (productSort === ProductsSort.HighestPrice) {
      sortBy = 'price';
      sort = 'desc';
    } else if (productSort === ProductsSort.LowestPrice) {
      sortBy = 'price';
      sort = 'asc';
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

  if (resGetAllProducts?.data?.length === 0) {
    return (
      <div className='mx-auto container'>
        <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
          <div className='col-span-1'>
            <FilterSidebar />
          </div>
          <div
            id='product-list-search-page'
            className='col-span-4 flex flex-col'
          >
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
            </div>
            <div className='mt-6 flex flex-col items-center text-center text-error animate-pulse'>
              <TbError404 className='text-9xl' />
              <h3 className='text-3xl font-bold'>
                Oof, product not found... Please try again!
              </h3>
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
          <FilterSidebar />
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
          <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
            {resGetAllProducts?.data?.map((product, n) => (
              <ProductCard key={n} product={product} />
            ))}
          </div>
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
