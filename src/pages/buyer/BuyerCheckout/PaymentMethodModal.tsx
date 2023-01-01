import { Modal } from 'react-daisyui';
import { IoWalletOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { SealabsPayImg } from '../../../components/common';
import { PaymentMethod, SealabsPayAccount } from '../../../types/component';
import { pascalCaseToTitleCase } from '../../../utils/convert';

type PaymentMethodModalProps = {
  currentPaymentMethod: PaymentMethod;
  sealabsPayAccounts: SealabsPayAccount[];
  open: boolean;
  onClose: () => void;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
};

const PaymentMethodModal = ({
  currentPaymentMethod,
  sealabsPayAccounts,
  open,
  onClose,
  setPaymentMethod,
}: PaymentMethodModalProps) => {
  const navigate = useNavigate();
  const isMissingSealabsPayAccount = (paymentMethod: PaymentMethod) =>
    paymentMethod === PaymentMethod.SealabsPay &&
    sealabsPayAccounts.length === 0;
  const handlePaymentMethodClick = (paymentMethod: PaymentMethod) => {
    if (isMissingSealabsPayAccount(paymentMethod)) {
      navigate('/user/account/sealabs-pay');
    }
    setPaymentMethod(paymentMethod);
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
                    : () => handlePaymentMethodClick(index + 1)
                }
              >
                <div className='text-lg'>
                  {isMissingSealabsPayAccount(index + 1)
                    ? `Create a ${pascalCaseToTitleCase(key)} Account`
                    : pascalCaseToTitleCase(key)}
                </div>
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
