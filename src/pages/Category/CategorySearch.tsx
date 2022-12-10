import { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { TbError404 } from 'react-icons/tb';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Pager, ProductCard, SortBar } from '../../components/common';
import { FilterSidebar } from '../../components/CategorySearch';
import { LIMIT_SEARCH_PRODUCTS_LIST } from '../../constants';
import {
  useGetAllCategoryQuery,
  useGetAncestorsCategoryQuery,
} from '../../store/services/categoryService';
import { useGetAllProductsQuery } from '../../store/services/productService';
import { CategoryQuery, ProductQuery } from '../../types/query';
import {
  ProductsSortString,
  ProductsSortBy,
  ProductsSortByString,
} from '../../types/sort';
import { toCategoryQuery, toProductQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';
import NoData from '../../components/common/NoData';

const CategorySearch = () => {
  const { categoryPath } = useParams();
  if (!categoryPath) {
    return null;
  }

  const categoryID = categoryPath.split('-i.').slice(-1)[0].split('-')[0];

  const { data: resGetAncestorsCategory } =
    useGetAncestorsCategoryQuery(categoryID);

  const [sort, setSort] = useState(ProductsSortBy.Default);
  const [productQuery, setProductQuery] = useState<ProductQuery>({
    search: '',
    sort: '',
    sortBy: '',
    limit: LIMIT_SEARCH_PRODUCTS_LIST,
    page: 1,
    merchantID: 0,
    categoryID: parseInt(categoryID, 10),
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

  const [categoryQuery, setCategoryQuery] = useState<CategoryQuery>({
    categoryID: resGetAncestorsCategory?.data?.at(0)?.id,
    levelDepth: 0,
  });

  const { data: resGetAllCategory } = useGetAllCategoryQuery(
    toCategoryQuery(categoryQuery),
    {
      skip: categoryQuery.categoryID === undefined,
    }
  );

  useEffect(() => {
    setProductQuery({
      ...productQuery,
      categoryID: parseInt(categoryID, 10),
    });
  }, [categoryID]);

  useEffect(() => {
    setCategoryQuery({
      ...categoryQuery,
      categoryID: resGetAncestorsCategory?.data?.at(0)?.id,
    });
  }, [resGetAncestorsCategory]);

  const sortBy = searchParams.get('sort-by') || '';

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

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string, categoryID: number) => {
    navigate(`/category/${toUrl(categoryName)}-i.${categoryID}`);
  };

  return (
    <div className='mx-auto container'>
      <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
        <div className='col-span-1'>
          {resGetAllCategory?.data ? (
            <FilterSidebar
              productQuery={productQuery}
              setProductQuery={setProductQuery}
              category={resGetAllCategory?.data}
            />
          ) : null}
        </div>
        <div id='product-list-search-page' className='col-span-4 flex flex-col'>
          <div className='product-list-header'>
            <h1 className='text-3xl font-bold'>
              {resGetAncestorsCategory?.data?.at(-1)?.name}
            </h1>
            <div className='flex items-center gap-1 md:gap-2 mt-2 text-lg p-5 border-2 rounded-md bg-white shadow-md'>
              <span
                className='text-sm text-primary cursor-pointer hidden md:flex'
                onClick={() => {
                  navigate('/');
                }}
              >
                Home
              </span>
              <span className='text-sm hidden md:flex'>&gt;</span>
              <span
                className='text-sm text-primary cursor-pointer truncate'
                onClick={() => {
                  navigate('/category');
                }}
              >
                Main Category
              </span>
              {resGetAncestorsCategory?.data &&
                resGetAncestorsCategory?.data.map((category, i) => {
                  return (
                    <div key={i} className='flex items-center gap-1 md:gap-2'>
                      <span className='text-sm'>&gt;</span>
                      {resGetAncestorsCategory?.data?.at(-1)?.id ===
                      category.id ? (
                        <span className='text-sm truncate'>
                          {category.name}
                        </span>
                      ) : (
                        <span
                          className='text-sm text-primary cursor-pointer'
                          onClick={() =>
                            handleCategoryClick(category.name, category.id)
                          }
                        >
                          {category.name}
                        </span>
                      )}
                    </div>
                  );
                })}
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
          {resGetAllProducts?.data?.length || 0 > 0 ? (
            <div className='mt-4 grid grid-cols-2 md:grid-cols-5 gap-4'>
              {resGetAllProducts?.data?.map((product, n) => (
                <ProductCard key={n} product={product} />
              ))}
            </div>
          ) : (
            <NoData title='Oops, product not found... Please try again!'></NoData>
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

export default CategorySearch;
