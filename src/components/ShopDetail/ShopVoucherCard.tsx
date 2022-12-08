import moment from 'moment';
import { ShopVoucherButton, ShopVoucherCardContainer, ShopVoucherCardContents, ShopVoucherCardDetails, ShopVoucherDesc, ShopVoucherTitle, ShopVoucherValidity } from './style';

type ShopVoucherCardProp = {
  code: string;
  discountType: string;
  discount: number;
  minimumSpendAmount: number;
  maximumDiscountAmount: number;
  endDatetime: string,
};

const ShopVoucherCard = ({ code, discountType, discount, minimumSpendAmount, maximumDiscountAmount, endDatetime }: ShopVoucherCardProp) => {
  return (
    <ShopVoucherCardContainer>
        <ShopVoucherCardContents>
            <ShopVoucherCardDetails>
                <ShopVoucherTitle>{code}</ShopVoucherTitle>
                <ShopVoucherDesc className='font-bold'>
                  {discountType === 'discount' && <div>{discount}% Discount</div>}
                  {discountType === 'nominal' && <div>Rp {parseInt(String(discount), 10).toLocaleString('id-ID')} Discount</div>}
                </ShopVoucherDesc>
                <ShopVoucherDesc>
                  <div>Minimum Spending Rp {parseInt(String(minimumSpendAmount), 10).toLocaleString('id-ID')}</div>
                  <div>Maximum Rp {parseInt(String(maximumDiscountAmount), 10).toLocaleString('id-ID')}</div>
                </ShopVoucherDesc>
                <ShopVoucherValidity>Valid Until {moment(endDatetime).format('DD MMMM YYYY')}</ShopVoucherValidity>
            </ShopVoucherCardDetails>
            <ShopVoucherButton>Claim</ShopVoucherButton>
        </ShopVoucherCardContents>
    </ShopVoucherCardContainer>
  );
};

export default ShopVoucherCard;