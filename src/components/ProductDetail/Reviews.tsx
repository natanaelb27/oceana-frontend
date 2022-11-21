import moment from 'moment';
import { useState } from 'react';
import { Avatar, Rating, Select } from 'react-daisyui';
import Zoom from 'react-medium-image-zoom';

import { ReviewsSort } from '../../types/sort';
import { Pager } from '../common';

const Reviews = () => {
  const [sort, setSort] = useState<ReviewsSort>(ReviewsSort.Latest);

  const handleSortChange = (sort: ReviewsSort) => {
    setSort(Number(sort));
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-sm truncate'>Showing 5 out 5 reviews</span>
        <div className='flex items-center'>
          <span className='text-sm font-bold mr-2.5'>Sort</span>
          <Select
            value={sort}
            onChange={handleSortChange}
            size='sm'
            className='font-normal'
          >
            <Select.Option value={ReviewsSort.Latest}>Latest</Select.Option>
            <Select.Option value={ReviewsSort.HighestRating}>
              Highest Rating
            </Select.Option>
            <Select.Option value={ReviewsSort.LowestRating}>
              Lowest Rating
            </Select.Option>
          </Select>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-10 mt-8'>
        {Array.from({ length: 5 }, (_, index) => index + 1).map((i) => (
          <div key={i}>
            <div className='flex items-center mb-4'>
              <Rating value={3} size='sm'>
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
                <Rating.Item
                  name='rating-1'
                  className='mask mask-star-2 bg-warning'
                />
              </Rating>
              <span className='text-sm ml-2.5'>
                {moment('20120620', 'YYYYMMDD').fromNow()}
              </span>
            </div>
            <div className='flex items-center mb-4'>
              <Avatar
                src='https://picsum.photos/200'
                shape='circle'
                size='sm'
              />
              <span className='font-medium ml-2.5'>Sebut Saja Mawar</span>
            </div>
            <span className='font-light text-sm mb-4'>Variant: Black</span>
            <p className='prose-sm mb-4'>
              Kualitas produk bagus. Nyaman dipakai. Warnanya mantap. Ukuran
              sesuai. Bahannya adem. Tidak menerawang. Bahan menyerap keringat.
              Bahannya lembut.
            </p>
            <div className='flex gap-2'>
              <Zoom>
                <img src='https://picsum.photos/200' className='w-12 rounded' />
              </Zoom>
              <Zoom>
                <img src='https://picsum.photos/200' className='w-12 rounded' />
              </Zoom>
              <Zoom>
                <img src='https://picsum.photos/200' className='w-12 rounded' />
              </Zoom>
              <Zoom>
                <img src='https://picsum.photos/200' className='w-12 rounded' />
              </Zoom>
              <Zoom>
                <img src='https://picsum.photos/200' className='w-12 rounded' />
              </Zoom>
              <Zoom>
                <img src='https://picsum.photos/200' className='w-12 rounded' />
              </Zoom>
            </div>
          </div>
        ))}
        <div className='mx-auto'>
          <Pager
            page={1}
            totalPage={10}
            onPageChange={() => {
              console.log('');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
