import { Button, Carousel } from 'react-daisyui';

export const PromoBanner = () => {
  const buttonStyle = (value: string) => (
    <Button className='hidden btn btn-circle btn-sm text-base-content bg-base-300 hover:bg-base-200 md:inline md:btn-md'>
      {value}
    </Button>
  );

  return (
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
  );
};
