import { ImPriceTags } from 'react-icons/im';
import { TbDiscount2 } from 'react-icons/tb';
import { MarketplaceVoucher } from '../../types/component';
import { toDiscountString } from '../../utils/convert';

type VoucherTicketProps = {
  currentVoucher: MarketplaceVoucher;
  selectedVoucher: MarketplaceVoucher | null;
  onChangeVoucher?: (voucher: MarketplaceVoucher) => void;
};

const VoucherTicket = ({
  currentVoucher,
  selectedVoucher,
  onChangeVoucher,
}: VoucherTicketProps) => (
  <div className='group grid grid-cols-3'>
    <div
      className={`clip-left flex justify-center items-center text-5xl text-base-100 ${
        selectedVoucher && selectedVoucher.id === currentVoucher.id
          ? 'bg-secondary group-hover:bg-secondary/80 group-active:bg-secondary'
          : 'bg-primary group-hover:bg-primary/80 group-active:bg-primary'
      }`}
    >
      {currentVoucher.discount_type.toLocaleLowerCase() === 'percentage' ? (
        <TbDiscount2 />
      ) : (
        <ImPriceTags />
      )}
    </div>
    <div
      className={`p-6 cursor-pointer col-span-2 rounded-r-full ${
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
