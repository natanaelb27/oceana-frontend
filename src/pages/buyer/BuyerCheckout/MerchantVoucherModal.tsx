import { useEffect } from 'react';
import { Modal } from 'react-daisyui';
import { Skeleton, VoucherTicket } from '../../../components/common';
import { useLazyGetAllMerchantVoucherByBuyerQuery } from '../../../store/services/shopService';
import {
  MarketplaceVoucher,
  MerchantVoucher,
  MerchantVouchers,
} from '../../../types/component';
import { MerchantVoucherQuery } from '../../../types/query';
import { toMerchantVoucherQuery } from '../../../utils/mapperDTO';
import { notifyInfoToast } from '../../../utils/toast';

type MerchantVoucherModalProps = {
  currentMerchantID: number;
  currentMerchantName: string;
  merchantVouchers: MerchantVouchers | null;
  subtotalBeforeShipping: number;
  voucherQuery: MerchantVoucherQuery;
  open: boolean;
  onClose: () => void;
  setMerchantVouchers: React.Dispatch<
    React.SetStateAction<MerchantVouchers | null>
  >;
};

const MerchantVoucherModal = ({
  currentMerchantID,
  currentMerchantName,
  merchantVouchers,
  subtotalBeforeShipping,
  voucherQuery,
  open,
  onClose,
  setMerchantVouchers,
}: MerchantVoucherModalProps) => {
  const [
    getAllMerchantVoucherByBuyer,
    { data: getAllMerchantVoucherByBuyerData },
  ] = useLazyGetAllMerchantVoucherByBuyerQuery();

  const handleClickMerchantVoucher = (
    voucher: MarketplaceVoucher | MerchantVoucher | null
  ) => {
    merchantVouchers && merchantVouchers[currentMerchantID]?.id === voucher?.id
      ? setMerchantVouchers((prev) => ({
          ...prev,
          [currentMerchantID]: null,
        }))
      : setMerchantVouchers((prev) => ({
          ...prev,
          [currentMerchantID]: voucher as MerchantVoucher,
        }));
    onClose();
  };

  useEffect(() => {
    if (open) {
      getAllMerchantVoucherByBuyer(toMerchantVoucherQuery(voucherQuery)).then(
        (response) => {
          if (response.data?.data.merchant_voucher.length === 0) {
            notifyInfoToast(
              `No available vouchers ${currentMerchantName}'s shop`
            );
            onClose();
            return null;
          }
        }
      );
    }
  }, [open]);

  if (!getAllMerchantVoucherByBuyerData?.data) {
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
        {`${currentMerchantName}'s Vouchers`}
      </Modal.Header>
      <Modal.Body className='h-96 overflow-auto flex flex-col gap-4'>
        {getAllMerchantVoucherByBuyerData.data.merchant_voucher.map(
          (voucherByBuyer) =>
            voucherByBuyer.current_quota < voucherByBuyer.maximum_quota ? (
              <VoucherTicket
                key={voucherByBuyer.id}
                currentVoucher={voucherByBuyer}
                disabled={
                  voucherByBuyer.minimum_spend_amount > subtotalBeforeShipping
                }
                selectedVoucher={
                  merchantVouchers && merchantVouchers[currentMerchantID]
                }
                onClickVoucher={handleClickMerchantVoucher}
              />
            ) : null
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MerchantVoucherModal;
