import { Modal } from 'react-daisyui';
import { IoWalletOutline } from 'react-icons/io5';
import { SealabsPayImg } from '../../../components/common';
import { PaymentMethod } from '../../../types/component';
import { pascalCaseToTitleCase } from '../../../utils/convert';

type PaymentMethodModalProps = {
  currentPaymentMethod: PaymentMethod;
  open: boolean;
  onClose: () => void;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
};

const PaymentMethodModal = ({
  currentPaymentMethod,
  open,
  onClose,
  setPaymentMethod,
}: PaymentMethodModalProps) => {
  return (
    <Modal
      open={open}
      responsive
      className='max-w-sm'
      onClickBackdrop={onClose}
    >
      <Modal.Header className='mb-4 text-xl text-primary font-bold'>
        Payment Method
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-col items-end gap-4'>
          {Object.keys(PaymentMethod)
            .filter((key) => isNaN(Number(key)))
            .map((key, index) => (
              <div
                key={index}
                className={`p-4 w-full flex items-center justify-between rounded-3xl cursor-pointer ${
                  currentPaymentMethod === index + 1
                    ? 'bg-primary/10 border border-primary active:bg-primary/20'
                    : 'hover:bg-primary/20 active:bg-primary/10'
                }`}
                onClick={
                  currentPaymentMethod === index + 1
                    ? onClose
                    : () => {
                        setPaymentMethod(index + 1);
                        onClose();
                      }
                }
              >
                <div className='text-lg'>{pascalCaseToTitleCase(key)}</div>
                <div className='flex items-center'>
                  {key === PaymentMethod[1] ? (
                    <IoWalletOutline className='w-5 h-5' />
                  ) : (
                    <SealabsPayImg className='w-5 h-5' />
                  )}
                </div>
              </div>
            ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentMethodModal;
