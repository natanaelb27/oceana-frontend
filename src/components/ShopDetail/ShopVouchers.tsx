import { MerchantVoucher } from '../../types/component';
import { GetAllMerchantVouchersResponse } from '../../types/response';
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
        {vouchers && (  
          <Slider id='voucher'>
              <div className='hidden'></div>
              <ShopVouchersFlex>
                {vouchers?.map((voucher) => {
                  return (<ShopVoucherCard key={voucher.id} code={voucher.code} discountType={voucher.discount_type}/>);
                })}
              </ShopVouchersFlex>
          </Slider>
        )}
        {!vouchers && 
          <div>
              No vouchers available for right now.
          </div>
        }
    </ShopVouchersCardContainer>
  );
};

export default ShopVouchers;