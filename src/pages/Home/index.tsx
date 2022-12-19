import { Button, Divider } from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import { ProductCard, Slider } from '../../components/common';
import { CategoryCard, HomeCard, PromoBanner } from '../../components/Home';
import {
  LIMIT_HOME_ALL_PRODUCTS,
  LIMIT_HOME_RECOMMENDED_PRODUCTS,
} from '../../constants';
import { useGetAllCategoryQuery } from '../../store/services/categoryService';
import { useGetAllProductsQuery } from '../../store/services/productService';
import { CategoryQuery, ProductQuery } from '../../types/query';
import { ProductsSortByString } from '../../types/sort';
import { toCategoryQuery, toProductQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';

const Home = () => {
  const navigate = useNavigate();
  const recommendedProductQuery: ProductQuery = {
    search: '',
    sort: '',
    sortBy: ProductsSortByString.Recommended,
    limit: LIMIT_HOME_RECOMMENDED_PRODUCTS,
    page: 1,
    merchantID: 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    rating: 0,
    merchantCities: [],
    courierServices: [],
  };
  const allProductQuery: ProductQuery = {
    search: '',
    sort: '',
    sortBy: ProductsSortByString.Default,
    limit: LIMIT_HOME_ALL_PRODUCTS,
    page: 1,
    merchantID: 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    rating: 0,
    merchantCities: [],
    courierServices: [],
  };
  const categoryQuery: CategoryQuery = {
    categoryID: 0,
    levelDepth: 1,
  };

  const { data: resGetAllCategory } = useGetAllCategoryQuery(
    toCategoryQuery(categoryQuery)
  );
  const { data: resGetRecommendedProducts } = useGetAllProductsQuery(
    toProductQuery(recommendedProductQuery)
  );
  const { data: resGetAllProducts } = useGetAllProductsQuery(
    toProductQuery(allProductQuery)
  );

  const handleSeeMoreClick = () => {
    navigate('/search');
  };

  return (
    <div className='container mx-auto'>
      <div className='px-4 py-10'>
        <div className='mb-8'>
          <PromoBanner />
        </div>
        <div className='mb-8'>
          <HomeCard
            id='category'
            title='Category'
            subtitle='There are various products with special prices waiting for you!'
            navigateSeeAll='/category'
          >
            <Slider>
              {resGetAllCategory?.data &&
                resGetAllCategory.data.map((category, n) => (
                  <div className='carousel-item' key={n}>
                    <CategoryCard
                      category={category}
                      to={`/category/${toUrl(category.name)}-i.${category.id}`}
                    />
                  </div>
                ))}
            </Slider>
          </HomeCard>
        </div>
        <div>
          <HomeCard
            id='recommended'
            title='Recommended Products'
            subtitle='These are the most seen products!'
            navigateSeeAll='/search?sort-by=recommended'
          >
            <Slider>
              {resGetRecommendedProducts?.data
                ? resGetRecommendedProducts.data.map((product, n) => (
                    <div key={n} className='carousel-item max-w-xs w-full'>
                      <ProductCard product={product} />
                    </div>
                  ))
                : Array(30)
                    .fill(0)
                    .map((_, n) => (
                      <div key={n} className='carousel-item max-w-xs w-full'>
                        <ProductCard product={undefined} />
                      </div>
                    ))}
            </Slider>
          </HomeCard>
        </div>
        <Divider className='py-8' />
        <div
          id='products'
          className='grid grid-cols-12 w-full gap-4 justify-center mb-8'
        >
          {resGetAllProducts?.data
            ? resGetAllProducts.data.map((row) => (
                <div key={row.id} className='col-span-6 md:col-span-2 '>
                  <ProductCard product={row} />
                </div>
              ))
            : Array.from(
                { length: LIMIT_HOME_ALL_PRODUCTS },
                (_, i) => i + 1
              ).map((id) => (
                <div key={id} className='col-span-12 md:col-span-2'>
                  <ProductCard />
                </div>
              ))}
        </div>
        <div className='flex'>
          <Button
            variant='outline'
            color='secondary'
            className='normal-case font-medium w-full max-w-xs mx-auto'
            onClick={handleSeeMoreClick}
          >
            See More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
