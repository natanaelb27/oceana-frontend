import React from 'react';
import { Button, Modal } from 'react-daisyui';
import { useNavigate } from 'react-router-dom';
import { useGetAllSealabsPayQuery } from '../../../store/services/sealabsPayService';
import { toCardNumber } from '../../../utils/convert';
import {
  NoData,
  SealabsPayCardImg,
  SealabsPayImg,
  Skeleton,
} from '../../common';

type SealabsPayDetails = {
  nameOnCard: string;
  cardNumber: string;
};

type SelectSealabsPayModalProps = {
  open: boolean;
  handleClose: () => void;
  nextSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSealabsPayDetails: React.Dispatch<React.SetStateAction<SealabsPayDetails>>;
};

const SelectSealabsPayModal = ({
  open,
  handleClose,
  nextSetOpen,
  setSealabsPayDetails,
}: SelectSealabsPayModalProps) => {
  const navigate = useNavigate();
  const { data: sealabsPayData } = useGetAllSealabsPayQuery();

  const handleSelectSealabspay = (cardNumber: string, nameOnCard: string) => {
    setSealabsPayDetails({
      cardNumber,
      nameOnCard,
    });
    handleClose();
    nextSetOpen(true);
  };

  if (!sealabsPayData?.data) {
    return (
      <Modal open={open} responsive onClickBackdrop={handleClose}>
        <Modal.Header className='font-bold text-center'>
          Select Sealabs Pay Account
        </Modal.Header>
        <Modal.Body>
          <div className='w-full flex justify-center mb-4'>
            <SealabsPayImg className='w-24' />
          </div>
          <div className='flex flex-col justify-center gap-4'>
            {Array(3)
              .fill(0)
              .map((n) => (
                <Skeleton key={n} className='w-full h-20' />
              ))}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
  return (
    <Modal open={open} responsive onClickBackdrop={handleClose}>
      <Modal.Header className='font-bold text-center'>
        Select Sealabs Pay Account
      </Modal.Header>
      <Modal.Body>
        <div className='w-full flex justify-center mb-4'>
          <SealabsPayImg className='w-24' />
        </div>
        {sealabsPayData.data.length === 0 ? (
          <div className='overflow-y-scroll flex flex-col justify-center hide-scrollbar'>
            <Button
              onClick={() => navigate('/user/account/sealabs-pay')}
              color='primary'
            >
              Register Sealabs Pay
            </Button>
            <NoData
              title='No Sealabs Pay Account'
              message='Please register your account with us before topping up your wallet'
            />
          </div>
        ) : (
          <div className='overflow-y-scroll h-72'>
            {sealabsPayData.data.map((sealabsPay, i) => (
              <Button
                className='w-full glass bg-primary/80 text-white font-mono normal-case border-2 rounded-lg my-1 hover:cursor-pointer hover:bg-primary shadow-md text-lg'
                size='lg'
                key={i}
                onClick={() =>
                  handleSelectSealabspay(
                    sealabsPay.card_number,
                    sealabsPay.name_on_card
                  )
                }
              >
                <div className='flex justify-between w-full'>
                  <SealabsPayCardImg />
                  <div>{toCardNumber(sealabsPay.card_number)}</div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SelectSealabsPayModal;
