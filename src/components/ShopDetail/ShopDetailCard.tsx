import { AiFillStar } from 'react-icons/ai';
import { MerchantDetail } from '../../types/component';
import { Image } from '../common';
import {
  RatingField,
  RightContentAttribute,
  ShopDetailCardContainer,
  ShopDetailCardContent,
  ShopDetailCardContentLeft,
  ShopDetailCardContentRight,
} from './style';

type ShopDetailCardProps = {
  merchant: MerchantDetail | null | undefined;
};

const ShopDetailCard = ({ merchant }: ShopDetailCardProps) => {
  return (
    <ShopDetailCardContainer>
      <ShopDetailCardContent>
        <ShopDetailCardContentLeft>
          {merchant?.photo ? (
            <div>
              <Image src={merchant?.photo} className='rounded-full mr-3' />
            </div>
          ) : (
            <div className='avatar placeholder'>
              <div className='bg-neutral-focus text-neutral-content rounded-full w-24 mr-3'>
                <span className='text-3xl'>{merchant?.name.charAt(0)}</span>
              </div>
            </div>
          )}
          <div className='text-2xl font-bold text-center'>{merchant?.name}</div>
        </ShopDetailCardContentLeft>
        <ShopDetailCardContentRight>
          <RightContentAttribute>
            <RatingField>
              <AiFillStar className='text-2xl text-yellow-500' />
              <div className='text-2xl font-bold'>{merchant?.rating_star}</div>
            </RatingField>
            <div className='text-center'>Ratings & Reviews</div>
          </RightContentAttribute>
          <RightContentAttribute>
            <div className='text-2xl font-bold'>{merchant?.product_count}</div>
            <div className='text-center'>Products</div>
          </RightContentAttribute>
          <RightContentAttribute>
            <div className='text-2xl font-bold'>{merchant?.total_rating}</div>
            <div className='text-center'>No. of Ratings</div>
          </RightContentAttribute>
        </ShopDetailCardContentRight>
      </ShopDetailCardContent>
    </ShopDetailCardContainer>
  );
};

export default ShopDetailCard;
