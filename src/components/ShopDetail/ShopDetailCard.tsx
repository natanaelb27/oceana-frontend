import { AiFillStar } from 'react-icons/ai';
import { MerchantDetail } from '../../types/component';
import { RatingField, RightContentAttribute, ShopDetailCardContainer, ShopDetailCardContent, ShopDetailCardContentLeft, ShopDetailCardContentRight } from './style';

type ShopDetailCardProps = {
    merchant: MerchantDetail | null | undefined;
};

const ShopDetailCard = ({ merchant }: ShopDetailCardProps) => {
    return (
    <ShopDetailCardContainer className='bg-secondary'>
        <ShopDetailCardContent>
            <ShopDetailCardContentLeft>
                <img src="https://picsum.photos/id/88/100" className="rounded-full mr-3"></img>
                <div className="text-2xl font-bold">{merchant?.name}</div>
            </ShopDetailCardContentLeft>
            <ShopDetailCardContentRight>
                <RightContentAttribute>
                    <RatingField>
                        <AiFillStar className="text-2xl text-yellow-500"/>
                        <div className="text-2xl font-bold">{merchant?.rating_star}</div>
                    </RatingField>
                    <div>Ratings & Reviews</div>
                </RightContentAttribute>
                <RightContentAttribute>
                    <div className="text-2xl font-bold">{merchant?.product_count}</div>
                    <div>Products</div>
                </RightContentAttribute>
                <RightContentAttribute>
                    <div className="text-2xl font-bold">{merchant?.total_rating}</div>
                    <div>No. of Ratings</div>
                </RightContentAttribute>
            </ShopDetailCardContentRight>
        </ShopDetailCardContent>
    </ShopDetailCardContainer>
    );
};

export default ShopDetailCard;