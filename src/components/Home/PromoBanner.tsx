import { useState } from 'react';
import { Button, Carousel } from 'react-daisyui';
import { useGetActiveMarketplaceVoucherQuery } from '../../store/services/marketplaceService';

const PromoBanner = () => {
  const {
    data: getActiveMarketplaceVoucherData,
    isLoading: getActiveMarketplaceVoucherIsLoading,
  } = useGetActiveMarketplaceVoucherQuery();

  const handleButtonClick = (value: string) => {
    const element = document.getElementById(value);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const buttonStyle = (value: string) => (
    <Button shape='circle' className='hidden md:block glass text-base-100'>
      {value}
    </Button>
  );

  const [carouselSlide, setCarouselSlide] = useState<string>('slide-1');

  return (
    <>
      <div className='hidden md:grid grid-cols-12 gap-4'>
        <div className='col-span-12 hidden md:col-span-4 h-full md:flex flex-col justify-center'>
          <h5 className='text-center md:text-left font-medium text-xl md:text-4xl mb-4 md:mb-8'>
            Don&apos;t miss out these{' '}
            <span className='text-primary'>promotions</span>!
          </h5>
          <div className='flex flex-col md:flex-row gap-2'>
            <Button
              className='md:max-w-fit normal-case font-medium'
              color='primary'
              onClick={() => handleButtonClick('recommended')}
            >
              Recommendation
            </Button>
            <Button
              className='md:max-w-fit normal-case font-medium'
              color='primary'
              variant='outline'
              onClick={() => handleButtonClick('products')}
            >
              All Products
            </Button>
          </div>
        </div>
        {getActiveMarketplaceVoucherIsLoading && (
          <div className='col-span-12 md:col-span-8 md:flex md:flex-col md:items-center md:justify-between md:h-full'>
            tes
          </div>
        )}
        {!getActiveMarketplaceVoucherIsLoading &&
          getActiveMarketplaceVoucherData && (
            <div className='col-span-12 md:col-span-8 md:flex md:flex-col md:items-center md:justify-between md:h-full'>
              {(getActiveMarketplaceVoucherData?.data?.length || 0) > 0 ? (
                <div className='carousel w-full md:rounded-box'>
                  {getActiveMarketplaceVoucherData?.data?.map(
                    ({ banner_url }, i) => {
                      return (
                        <div
                          key={i}
                          className={`carousel-item relative w-full ${
                            'slide-' + i === carouselSlide ? 'block' : 'hidden'
                          }`}
                        >
                          <img src={banner_url} className='w-full' />
                          <div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2'>
                            <a
                              className='btn btn-circle'
                              onClick={() => {
                                setCarouselSlide(
                                  `slide-${
                                    i === 0
                                      ? (getActiveMarketplaceVoucherData?.data
                                          ?.length || 1) - 1
                                      : i - 1
                                  }`
                                );
                              }}
                            >
                              ❮
                            </a>
                            <a
                              className='btn btn-circle'
                              onClick={() => {
                                setCarouselSlide(
                                  `slide-${
                                    i ===
                                    (getActiveMarketplaceVoucherData?.data
                                      ?.length || 1) -
                                      1
                                      ? 0
                                      : i + 1
                                  }`
                                );
                              }}
                            >
                              ❯
                            </a>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <Carousel
                  className='md:rounded-box'
                  display='sequential'
                  buttonStyle={buttonStyle}
                >
                  <Carousel.Item
                    className='w-full'
                    src='https://images.tokopedia.net/img/cache/1208/NsjrJu/2022/11/20/08a2581b-2ccb-4908-a1cb-3b227835c53f.jpg.webp?ect=4g'
                    alt='Promo'
                  />
                  <Carousel.Item
                    className='w-full'
                    src='https://images.tokopedia.net/img/cache/1208/NsjrJu/2022/11/17/728337d2-8692-4e3a-8ad9-8121e110eed0.jpg.webp?ect=4g'
                    alt='Promo'
                  />
                </Carousel>
              )}
            </div>
          )}
      </div>
      <div className='md:hidden mb-20'>
        <div className='absolute left-0 top-20'>
          {(getActiveMarketplaceVoucherData?.data?.length || 0) > 0 ? (
            <div className='carousel w-full md:rounded-box'>
              {getActiveMarketplaceVoucherData?.data?.map(
                ({ banner_url }, i) => {
                  return (
                    <div key={i} className='carousel-item relative w-full'>
                      <img src={banner_url} className='w-full' />
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <Carousel
              className='md:rounded-box'
              display='sequential'
              buttonStyle={buttonStyle}
            >
              <Carousel.Item
                className='w-full'
                src='https://images.tokopedia.net/img/cache/1208/NsjrJu/2022/11/20/08a2581b-2ccb-4908-a1cb-3b227835c53f.jpg.webp?ect=4g'
                alt='Promo'
              />
              <Carousel.Item
                className='w-full'
                src='https://images.tokopedia.net/img/cache/1208/NsjrJu/2022/11/17/728337d2-8692-4e3a-8ad9-8121e110eed0.jpg.webp?ect=4g'
                alt='Promo'
              />
            </Carousel>
          )}
        </div>
      </div>
    </>
  );
};

export default PromoBanner;
