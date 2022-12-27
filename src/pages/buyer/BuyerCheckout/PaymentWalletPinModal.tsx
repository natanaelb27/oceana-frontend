import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Modal, Tooltip } from 'react-daisyui';
import { CgLock, CgLockUnlock } from 'react-icons/cg';
import { notifyErrorToast } from '../../../utils/toast';

type PaymentWalletPinModalProps = {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
};

const PaymentWalletPinModal = ({
  open,
  isLoading,
  onClose,
  onSuccess,
}: PaymentWalletPinModalProps) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);

  const [showPin, setShowPin] = useState<boolean>(false);

  const handlePinChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newPin = [...pin];

    if (newPin?.[index] === undefined) {
      return;
    }

    const value = e.target.value;

    if (!/^[0-9]+$/.test(value) && value !== '') {
      return;
    }

    newPin[index] = e.target.value;

    setPin(newPin);
  };

  const handleLogoClick = () => {
    setShowPin(!showPin);
  };

  const handleCancelClick = () => {
    onClose();
  };

  const handleOnKeyUp = (keyCode: string, value: string, index: number) => {
    if (!/^[0-9]+$/.test(value)) {
      return;
    }
    // if key pressed is below then do nothing
    if (keyCode == 'Tab' || keyCode == 'ShiftLeft' || keyCode == 'ShiftRight') {
      return;
    }

    const next = document.querySelector(
      `input[name=input-pin-${index + 1}]`
    ) as HTMLElement;

    if (next !== null) {
      next.focus();
    }
  };

  const handleOnFocus = (
    e: React.FocusEvent<HTMLInputElement, Element>,
    index: number
  ) => {
    // if there is value then dont delete
    if (e.target.value) {
      e.target.select();
      return;
    }

    const newPin = [...pin];

    if (newPin?.[index] === undefined) {
      return;
    }

    newPin[index] = '';

    setPin(newPin);
  };

  const handleSubmit = () => {
    if (pin.find((char) => char === '') === '') {
      notifyErrorToast('Invalid PIN');
      return;
    }

    onSuccess(pin.join(''));
  };

  useEffect(() => {
    if (!open) {
      setPin(['', '', '', '', '', '']);
      setShowPin(false);
    }
    // focus on first input
    handleOnKeyUp('', '', -1);
  }, [open]);

  return (
    <Modal
      open={open}
      responsive
      className='max-w-sm'
      onClickBackdrop={
        !isLoading
          ? onClose
          : () => {
              return;
            }
      }
    >
      <Modal.Header className='text-center font-bold'>
        Confirm Payment
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-col items-center justify-center'>
          <Tooltip
            message='Show/Hide PIN'
            className='transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:animate-pulse'
          >
            {showPin ? (
              <CgLockUnlock
                className='text-9xl mb-4 cursor-pointer text-secondary'
                onClick={handleLogoClick}
              />
            ) : (
              <CgLock
                className='text-9xl mb-4 cursor-pointer text-primary'
                onClick={handleLogoClick}
              />
            )}
          </Tooltip>
          <span className='text-center mb-1'>
            Confirm payment with your 6-digit PIN
          </span>
          <span className='text-center text-sm mb-12 font-light'>
            (Temporary block will be placed on your wallet for 3 incorrect
            attempts)
          </span>

          <Form className='flex flex-row items-center gap-4 space-between'>
            {pin.map((p, i) => (
              <input
                key={'input-pin-' + i}
                name={'input-pin-' + i}
                type={showPin ? 'tel' : 'password'}
                inputMode='numeric'
                autoComplete='off'
                placeholder=''
                maxLength={1}
                required
                value={pin[i]}
                onChange={(e) => handlePinChange(e, i)}
                onKeyUp={(e) => handleOnKeyUp(e.code, e.currentTarget.value, i)}
                onFocus={(e) => handleOnFocus(e, i)}
                className='border-b-2 border-base-300 w-8 h-8 md:w-12 md:h-12 text-center text-2xl md:text-4xl p-1 font-medium focus:outline-none'
              />
            ))}
          </Form>
        </div>
      </Modal.Body>
      <Modal.Actions className='flex justify-center mt-12'>
        <Button disabled={isLoading} onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button
          color={isLoading ? 'accent' : 'primary'}
          disabled={pin.find((char) => char === '') === ''}
          onClick={handleSubmit}
          loading={isLoading}
        >
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PaymentWalletPinModal;
