import moment from 'moment';
import { DISCOUNT_TYPE } from '../../constants';

type ShopVoucherCardProp = {
  code: string;
  discountType: string;
  discount: number;
  minimumSpendAmount: number;
  maximumDiscountAmount: number;
  endDatetime: string;
};

const ShopVoucherCard = ({
  code,
  discountType,
  discount,
  minimumSpendAmount,
  maximumDiscountAmount,
  endDatetime,
}: ShopVoucherCardProp) => {
  return (
    <div className='flex justify-between items-center p-5 w-96 glass bg-secondary/50 hover:bg-secondary/50 rounded-xl'>
      <div className='flex flex-col'>
        <span className='font-bold'>{code}</span>
        <span className='font-bold'>
          {discountType === DISCOUNT_TYPE.PERCENTAGE && (
            <span>{discount}% Discount</span>
          )}
          {discountType === DISCOUNT_TYPE.NOMINAL && (
            <span>
              Rp {parseInt(String(discount), 10).toLocaleString('id-ID')}{' '}
              Discount
            </span>
          )}
        </span>
        <span>
          <div>
            Minimum Spending Rp{' '}
            {parseInt(String(minimumSpendAmount), 10).toLocaleString('id-ID')}
          </div>
          <div>
            Maximum Rp{' '}
            {parseInt(String(maximumDiscountAmount), 10).toLocaleString(
              'id-ID'
            )}
          </div>
        </span>
        <span>Valid Until {moment(endDatetime).format('DD MMMM YYYY')}</span>
      </div>
    </div>
  );
};

export default ShopVoucherCard;
