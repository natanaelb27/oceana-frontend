import { Button, Carousel } from 'react-daisyui';

const Home = () => {
  const buttonStyle = (value: string) => (
    <Button className='btn btn-circle btn-sm text-neutral bg-base-300 md:btn-md'>
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
    </div>
  );
};

export default Home;
