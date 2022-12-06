import { AiFillStar } from 'react-icons/ai';
import { RatingField, RightContentAttribute, ShopDetailCardContainer, ShopDetailCardContent, ShopDetailCardContentLeft, ShopDetailCardContentRight } from './style';

const ShopDetailCard = () => {
  return (
    <ShopDetailCardContainer className='bg-purple-500'>
        <ShopDetailCardContent>
           <ShopDetailCardContentLeft>
                <img src="https://picsum.photos/id/88/100" className="rounded-full mr-3"></img>
                <div className="text-2xl font-bold">Nusantara Official Store</div>
           </ShopDetailCardContentLeft>
           <ShopDetailCardContentRight>
                <RightContentAttribute>
                    <RatingField>
                        <AiFillStar className="text-2xl text-yellow-500"/>
                        <div className="text-2xl font-bold">5.0</div>
                    </RatingField>
                    <div>Ratings & Reviews</div>
                </RightContentAttribute>
                <RightContentAttribute>
                    <div className="text-2xl font-bold">15</div>
                    <div>Products Sold</div>
                </RightContentAttribute>
           </ShopDetailCardContentRight>
        </ShopDetailCardContent>
    </ShopDetailCardContainer>
  );
};

export default ShopDetailCard;