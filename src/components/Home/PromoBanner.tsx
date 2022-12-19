import { Button, Carousel } from 'react-daisyui';

const PromoBanner = () => {
  const handleButtonClick = (value: string) => {
    const element = document.getElementById(value);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const buttonStyle = (value: string) => (
    <Button className='hidden btn btn-circle btn-sm text-base-content bg-base-300 hover:bg-base-200 md:inline md:btn-md'>
      {value}
    </Button>
  );

  return (
    <div className='grid grid-cols-12 gap-4'>
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
      <div className='col-span-12 md:col-span-8 flex flex-col items-center justify-between h-full'>
        <Carousel
          className='rounded-box'
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
    </div>
  );
};

export default PromoBanner;
