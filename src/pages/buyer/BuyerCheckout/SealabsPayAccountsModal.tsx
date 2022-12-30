import React from 'react';
import { Button, Modal } from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import {
  NoData,
  SealabsPayCardImg,
  SealabsPayImg,
} from '../../../components/common';
import { SealabsPayAccount } from '../../../types/component';
import { toCardNumber } from '../../../utils/convert';

type SealabsPayAccountsModalProps = {
  sealabsPayAccounts: SealabsPayAccount[];
  open: boolean;
  onClose: () => void;
  setCurrentSealabsPayAccount: React.Dispatch<
    React.SetStateAction<SealabsPayAccount | null>
  >;
};

const SealabsPayAccountsModal = ({
  sealabsPayAccounts,
  open,
  onClose,
  setCurrentSealabsPayAccount,
}: SealabsPayAccountsModalProps) => {
  const navigate = useNavigate();
  const handleSealabsPayAccountClick = (selectedAccount: SealabsPayAccount) => {
    setCurrentSealabsPayAccount(selectedAccount);
    onClose();
  };
  if (open && sealabsPayAccounts.length === 0) {
    return (
      <Modal
        open={open}
        className='max-w-sm'
        responsive
        onClickBackdrop={onClose}
      >
        <Modal.Header className='mb-4 text-xl text-primary font-bold'>
          Sealabs Pay Accounts
        </Modal.Header>
        <NoData
          title='No Sealabs Pay Account'
          message='How about creating a new account?'
          buttonMessage='Create Account'
          buttonHandleClick={() => navigate('/user/account/sealabs-pay')}
        />
      </Modal>
    );
  }
  return (
    <Modal
      open={open}
      className='max-w-sm'
      responsive
      onClickBackdrop={onClose}
    >
      <Modal.Header className='mb-4 text-xl text-primary font-bold'>
        Sealabs Pay Accounts
      </Modal.Header>
      <Modal.Body>
        <div className='w-full flex justify-center mb-4'>
          <SealabsPayImg className='w-24' />
        </div>
        <div className='overflow-y-scroll h-72'>
          {sealabsPayAccounts.map((sealabsPay, i) => (
            <Button
              className={`w-full glass text-white font-mono normal-case border-2 rounded-lg my-1 hover:cursor-pointer shadow-md text-lg ${
                sealabsPay.is_default
                  ? 'bg-secondary hover:bg-secondary'
                  : 'bg-primary hover:bg-primary'
              }`}
              size='lg'
              key={i}
              onClick={() => handleSealabsPayAccountClick(sealabsPay)}
            >
              <div className='flex justify-between w-full'>
                <SealabsPayCardImg />
                <div>{toCardNumber(sealabsPay.card_number)}</div>
              </div>
            </Button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SealabsPayAccountsModal;
