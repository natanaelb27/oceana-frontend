import { useEffect } from 'react';
import { Carousel, Divider } from 'react-daisyui';
import { TfiLayoutPlaceholder } from 'react-icons/tfi';
import { Slider } from '../../components/common';
import { HomeCard, PromoBanner } from '../../components/Home';
import { useLazyGetAllCategoryQuery } from '../../store/services/categoryService';

const Home = () => {
  const [getAllCategory] = useLazyGetAllCategoryQuery();

  useEffect(() => {
    getAllCategory()
      .unwrap()
      .then((res) => console.log(res));
  }, []);

  return (
    <div className='container mx-auto flex flex-col items-center'>
      <div className='my-5'>
        <PromoBanner />
      </div>
      <div className='my-5'>
        <HomeCard title='Category'>
          <Slider id='category'>
            {Array(20)
              .fill(0)
              .map((_, n) => (
                <Carousel.Item key={n}>
                  <div className='flex flex-col items-center'>
                    <TfiLayoutPlaceholder className='text-3xl md:text-8xl' />
                    <h3 className='md:text-xl'>Category</h3>
                  </div>
                </Carousel.Item>
              ))}
          </Slider>
        </HomeCard>
      </div>
      <Divider className='w-[360px] self-center lg:w-[1080px]' />
      <div className='my-5'>
        <HomeCard title='Recommended Products'>
          <Slider id='recommended'>
            {Array(20)
              .fill(0)
              .map((_, n) => (
                <Carousel.Item key={n}>
                  <div className='flex flex-col items-center'>
                    <TfiLayoutPlaceholder className='text-3xl md:text-8xl' />
                    <h3 className='md:text-xl'>Product</h3>
                  </div>
                </Carousel.Item>
              ))}
          </Slider>
        </HomeCard>
      </div>
    </div>
  );
};

export default Home;
