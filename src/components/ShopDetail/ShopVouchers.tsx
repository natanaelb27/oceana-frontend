import { MerchantVoucher } from '../../types/component';
import { Slider } from '../common';
import ShopVoucherCard from './ShopVoucherCard';
import { ShopVouchersCardContainer, ShopVouchersFlex } from './style';

type ShopVouchersProp = {
  vouchers: MerchantVoucher[] | null | undefined;
};

const ShopVouchers = ({ vouchers }: ShopVouchersProp) => {
  return (    
    <ShopVouchersCardContainer>
         <div className='text-lg font-bold mb-3'>Shop Vouchers</div>
        {vouchers?.length != 0 && (  
          <Slider id='voucher'>
              <div className='hidden'></div>
              <ShopVouchersFlex>
                {vouchers?.map((voucher) => {
                  return (<ShopVoucherCard 
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
              </ShopVouchersFlex>
          </Slider>
        )}
        {vouchers?.length == 0 && 
          <h1 className='text-center font-bold'>
              No vouchers available for right now.
          </h1>
        }
    </ShopVouchersCardContainer>
  );
};

export default ShopVouchers;