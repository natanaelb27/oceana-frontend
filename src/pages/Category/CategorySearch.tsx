import { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { TbError404 } from 'react-icons/tb';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Pager, ProductCard, SortBar } from '../../components/common';
import { FilterSidebar } from '../../components/CategorySearch';
import { LIMIT_SEARCH_PRODUCTS_LIST } from '../../constants';
import { useGetAncestorsCategoryQuery } from '../../store/services/categoryService';
import { useGetAllProductsQuery } from '../../store/services/productService';
import { ProductQuery } from '../../types/query';
import {
  ProductsSortString,
  ProductsSortBy,
  ProductsSortByString,
} from '../../types/sort';
import { toProductQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';

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
    merchantCities: [],
    courierServices: [],
  });
  const [searchParams] = useSearchParams();

  const { data: resGetAllProducts } = useGetAllProductsQuery(
    toProductQuery(productQuery)
  );

  // const [categoryQuery, setCategoryQuery] = useState<CategoryQuery>({
  //   categoryID: resGetAncestorsCategory?.data?.at(0)?.id || 0,
  //   levelDepth: 0,
  // });

  // console.log(resGetAncestorsCategory?.data?.at(0)?.name);

  // const { data: resGetAllCategory } = useGetAllCategoryQuery(
  //   toCategoryQuery(categoryQuery),
  //   {
  //     skip: categoryID === undefined,
  //   }
  // );

  useEffect(() => {
    setProductQuery({
      ...productQuery,
      categoryID: parseInt(categoryID, 10),
    });

    // setCategoryQuery({
    //   ...categoryQuery,
    //   categoryID: resGetAncestorsCategory?.data?.at(0)?.id || 0,
    // });
  }, [categoryID]);

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

  // render product not found
  if (resGetAllProducts?.data?.length === 0) {
    return (
      <div className='mx-auto container'>
        <div className='p-4 grid grid-cols-1 md:grid-cols-5 gap-4 md:py-10 md:gap-10'>
          <div className='col-span-1'>
            <FilterSidebar
              productQuery={productQuery}
              setProductQuery={setProductQuery}
            />
          </div>
          <div
            id='product-list-search-page'
            className='col-span-4 flex flex-col'
          >
            <div className='product-list-header'>
              <div className='ml-2 flex items-center gap-2 text-lg'>
                <AiOutlineInfoCircle />
                {resGetAncestorsCategory?.data &&
                  resGetAncestorsCategory?.data.map((category, i) => {
                    return (
                      <span
                        className='text-sm text-primary cursor-pointer'
                        key={i}
                      >
                        {category.name}
                      </span>
                    );
                  })}
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

  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string, categoryID: number) => {
    navigate(`/category/${toUrl(categoryName)}-i.${categoryID}`);
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
            <h1 className='text-3xl font-bold'>
              {resGetAncestorsCategory?.data?.at(-1)?.name}
            </h1>
            <div className='flex items-center gap-2 mt-2 text-lg p-5 border-2 rounded-md bg-white shadow-md'>
              <span
                className='text-sm text-primary cursor-pointer'
                onClick={() => {
                  navigate('/');
                }}
              >
                Home
              </span>
              <span className='text-sm'>&gt;</span>
              <span
                className='text-sm text-primary cursor-pointer'
                onClick={() => {
                  navigate('/category');
                }}
              >
                Main Category
              </span>
              {resGetAncestorsCategory?.data &&
                resGetAncestorsCategory?.data.map((category, i) => {
                  return (
                    <div key={i} className='flex items-center gap-2'>
                      <span className='text-sm'>&gt;</span>
                      {resGetAncestorsCategory?.data?.at(-1)?.id ===
                      category.id ? (
                        <span className='text-sm'>{category.name}</span>
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
                      {/* <span
                        className={`text-sm ${
                          resGetAncestorsCategory?.data?.at(-1)?.id ===
                          category.id
                            ? ''
                            : 'text-primary cursor-pointer'
                        }`}
                      >
                        {category.name}
                      </span> */}
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

export default CategorySearch;
