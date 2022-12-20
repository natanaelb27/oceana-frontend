import { useEffect, useRef, useState } from 'react';
import { useGetAllMerchantProductsQuery } from '../../store/services/merchantService';
import { Pager } from '../../components/common';
import { useSearchParams } from 'react-router-dom';
import { MerchantProductQuery } from '../../types/query';
import { toMerchantProductQuery } from '../../utils/mapperDTO';
import { ProductCard } from '../common';
import {
  ProductsSortBy,
  ProductsSortByString,
  ProductsSortString,
} from '../../types/sort';
import { useGetCategoriesByMerchantIDQuery } from '../../store/services/categoryService';
import CategoryCollapse from '../common/CategoryCollapse';

type CategoryFilter = {
  id: number;
  name: string;
};

type ShopProductsCardProps = {
  merchantID: string | null | undefined;
};

const ShopProducts = ({ merchantID }: ShopProductsCardProps) => {
  const [sort, setSort] = useState('desc');
  const [sortBy] = useState('most-buy');
  const [limit] = useState(6);

  const [mostPurchasedTab, setMostPurchasedTab] = useState(true);
  const [allProductsTab, setAllProductsTab] = useState(false);
  const [reviewTab, setReviewTab] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>({
    id: 0,
    name: '',
  });

  const ref = useRef<null | HTMLDivElement>(null);

  const [merchantProductQuery, setMerchantProductQuery] =
    useState<MerchantProductQuery>({
      search: '',
      sort: sort,
      sortBy: sortBy,
      limit: limit,
      page: 1,
      categoryID: 0,
      priceMinimum: 0,
      priceMaximum: 0,
      merchantCities: [],
      courierServices: [],
    });

  const [searchParams] = useSearchParams();

  const { data: getAllMerchantProducts } = useGetAllMerchantProductsQuery({
    id: String(merchantID),
    query: toMerchantProductQuery(merchantProductQuery),
  });

  const { data: getCategoriesByMerchantID } = useGetCategoriesByMerchantIDQuery(
    String(merchantID)
  );

  const sortByParam = searchParams.get('sort-by') || '';
  const sortParam = searchParams.get('sort') || '';
  const limitParam = searchParams.get('limit') || '';

  useEffect(() => {
    setMerchantProductQuery({
      ...merchantProductQuery,
      sortBy,
      sort,
      limit,
    });
  }, [sortByParam, sortParam, limitParam]);

  const handleSortChange = (value: string) => {
    let sortBy = '';
    let sort = '';

    if (value === ProductsSortByString.BestSeller) {
      sortBy = ProductsSortByString.BestSeller;
      sort = ProductsSortByString.Default;
    } else if (value === ProductsSortByString.Newest) {
      sortBy = ProductsSortByString.Newest;
      sort = ProductsSortByString.Default;
    } else if (value === 'most-expensive') {
      sortBy = ProductsSortByString.Price;
      sort = ProductsSortString.HighestPrice;
    } else if (value === 'cheapest') {
      sortBy = ProductsSortByString.Price;
      sort = ProductsSortString.LowestPrice;
    }

    setSort(sort);
    setMerchantProductQuery({
      ...merchantProductQuery,
      sortBy,
      sort,
    });
  };

  const handleChangeTab = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    identifier: string
  ) => {
    event.preventDefault();

    let limit = 0;
    let sortBy = '';
    let sort = '';
    let categoryID = 0;

    if (identifier === 'mostPurchased') {
      setMostPurchasedTab(true);
      setAllProductsTab(false);
      setReviewTab(false);

      limit = 6;
      sortBy = ProductsSortByString.BestSeller;
      sort = ProductsSortByString.Default;
      categoryID = 0;
    } else if (identifier === 'allProducts') {
      setMostPurchasedTab(false);
      setAllProductsTab(true);
      setReviewTab(false);

      limit = 20;
      sortBy = ProductsSortByString.BestSeller;
      sort = ProductsSortByString.Default;
      categoryID = 0;
    } else if (identifier === 'review') {
      setMostPurchasedTab(false);
      setAllProductsTab(false);
      setReviewTab(true);
    }

    setSort(sort);
    setMerchantProductQuery({
      ...merchantProductQuery,
      limit,
      sortBy,
      sort,
      categoryID,
    });
  };

  const handleSeeMoreMostPurchased = () => {
    let limit = 0;

    limit = 0;

    setMerchantProductQuery({
      ...merchantProductQuery,
      limit,
    });
  };

  const handlePageChange = (n: number) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });

    setMerchantProductQuery({
      ...merchantProductQuery,
      page: n,
    });
  };

  const handleCategoryClick = (id: number, name: string) => {
    setMerchantProductQuery({
      ...merchantProductQuery,
      categoryID: id,
    });

    setCategoryFilter({
      id: id,
      name: name,
    });
  };

  return (
    <div ref={ref} className='flex w-3/5 flex-col'>
      <div className='mb-3'>
        <div className='flex flex-row justify-start'>
          <button
            className={
              !mostPurchasedTab
                ? 'p-5 mr-3'
                : 'p-5 mr-3 font-bold border-2 border-b-primary text-primary'
            }
            onClick={(event) => {
              handleChangeTab(event, 'mostPurchased');
            }}
          >
            Most Purchased
          </button>
          <button
            className={
              !allProductsTab
                ? 'p-5 mr-3'
                : 'p-5 mr-3 font-bold border-2 border-b-primary text-primary'
            }
            onClick={(event) => {
              handleChangeTab(event, 'allProducts');
            }}
          >
            All Products
          </button>
          <button
            className={
              !reviewTab
                ? 'p-5 mr-3'
                : 'p-5 mr-3 font-bold border-2 border-b-primary text-primary'
            }
            onClick={(event) => {
              handleChangeTab(event, 'review');
            }}
          >
            Reviews
          </button>
        </div>
        <hr className='border border-solid border-gray-300' />
      </div>
      <div className='mb-5'>
        {mostPurchasedTab && (
          <>
            <div className='flex flex-row flex-wrap justify-start'>
              {getAllMerchantProducts?.data?.map((product, i) => {
                return (
                  <div className='mr-3 mb-3 w-64' key={i}>
                    <ProductCard product={product} key={product.id} />
                  </div>
                );
              })}
              {getAllMerchantProducts?.data?.length === 6 && (
                <div className='flex items-center'>
                  <button
                    className='ml-3 bg-secondary px-10 py-5 text-white rounded-lg'
                    onClick={handleSeeMoreMostPurchased}
                  >
                    More Products {'>'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        {allProductsTab && (
          <div>
            <div className='flex flex-row justify-end'>
              <div className='flex flex-row flex-start items-center mb-5'>
                <h1 className='text-lg font-bold mr-3'>Sort By:</h1>
                <select
                  className='select select-bordered'
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value='most-buy'>Most Purchased</option>
                  <option value='newest'>Most Recent</option>
                  <option value='most-expensive'>Most Expensive</option>
                  <option value='cheapest'>Cheapest</option>
                </select>
              </div>
            </div>
            <div className='flex flex-row justify-start'>
              <div className='w-56 mr-14'>
                <CategoryCollapse
                  category={
                    getCategoriesByMerchantID?.data
                      ? getCategoriesByMerchantID.data
                      : undefined
                  }
                  marginLeft={5}
                  handleCategoryClick={handleCategoryClick}
                />
              </div>
              <div className='flex flex-row flex-wrap justify-start flex-grow-0'>
                {getAllMerchantProducts?.data?.map((product, i) => {
                  return (
                    <div className='mr-3 mb-3 w-64' key={i}>
                      <ProductCard product={product} key={product.id} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='mt-6 flex justify-center'>
              <Pager
                page={merchantProductQuery.page}
                totalPage={
                  getAllMerchantProducts?.metadata?.total_pages
                    ? getAllMerchantProducts.metadata.total_pages
                    : 0
                }
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProducts;
