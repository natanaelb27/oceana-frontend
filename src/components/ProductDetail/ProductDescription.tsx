import { useState } from 'react';
import { Badge, Button, Divider, Tabs, Tooltip } from 'react-daisyui';
import { HiStar } from 'react-icons/hi';
import { NavLink } from 'react-router-dom';

import { ProductTab } from '../../types/tab';
import { toCompact, toRupiah } from '../../utils/convert';
import ShopBanner from './ShopBanner';

type ProductDescriptionProps = {
  isLoading?: boolean;
};

const ProductDescription = ({ isLoading }: ProductDescriptionProps) => {
  const [tab, setTab] = useState<ProductTab>(ProductTab.Specification);

  const renderTabContent = (tab: ProductTab) => {
    if (tab === ProductTab.Specification) {
      return (
        <div className='bg-base-200 p-4 text-sm'>
          <p className='mb-2'>Conditon: Brand New</p>
          <p className='mb-2'>Unit Weight: 100g</p>
          <p>
            Category:{' '}
            <NavLink to='/category' className='font-bold text-primary'>
              Soft Case Handphone
            </NavLink>
          </p>
        </div>
      );
    }

    if (tab === ProductTab.Description) {
      return (
        <div className='bg-base-200 p-4 text-sm'>
          <p className='prose-sm'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquid,
            nobis deserunt? Possimus, sed ad. Libero dignissimos, accusantium
            nam veniam autem voluptatem rem fugiat delectus asperiores hic eum
            dolores reprehenderit porro minima assumenda sunt facilis! Vero,
            deserunt? Aliquam magni possimus saepe tenetur porro harum,
            accusamus non debitis temporibus vitae reiciendis ab odit provident?
            Inventore, possimus? Necessitatibus et quas ullam alias labore velit
            natus facilis quibusdam fugit placeat nemo aliquid porro corporis,
            repellendus voluptatibus, quo dolor similique nobis voluptatum ipsa
            accusamus ratione ipsum vero soluta. Vitae enim earum magnam aperiam
            similique at! Quisquam perferendis impedit magni accusantium
            expedita voluptas nam laborum dolor.
          </p>
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className='animate-pulse'>
        <div className='h-6 bg-base-200 rounded-full w-4/5 mb-2.5'></div>
        <div className='h-4 bg-base-200 rounded-full w-3/5 mb-2.5'></div>
        <div className='h-8 bg-base-200 rounded-full w-2/5 mb-2.5'></div>
        <div className='h-4 bg-base-200 rounded-full w-2/5 mb-2.5'></div>
        <Divider />
        <div className='h-4 bg-base-200 rounded-full w-1/5 mb-2.5'></div>
        <div className='h-4 bg-base-200 rounded-full mb-2.5'></div>
        <div className='h-4 bg-base-200 rounded-full mb-2.5'></div>
        <Divider />
        <div className='h-4 bg-base-200 rounded-full w-2/5 mb-2.5'></div>
        <div className='h-64 bg-base-200'></div>
        <Divider />
        <ShopBanner isLoading />
      </div>
    );
  }

  return (
    <div>
      <h5 className='text-lg font-medium md:line-clamp-2'>
        [ TAM ] ASUS ROG PHONE 5S 8/128GB GARANSI ASUS INDONESIA - NOT 5 - BNIB,
        BLACK
      </h5>
      <div className='flex flex-row items-center mb-2.5'>
        {toCompact(50000)} sold |{' '}
        <Tooltip message='Rating' color='warning'>
          <HiStar className='text-warning text-lg' />
        </Tooltip>{' '}
        5 (40 rating)
      </div>
      <h4 className='text-4xl font-bold mb-2.5'>
        {toRupiah(7999000)}-{toRupiah(9999000)}
      </h4>
      <div className='flex items-center'>
        <Tooltip message='Murah Lebay' color='success'>
          <Badge color='success' size='sm' className='truncate'>
            10%
          </Badge>
        </Tooltip>
        <h5 className='text-lg line-through ml-1'>
          {toRupiah(8000000)}-{toRupiah(10000000)}
        </h5>
      </div>
      <Divider />
      <div className='flex flex-col gap-4'>
        <div>
          <p className='font-bold mb-2'>Size:</p>
          <div className='flex flex-wrap gap-1'>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNIB
            </Button>
            <Button
              size='sm'
              color='secondary'
              className='font-normal normal-case'
            >
              BNOB
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
              disabled
            >
              BNIB+BUNDLE 1
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNIB+BUNDLE 2
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNIB+BUNDLE 3
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNIB+BUNDLE 4
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNOB+BUNDLE 1
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNOB+BUNDLE 2
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNOB+BUNDLE 3
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              BNOB+BUNDLE 4
            </Button>
          </div>
        </div>
        <div>
          <p className='font-bold mb-2'>Color:</p>
          <div className='flex flex-wrap gap-1'>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              White
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='font-normal normal-case'
            >
              Black
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <Tabs variant='bordered' value={tab} onChange={setTab}>
        <Tabs.Tab value={ProductTab.Specification}>Specification</Tabs.Tab>
        <Tabs.Tab value={ProductTab.Description}>Description</Tabs.Tab>
      </Tabs>
      {renderTabContent(tab)}
      <Divider />
      <ShopBanner />
    </div>
  );
};

export default ProductDescription;
