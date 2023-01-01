import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, Divider } from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import { ProductCard, Slider } from '../../components/common';
import { CategoryCard, HomeCard, PromoBanner } from '../../components/Home';
import {
  LIMIT_HOME_ALL_PRODUCTS,
  LIMIT_HOME_RECOMMENDED_PRODUCTS,
  PRODUCT_STATUS,
} from '../../constants';
import { useLocalStorage } from '../../hooks';
import { useLazyGetAllCategoryQuery } from '../../store/services/categoryService';
import { useLazyGetAllProductsQuery } from '../../store/services/productService';
import { Category, Product } from '../../types/component';
import { CategoryQuery, ProductQuery } from '../../types/query';
import { ProductsSortByString } from '../../types/sort';
import { toCategoryQuery, toProductQuery } from '../../utils/mapperDTO';
import { toUrl } from '../../utils/toUrl';

type CategoryStorageProps = {
  value: Category[];
  timestamp: Date | null;
};

type RecommendedStorageProps = {
  value: Product[];
  timestamp: Date | null;
};

type ProductStorageProps = {
  value: Product[];
  timestamp: Date | null;
};

console.log('aaaa');

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
    status: PRODUCT_STATUS.ACTIVE,
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
    status: PRODUCT_STATUS.ACTIVE,
  };
  const categoryQuery: CategoryQuery = {
    categoryID: 0,
    levelDepth: 1,
  };

  const [homeCategoryStorage, setHomeCategoryStorage] =
    useLocalStorage<CategoryStorageProps>('home_category', {
      value: [],
      timestamp: null,
    });
  const [recommendedStorage, setRecommendedStorage] =
    useLocalStorage<RecommendedStorageProps>('home_recommended', {
      value: [],
      timestamp: null,
    });
  const [productsStorage, setProductStorage] =
    useLocalStorage<ProductStorageProps>('home_products', {
      value: [],
      timestamp: null,
    });

  const [categories, setCategories] = useState<Category[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [getAllCategory] = useLazyGetAllCategoryQuery();
  const [getRecommendedProductsQuery] = useLazyGetAllProductsQuery();
  const [getAllProducts] = useLazyGetAllProductsQuery();

  useEffect(() => {
    try {
      if (homeCategoryStorage.value.length === 0) {
        throw new Error('empty storage value');
      }

      setCategories(homeCategoryStorage.value);
    } catch (e) {
      getAllCategory(toCategoryQuery(categoryQuery))
        .unwrap()
        .then((res) => {
          setCategories(res.data ? res.data : []);
          setHomeCategoryStorage({
            value: res.data ? res.data : [],
            timestamp: moment().add(1, 'day').toDate(),
          });
        });
    }

    try {
      if (recommendedStorage.value.length === 0) {
        throw new Error('empty storage value');
      }

      setRecommended(recommendedStorage.value);
    } catch (e) {
      getRecommendedProductsQuery(toProductQuery(recommendedProductQuery))
        .unwrap()
        .then((res) => {
          setRecommended(res.data ? res.data : []);
          setRecommendedStorage({
            value: res.data ? res.data : [],
            timestamp: moment().add(1, 'h').toDate(),
          });
        });
    }

    try {
      if (productsStorage.value.length === 0) {
        throw new Error('empty storage value');
      }

      setProducts(productsStorage.value);
    } catch (e) {
      getAllProducts(toProductQuery(allProductQuery))
        .unwrap()
        .then((res) => {
          setProducts(res.data ? res.data : []);
          setProductStorage({
            value: res.data ? res.data : [],
            timestamp: moment().add(1, 'h').toDate(),
          });
        });
    }
  }, []);

  const handleSeeMoreClick = () => {
    navigate('/search');
  };

  return (
    <div className='container mx-auto'>
      <p>{JSON.stringify(categories)}</p>
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
            <Slider id='category'>
              {categories.map((category, n) => (
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
            <Slider id='recommended'>
              {recommended.length > 0
                ? recommended.map((product, n) => (
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
          {products.length > 0
            ? products.map((row) => (
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
