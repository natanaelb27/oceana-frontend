import React from 'react';
import { Modal } from 'react-daisyui';
import { VoucherTicket } from '../../../components/BuyerCheckout';
import { MarketplaceVoucher } from '../../../types/component';
import { notifyInfoToast } from '../../../utils/toast';

type MarketplaceVoucherModalProps = {
  activeMarketplaceVouchers: MarketplaceVoucher[];
  currentMarketplaceVoucher: MarketplaceVoucher | null;
  totalPayment: number;
  open: boolean;
  onClose: () => void;
  setMarketplaceVoucher: React.Dispatch<
    React.SetStateAction<MarketplaceVoucher | null>
  >;
};

const MarketplaceVoucherModal = ({
  activeMarketplaceVouchers,
  currentMarketplaceVoucher,
  totalPayment,
  open,
  onClose,
  setMarketplaceVoucher,
}: MarketplaceVoucherModalProps) => {
  if (activeMarketplaceVouchers.length === 0) {
    notifyInfoToast('No available vouchers');
    return null;
  }
  const handleChangeVoucher = (voucher: MarketplaceVoucher) => {
    setMarketplaceVoucher(voucher);
    onClose();
  };
  return (
    <Modal
      open={open}
      responsive
      className='max-w-sm'
      onClickBackdrop={onClose}
    >
      <Modal.Header className='mb-4 text-xl text-primary font-bold'>
        <span className='font-main italic'>Oceana</span> Vouchers
      </Modal.Header>
      <Modal.Body className='h-96 overflow-auto flex flex-col gap-4'>
        {activeMarketplaceVouchers.map((voucher) => (
          <VoucherTicket
            key={voucher.id}
            disabled={voucher.minimum_spend_amount > totalPayment}
            currentVoucher={voucher}
            selectedVoucher={currentMarketplaceVoucher}
            onClickVoucher={handleChangeVoucher}
          />
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default MarketplaceVoucherModal;
