import React from 'react';
import { Button, Modal } from 'react-daisyui';
import { useGetAllSealabsPayQuery } from '../../../store/services/sealabsPayService';
import { toCardNumber } from '../../../utils/convert';
import { SealabsPayCardImg, SealabsPayImg } from '../../common';

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
  const { data: sealabsPayData, isLoading: sealabsPayIsLoading } =
    useGetAllSealabsPayQuery();

  const handleSelectSealabspay = (cardNumber: string, nameOnCard: string) => {
    setSealabsPayDetails({
      cardNumber,
      nameOnCard,
    });
    handleClose();
    nextSetOpen(true);
  };

  if (sealabsPayIsLoading || !sealabsPayData?.data) {
    return (
      <Modal open={open} responsive onClickBackdrop={handleClose}>
        <Modal.Header>Select Sealabs Pay Account For Wallet Topup</Modal.Header>
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
        <div className='overflow-y-scroll h-72'>
          {sealabsPayData?.data?.map((sealabsPay, i) => (
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
      </Modal.Body>
    </Modal>
  );
};

export default SelectSealabsPayModal;
