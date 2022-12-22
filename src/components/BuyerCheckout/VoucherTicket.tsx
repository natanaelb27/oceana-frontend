import { CgMathPercent } from 'react-icons/cg';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { MarketplaceVoucher } from '../../types/component';
import { toDiscountString } from '../../utils/convert';

type VoucherTicketProps = {
  currentVoucher: MarketplaceVoucher;
  selectedVoucher: MarketplaceVoucher | null;
  onClickVoucher: ((voucher: MarketplaceVoucher) => void) | (() => void);
};

const VoucherTicket = ({
  currentVoucher,
  selectedVoucher,
  onClickVoucher: onChangeVoucher,
}: VoucherTicketProps) => (
  <div className='group grid grid-cols-4'>
    <div
      className={`clip-right flex justify-center items-center text-5xl text-base-100 rounded-l-xl ${
        selectedVoucher && selectedVoucher.id === currentVoucher.id
          ? 'bg-secondary group-hover:bg-secondary/80 group-active:bg-secondary'
          : 'bg-primary group-hover:bg-primary/80 group-active:bg-primary'
      }`}
    >
      {currentVoucher.discount_type.toLocaleLowerCase() === 'percentage' ? (
        <CgMathPercent />
      ) : (
        <HiOutlineCurrencyDollar />
      )}
    </div>
    <div
      className={`clip-left p-4 cursor-pointer col-span-3 rounded-r-xl ${
        selectedVoucher && selectedVoucher.id === currentVoucher.id
          ? 'bg-secondary/10 group-active:bg-secondary/20'
          : 'bg-primary/40 group-hover:bg-primary/20 group-active:bg-primary/40'
      }`}
      onClick={
        !onChangeVoucher
          ? () => {
              return;
            }
          : () => onChangeVoucher(currentVoucher)
      }
    >
      <div>{currentVoucher.name}</div>
      <div className='font-bold'>
        {toDiscountString(
          currentVoucher.discount,
          currentVoucher.discount_type
        )}
      </div>
    </div>
  </div>
);
export default VoucherTicket;
