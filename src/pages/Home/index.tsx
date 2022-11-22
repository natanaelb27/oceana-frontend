import { Carousel, Divider } from 'react-daisyui';
import { TfiLayoutPlaceholder } from 'react-icons/tfi';
import { Slider } from '../../components/common';
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
                  <div className='flex flex-col items-center gap-4'>
                    <TfiLayoutPlaceholder className='text-3xl md:text-8xl' />
                    <h3 className='md:text-xl'>{category.name}</h3>
                  </div>
                </Carousel.Item>
              ))}
          </Slider>
        </HomeCard>
      </div>
      <Divider className='w-[360px] self-center lg:w-[1080px]' />
      <div className='my-5'>
        <HomeCard title='Recommended Products'>
          <Slider id='recommended'>{null}</Slider>
        </HomeCard>
      </div>
    </div>
  );
};

export default Home;
