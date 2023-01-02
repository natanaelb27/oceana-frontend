import { MerchantVoucher } from '../../types/component';
import { Slider } from '../common';
import ShopVoucherCard from './ShopVoucherCard';

type ShopVouchersProp = {
  vouchers: MerchantVoucher[] | null | undefined;
};

const ShopVouchers = ({ vouchers }: ShopVouchersProp) => {
  return (
    <div className='relative lg:w-3/5 w-full p-3 border rounded mb-10 flex flex-col justify-center'>
      <span className='text-lg font-bold mb-3'>Shop Vouchers</span>
      {vouchers?.length != 0 && (
        <Slider id='voucher'>
          <div className='flex gap-3'>
            {vouchers?.map((voucher) => {
              return (
                <ShopVoucherCard
                  key={voucher.id}
                  code={voucher.code}
                  discountType={voucher.discount_type}
                  discount={voucher.discount}
                  minimumSpendAmount={voucher.minimum_spend_amount}
                  maximumDiscountAmount={voucher.maximum_discount_amount}
                  endDatetime={voucher.end_datetime}
                />
              );
            })}
          </div>
        </Slider>
      )}
      {vouchers?.length == 0 && (
        <div className='h-12 text-center'>
          <span className='text-center font-bold'>
            No vouchers available right now
          </span>
        </div>
      )}
    </div>
  );
};

export default ShopVouchers;
