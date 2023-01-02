import { ChangeEvent, useState } from 'react';
import { Button, Form, Input, InputGroup, Modal } from 'react-daisyui';
import { CgClose, CgPassword } from 'react-icons/cg';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import {
  useCheckVerificationCodeMutation,
  useRequestVerificationCodeMutation,
  useUpdateProfilePasswordMutation,
} from '../../../store/services/profileService';
import {
  CheckPasswordVerificationCodeResponse,
  RequestPasswordVerificationCodeResponse,
} from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { validatePassword } from '../../../utils/validation';

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const [updateProfilePassword, { isLoading: updateProfilePasswordIsLoading }] =
    useUpdateProfilePasswordMutation();
  const [requestVerificationCode] = useRequestVerificationCodeMutation();
  const [checkVerificationCode, { isLoading: checkVerificationCodeIsLoading }] =
    useCheckVerificationCodeMutation();

  const [verificationCode, setVerificationCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const handleVerificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleDisplayPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const handleResendCodeClick = () => {
    requestVerificationCode()
      .unwrap()
      .then(() => {
        notifySuccessToast('Verification code has been sent to your email');
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as RequestPasswordVerificationCodeResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const handleConfirmVerificationClick = () => {
    if (verificationCode.length !== 6) {
      return;
    }

    checkVerificationCode({ verification_code: verificationCode })
      .unwrap()
      .then(() => {
        notifySuccessToast('Yay! You have been verificated!');
        setVerified(true);
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as CheckPasswordVerificationCodeResponse;

          notifyErrorToast(response.message);
          setVerified(false);
        }
      });
  };

  const handleChangePasswordClick = () => {
    if (
      verificationCode.length !== 6 ||
      password === '' ||
      password !== confirmPassword
    ) {
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation[0]) {
      notifyErrorToast(passwordValidation[1]);
      return;
    }

    updateProfilePassword({
      password: password,
      verification_code: verificationCode,
    })
      .unwrap()
      .then(() => {
        notifySuccessToast('Yay! You have successfully changed your password!');
        handleClose();
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as CheckPasswordVerificationCodeResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  const handleClose = () => {
    setVerificationCode('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setVerified(false);
    onClose();
  };

  if (!verified) {
    return (
      <Modal
        open={open}
        onClickBackdrop={handleClose}
        responsive
        className='max-w-sm'
      >
        <Button
          size='sm'
          shape='circle'
          color='ghost'
          className='absolute right-2 top-2'
          onClick={handleClose}
        >
          <CgClose className='text-lg' />
        </Button>
        <Modal.Header className='text-center font-bold mb-4'>
          Change Password
        </Modal.Header>
        <Modal.Body>
          <Form
            id='editPasswordForm'
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <CgPassword className='mx-auto text-9xl text-secondary hover:animate-pulse' />
            <span className='text-center mb-8'>
              Didn&apos;t receive verification code?{' '}
              <a
                className='link no-underline font-medium text-primary'
                onClick={handleResendCodeClick}
              >
                Resend code
              </a>
            </span>
            <Input
              className='border-l-0 border-r-0 border-t-0 border-b-2 rounded-none text-center font-medium text-4xl tracking-widest focus:outline-none max-w-xs mx-auto mb-4'
              type='text'
              required
              minLength={6}
              maxLength={6}
              value={verificationCode}
              onChange={handleVerificationCodeChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Actions className='flex justify-center'>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            color='primary'
            type='submit'
            loading={checkVerificationCodeIsLoading}
            onClick={handleConfirmVerificationClick}
            disabled={verificationCode.length !== 6}
          >
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClickBackdrop={handleClose}
      responsive
      className='max-w-sm'
    >
      <Button
        size='sm'
        shape='circle'
        color='ghost'
        className='absolute right-2 top-2'
        onClick={handleClose}
      >
        <CgClose className='text-lg' />
      </Button>
      <Modal.Header className='text-center font-bold mb-4'>
        Change Password
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CgPassword className='mx-auto text-9xl text-secondary hover:animate-pulse' />
          <span className='text-center mb-8'>
            Make sure your new password is unique
          </span>
          <InputGroup className='mx-auto md:px-8 mb-4'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password...'
              className='w-full'
              value={password}
              onChange={handlePasswordChange}
            />
            {showPassword ? (
              <Button onClick={handleDisplayPasswordClick}>
                <HiEyeOff className='text-neutral-content' />
              </Button>
            ) : (
              <Button onClick={handleDisplayPasswordClick}>
                <HiEye className='text-neutral-content' />
              </Button>
            )}
          </InputGroup>
          <InputGroup className='mx-auto md:px-8'>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Confirm password...'
              className='w-full'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {showPassword ? (
              <Button onClick={handleDisplayPasswordClick}>
                <HiEyeOff className='text-neutral-content' />
              </Button>
            ) : (
              <Button onClick={handleDisplayPasswordClick}>
                <HiEye className='text-neutral-content' />
              </Button>
            )}
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Actions className='flex justify-center'>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          color='primary'
          type='submit'
          loading={updateProfilePasswordIsLoading}
          onClick={handleChangePasswordClick}
          disabled={
            verificationCode.length !== 6 ||
            password === '' ||
            password !== confirmPassword
          }
        >
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ChangePasswordModal;
