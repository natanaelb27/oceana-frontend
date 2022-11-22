import { Carousel, Divider } from 'react-daisyui';
import { TfiLayoutPlaceholder } from 'react-icons/tfi';
import { ProductCard, Slider } from '../../components/common';
import { HomeCard, PromoBanner } from '../../components/Home';
import { useGetAllCategoryQuery } from '../../store/services/categoryService';

const Home = () => {
  const { data: resGetAllCategory } = useGetAllCategoryQuery();

  return (
    <div className='container mx-auto flex flex-col items-center'>
      <div className='my-5'>
        <PromoBanner />
      </div>
      <div className='my-5'>
        <HomeCard title='Category'>
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
        <HomeCard title='Recommended Products'>
          <Slider id='recommended' gap={20} gapMobile={10}>
            {Array(10)
              .fill(0)
              .map((_, n) => (
                <Carousel.Item
                  key={n}
                  className='max-w-[180px] md:max-w-[240px]'
                >
                  <ProductCard />
                </Carousel.Item>
              ))}
          </Slider>
        </HomeCard>
      </div>
    </div>
  );
};

export default Home;
