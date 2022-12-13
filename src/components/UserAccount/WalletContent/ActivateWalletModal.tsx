import { ChangeEvent, useState } from 'react';
import { Button, Form, Modal, Tooltip } from 'react-daisyui';
import { CgLock, CgLockUnlock } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { useActivateWalletMutation } from '../../../store/services/walletService';

import { WalletDetails } from '../../../types/component';
import { GetWalletDetailsResponse } from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';

type ActivateWalletModalProps = {
  data: WalletDetails;
};

const ActivateWalletModal = ({ data }: ActivateWalletModalProps) => {
  const [activateWallet, { isLoading: activateWalletIsLoading }] =
    useActivateWalletMutation();
  const navigate = useNavigate();

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
    navigate('/user/account/profile', { replace: true });
  };

  const handleActivateClick = () => {
    if (pin.find((char) => char === '') === '') {
      return;
    }

    activateWallet({
      pin: pin.join(''),
      pin_confirmation: pin.join(''),
    })
      .then(() => notifySuccessToast('Yay! Your wallet has been activated'))
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as GetWalletDetailsResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  return (
    <Modal open={!data.is_active} responsive>
      <Modal.Header className='text-center font-bold'>
        Activate Wallet
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
            Set up your PIN to activate your wallet
          </span>
          <span className='text-center text-sm mb-12 font-light'>
            (Did you know there is a secret in the icon above?)
          </span>
          <Form className='flex flex-row items-center gap-4 space-between'>
            <input
              type={showPin ? 'tel' : 'password'}
              inputMode='numeric'
              autoComplete='off'
              placeholder=''
              maxLength={1}
              required
              value={pin[0]}
              onChange={(e) => handlePinChange(e, 0)}
              className='border-b-2 border-base-300 w-8 h-8 md:w-12 md:h-12 text-center text-2xl md:text-4xl p-1 font-medium focus:outline-none'
            />
            <input
              type={showPin ? 'tel' : 'password'}
              inputMode='numeric'
              autoComplete='off'
              placeholder=''
              maxLength={1}
              required
              value={pin[1]}
              onChange={(e) => handlePinChange(e, 1)}
              className='border-b-2 border-base-300 w-8 h-8 md:w-12 md:h-12 text-center text-2xl md:text-4xl p-1 font-medium focus:outline-none'
            />
            <input
              type={showPin ? 'tel' : 'password'}
              inputMode='numeric'
              autoComplete='off'
              placeholder=''
              maxLength={1}
              required
              value={pin[2]}
              onChange={(e) => handlePinChange(e, 2)}
              className='border-b-2 border-base-300 w-8 h-8 md:w-12 md:h-12 text-center text-2xl md:text-4xl p-1 font-medium focus:outline-none'
            />
            <input
              type={showPin ? 'tel' : 'password'}
              inputMode='numeric'
              autoComplete='off'
              placeholder=''
              maxLength={1}
              required
              value={pin[3]}
              onChange={(e) => handlePinChange(e, 3)}
              className='border-b-2 border-base-300 w-8 h-8 md:w-12 md:h-12 text-center text-2xl md:text-4xl p-1 font-medium focus:outline-none'
            />
            <input
              type={showPin ? 'tel' : 'password'}
              inputMode='numeric'
              autoComplete='off'
              placeholder=''
              maxLength={1}
              required
              value={pin[4]}
              onChange={(e) => handlePinChange(e, 4)}
              className='border-b-2 border-base-300 w-8 h-8 md:w-12 md:h-12 text-center text-2xl md:text-4xl p-1 font-medium focus:outline-none'
            />
            <input
              type={showPin ? 'tel' : 'password'}
              inputMode='numeric'
              autoComplete='off'
              placeholder=''
              maxLength={1}
              required
              value={pin[5]}
              onChange={(e) => handlePinChange(e, 5)}
              className='border-b-2 border-base-300 w-8 h-8 md:w-12 md:h-12 text-center text-2xl md:text-4xl p-1 font-medium focus:outline-none'
            />
          </Form>
        </div>
      </Modal.Body>
      <Modal.Actions className='flex justify-center mt-12'>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <Button
          color='primary'
          disabled={pin.find((char) => char === '') === ''}
          loading={activateWalletIsLoading}
          onClick={handleActivateClick}
        >
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ActivateWalletModal;
