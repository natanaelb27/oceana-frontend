import ShopVoucherCard from './ShopVoucherCard';
import { ShopVouchersCardContainer, ShopVouchersFlex } from './style';

const ShopVouchers = () => {
  return (
    <ShopVouchersCardContainer>
        <div className='text-lg font-bold mb-3'>Shop Vouchers</div>
        <ShopVouchersFlex>
            <ShopVoucherCard/>
            <ShopVoucherCard/>
            <ShopVoucherCard/>
            <ShopVoucherCard/>
            <ShopVoucherCard/>
        </ShopVouchersFlex>
    </ShopVouchersCardContainer>
  );
};

export default ShopVouchers;