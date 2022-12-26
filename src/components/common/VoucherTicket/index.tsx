import { CgMathPercent } from 'react-icons/cg';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { MarketplaceVoucher, MerchantVoucher } from '../../../types/component';
import { isMarketplaceVoucher } from '../../../utils/checkout';
import { toDiscountString, toRupiah } from '../../../utils/convert';

type VoucherTicketProps = {
  disabled?: boolean;
  currentVoucher: MarketplaceVoucher | MerchantVoucher;
  selectedVoucher: MarketplaceVoucher | MerchantVoucher | null;
  onClickVoucher:
    | ((voucher: MarketplaceVoucher | MerchantVoucher | null) => void)
    | (() => void);
};

const VoucherTicket = ({
  disabled,
  currentVoucher,
  selectedVoucher,
  onClickVoucher,
}: VoucherTicketProps) => (
  <div
    className={`group grid grid-cols-5 max-w-md ${
      !disabled ? 'cursor-pointer' : 'cursor-not-allowed'
    }`}
    onClick={
      !onClickVoucher || disabled
        ? () => {
            return;
          }
        : () => onClickVoucher(currentVoucher)
    }
  >
    <div
      className={`clip-right aspect-w-1 aspect-h-1 col-span-1 flex justify-center items-center text-base-100 rounded-l-xl ${
        disabled
          ? 'bg-base-300 group-hover:bg-base-300 group-active:bg-base-300'
          : selectedVoucher && selectedVoucher.id === currentVoucher.id
          ? 'bg-secondary group-hover:bg-secondary/80 group-active:bg-secondary'
          : 'bg-primary group-hover:bg-primary/80 group-active:bg-primary'
      }  
      `}
    >
      {currentVoucher.discount_type.toLocaleLowerCase() === 'percentage' ? (
        <CgMathPercent />
      ) : (
        <HiOutlineCurrencyDollar />
      )}
    </div>
    <div
      className={`clip-left p-4 col-span-4 rounded-r-xl ${
        disabled
          ? 'bg-base-200 group-hover:bg-base-200 group-active:bg-base-200'
          : selectedVoucher && selectedVoucher.id === currentVoucher.id
          ? 'bg-secondary/10 group-active:bg-secondary/20'
          : 'bg-primary/40 group-hover:bg-primary/20 group-active:bg-primary/40'
      } 
      `}
    >
      <div>
        {isMarketplaceVoucher(currentVoucher)
          ? (currentVoucher as MarketplaceVoucher).name
          : (currentVoucher as MerchantVoucher).code}
      </div>
      <div className='font-bold'>
        {toDiscountString(
          currentVoucher.discount,
          currentVoucher.discount_type,
          currentVoucher.maximum_discount_amount
        )}
      </div>
      <div className='text-sm'>
        {`Minimum spend: ${toRupiah(currentVoucher.minimum_spend_amount)}`}
      </div>
    </div>
  </div>
);
export default VoucherTicket;
