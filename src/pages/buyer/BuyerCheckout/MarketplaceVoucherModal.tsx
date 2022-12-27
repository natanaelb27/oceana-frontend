import React from 'react';
import { Modal } from 'react-daisyui';
import { VoucherTicket } from '../../../components/common';
import { MarketplaceVoucher, MerchantVoucher } from '../../../types/component';
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
  if (activeMarketplaceVouchers.length === 0 && open) {
    notifyInfoToast('No available vouchers');
    return null;
  }
  const handleChangeMarketplaceVoucher = (
    voucher: MarketplaceVoucher | MerchantVoucher | null
  ) => {
    voucher?.id === currentMarketplaceVoucher?.id
      ? setMarketplaceVoucher(null)
      : setMarketplaceVoucher(voucher as MarketplaceVoucher);
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
        {activeMarketplaceVouchers.map((voucher) =>
          voucher.current_quota < voucher.maximum_quota ? (
            <VoucherTicket
              key={voucher.id}
              disabled={voucher.minimum_spend_amount > totalPayment}
              currentVoucher={voucher}
              selectedVoucher={currentMarketplaceVoucher}
              onClickVoucher={handleChangeMarketplaceVoucher}
            />
          ) : null
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MarketplaceVoucherModal;
