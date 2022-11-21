import { Button, Carousel, Divider } from 'react-daisyui';
import { TfiLayoutPlaceholder } from 'react-icons/tfi';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { SCROLL_SLIDER } from '../../constants';
import { HomeCardContainer, HomeCardTitle, HomeStyledCarousel } from './style';

const Home = () => {
  const handleClickPrev = () => {
    document.getElementById('slider')!.scrollLeft -= SCROLL_SLIDER;
  };
  const handleClickNext = () => {
    document.getElementById('slider')!.scrollLeft += SCROLL_SLIDER;
  };
  const buttonStyle = (value: string) => (
    <Button className='hidden btn btn-circle btn-sm text-neutral bg-base-300 md:inline md:btn-md'>
      {value}
    </Button>
  );

  return (
    <div className='container mx-auto flex flex-col items-center'>
      <div className='my-5'>
        <Carousel
          className='max-w-[1080px] rounded-box'
          display='sequential'
          buttonStyle={buttonStyle}
        >
          <Carousel.Item
            src='https://images.tokopedia.net/img/cache/1208/NsjrJu/2022/11/20/08a2581b-2ccb-4908-a1cb-3b227835c53f.jpg.webp?ect=4g'
            alt='Promo'
          />
          <Carousel.Item
            src='https://images.tokopedia.net/img/cache/1208/NsjrJu/2022/11/17/728337d2-8692-4e3a-8ad9-8121e110eed0.jpg.webp?ect=4g'
            alt='Promo'
          />
        </Carousel>
      </div>
      <HomeCardContainer>
        <HomeCardTitle>Category</HomeCardTitle>
        <HomeStyledCarousel id='slider' display='slider'>
          {Array(20)
            .fill(0)
            .map((_, n) => (
              <Carousel.Item key={n}>
                <div className='flex flex-col items-center'>
                  <TfiLayoutPlaceholder className='text-3xl md:text-8xl' />
                  <h3 className='md:text-xl'>Kategori</h3>
                </div>
              </Carousel.Item>
            ))}
        </HomeStyledCarousel>
        <div className='hidden md:inline'>
          <button
            className='absolute left-0 top-1/3 btn btn-xs btn-circle bg-base-300 text-black drop-shadow-lg border-none md:top-[40%] md:btn-md'
            onClick={handleClickPrev}
          >
            <GrPrevious className='text-xs md:text-lg' />
          </button>
          <button
            className='absolute right-0 top-1/3 btn btn-xs btn-circle bg-base-300 text-black drop-shadow-lg border-none md:top-[40%] md:btn-md'
            onClick={handleClickNext}
          >
            <GrNext className='text-xs md:text-lg' />
          </button>
        </div>
      </HomeCardContainer>
      <Divider className='w-[360px] self-center lg:w-[1080px]' />
      <HomeCardContainer>
        <HomeCardTitle>Recommended Products</HomeCardTitle>
        <HomeStyledCarousel display='slider'>
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
        </HomeStyledCarousel>
      </HomeCardContainer>
    </div>
  );
};

export default Home;
