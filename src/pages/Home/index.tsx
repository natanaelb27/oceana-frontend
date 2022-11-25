import { useState } from 'react';
import { Carousel, Divider } from 'react-daisyui';
import { TfiLayoutPlaceholder } from 'react-icons/tfi';
import { ProductCard, Slider } from '../../components/common';
import { HomeCard, PromoBanner } from '../../components/Home';
import { LIMIT_HOME_RECOMMENDED_PRODUCTS } from '../../constants';
import { useGetAllCategoryQuery } from '../../store/services/categoryService';
import { useGetAllProductsQuery } from '../../store/services/productService';
import { ProductQuery } from '../../types/query';
import { toProductQuery } from '../../utils/mapperDTO';

const Home = () => {
  const [productQuery] = useState<ProductQuery>({
    search: '',
    sort: '',
    sortBy: 'recommended',
    limit: LIMIT_HOME_RECOMMENDED_PRODUCTS,
    page: 1,
    merchantID: 0,
    categoryID: 0,
    priceMinimum: 0,
    priceMaximum: 0,
    merchantCities: [],
    courierServices: [],
  });
  const { data: resGetAllCategory } = useGetAllCategoryQuery();
  const { data: resGetRecommendedProducts } = useGetAllProductsQuery(
    toProductQuery(productQuery)
  );

  return (
    <div className='px-2 container mx-auto flex flex-col items-center'>
      <div className='my-5'>
        <PromoBanner />
      </div>
      <div className='my-5'>
        <HomeCard title='Category' navigateSeeAll='/'>
          <Slider id='category'>
            {resGetAllCategory?.data &&
              resGetAllCategory.data.map((category, n) => (
                <Carousel.Item key={n}>
                  <div className='max-w-[64px] flex flex-col items-center text-center gap-2 md:gap-4'>
                    <TfiLayoutPlaceholder className='text-3xl md:text-8xl' />
                    <h3 className='break-words leading-none md:text-xl'>
                      {category.name}
                    </h3>
                  </div>
                </Carousel.Item>
              ))}
          </Slider>
        </HomeCard>
      </div>
      <Divider className='w-[360px] self-center md:w-[1080px]' />
      <div className='my-5'>
        <HomeCard
          title='Recommended Products'
          navigateSeeAll='/search?sort-by=recommended'
        >
          <Slider id='recommended' gap={20} gapMobile={10}>
            {/* {Array(10)
              .fill(0)
              .map((_, n) => (
                <Carousel.Item
                  key={n}
                  className='max-w-[180px] md:max-w-[240px] w-full'
                >
                  <ProductCard />
                </Carousel.Item>
              ))} */}
            {resGetRecommendedProducts?.data &&
              resGetRecommendedProducts.data.map((product, n) => (
                <Carousel.Item
                  key={n}
                  className='max-w-[180px] md:max-w-[240px] w-full'
                >
                  <ProductCard product={product} />
                </Carousel.Item>
              ))}
          </Slider>
        </HomeCard>
      </div>
    </div>
  );
};

export default Home;
