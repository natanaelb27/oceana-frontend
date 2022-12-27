import React from 'react';
import { Modal } from 'react-daisyui';
import { NoData, VoucherTicket } from '../../../components/common';
import { MarketplaceVoucher, MerchantVoucher } from '../../../types/component';

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
        {activeMarketplaceVouchers.filter(
          (voucher) => voucher.current_quota < voucher.maximum_quota
        ).length === 0 ? (
          <div className='flex h-full justify-center items-center'>
            <NoData
              title='Sorry!'
              message='No available vouchers at this time'
            />
          </div>
        ) : (
          activeMarketplaceVouchers
            .filter((voucher) => voucher.current_quota < voucher.maximum_quota)
            .map((voucher) => (
              <VoucherTicket
                key={voucher.id}
                disabled={voucher.minimum_spend_amount > totalPayment}
                currentVoucher={voucher}
                selectedVoucher={currentMarketplaceVoucher}
                onClickVoucher={handleChangeMarketplaceVoucher}
              />
            ))
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MarketplaceVoucherModal;
