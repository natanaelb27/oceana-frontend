import React, { useEffect, useState } from 'react';
import { Modal } from 'react-daisyui';
import { NoData, Skeleton, VoucherTicket } from '../../../components/common';
import {
  LIMIT_SELLER_VOUCHER_ALL,
  VOUCHER_AVAILABILITY,
  VOUCHER_STATUS,
} from '../../../constants';
import { useLazyGetMarketplaceVoucherByBuyerQuery } from '../../../store/services/marketplaceService';
import { MarketplaceVoucher, MerchantVoucher } from '../../../types/component';
import { MarketplaceVoucherQuery } from '../../../types/query';
import { toMarketplaceVoucherQuery } from '../../../utils/mapperDTO';

type MarketplaceVoucherModalProps = {
  currentMarketplaceVoucher: MarketplaceVoucher | null;
  totalPayment: number;
  open: boolean;
  onClose: () => void;
  setMarketplaceVoucher: React.Dispatch<
    React.SetStateAction<MarketplaceVoucher | null>
  >;
};

const MarketplaceVoucherModal = ({
  currentMarketplaceVoucher,
  totalPayment,
  open,
  onClose,
  setMarketplaceVoucher,
}: MarketplaceVoucherModalProps) => {
  const [
    getMarketplaceVoucherByBuyer,
    {
      data: getMarketplaceVoucherByBuyerData,
      isLoading: getMarketplaceVoucherByBuyerLoading,
    },
  ] = useLazyGetMarketplaceVoucherByBuyerQuery();
  const [voucherQuery] = useState<MarketplaceVoucherQuery>({
    limit: LIMIT_SELLER_VOUCHER_ALL,
    page: 1,
    sortBy: '',
    sort: '',
    searchVoucherName: '',
    filterVoucherStatus: VOUCHER_STATUS.ONGOING,
    filterVoucherAvailability: VOUCHER_AVAILABILITY.AVAILABLE,
  });

  const handleChangeMarketplaceVoucher = (
    voucher: MarketplaceVoucher | MerchantVoucher | null
  ) => {
    voucher?.id === currentMarketplaceVoucher?.id
      ? setMarketplaceVoucher(null)
      : setMarketplaceVoucher(voucher as MarketplaceVoucher);
    onClose();
  };

  useEffect(() => {
    getMarketplaceVoucherByBuyer(toMarketplaceVoucherQuery(voucherQuery));
  }, [open, voucherQuery]);

  if (
    getMarketplaceVoucherByBuyerLoading ||
    !getMarketplaceVoucherByBuyerData?.data
  ) {
    return (
      <Modal
        open={open}
        responsive
        className='max-w-sm'
        onClickBackdrop={onClose}
      >
        <Modal.Header className='mb-4 text-xl text-primary font-bold'>
          <Skeleton className='w-44 h-5' />
        </Modal.Header>
        <Modal.Body className='h-96 overflow-y-auto'>
          <div className='grid gap-4'>
            {Array(4)
              .fill(0)
              .map((_, n) => (
                <Skeleton key={n} className='w-full h-20' />
              ))}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
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
        {getMarketplaceVoucherByBuyerData.data.filter(
          (voucher) => voucher.current_quota < voucher.maximum_quota
        ).length === 0 ? (
          <div className='flex h-full justify-center items-center'>
            <NoData
              title='Sorry!'
              message='No available vouchers at this time'
            />
          </div>
        ) : (
          getMarketplaceVoucherByBuyerData.data
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
