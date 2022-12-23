import { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Tooltip } from 'react-daisyui';
import { CgClose, CgEye, CgEyeAlt } from 'react-icons/cg';
import { useStepUpPasswordMutation } from '../../../store/services/authPrivateService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { GetWalletDetailsResponse } from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';

type StepUpPasswordModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  nextSetOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const StepUpPasswordModal = ({
  open,
  setOpen,
  nextSetOpen,
}: StepUpPasswordModalProps) => {
  const [stepUpPassword, { isLoading: changeStepUpPasswordIsLoading }] =
    useStepUpPasswordMutation();

  const [showPin, setShowPin] = useState<boolean>(false);

  const stepUpPasswordFormik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Please enter password'),
    }),
    onSubmit: (values) => {
      stepUpPassword({
        password: values.password,
      })
        .unwrap()
        .then(() => {
          notifySuccessToast('You are verified!');
          setOpen(false);
          nextSetOpen(true);
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as GetWalletDetailsResponse;
            notifyErrorToast(response.message);
          }
        });
    },
  });
  const handleStepUpPasswordModalClose = () => {
    setOpen(false);
    stepUpPasswordFormik.setValues({
      password: '',
    });
  };

  const handleLogoClick = () => {
    setShowPin(!showPin);
  };

  const handleCancelClick = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      stepUpPasswordFormik.resetForm({
        values: {
          password: '',
        },
      });
      setShowPin(false);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      responsive
      className='max-w-sm'
      onClickBackdrop={handleStepUpPasswordModalClose}
    >
      <Button
        size='sm'
        shape='circle'
        color='ghost'
        className='absolute right-2 top-2'
        onClick={handleStepUpPasswordModalClose}
      >
        <CgClose className='text-lg' />
      </Button>
      <Modal.Header className='text-center font-bold'>
        Password Verification
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-col items-center justify-center'>
          <Tooltip
            message='Show/Hide Password'
            className='transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:animate-pulse'
          >
            {showPin ? (
              <CgEyeAlt
                className='text-9xl mb-4 cursor-pointer text-secondary'
                onClick={handleLogoClick}
              />
            ) : (
              <CgEye
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
          <Form
            id='stepUpPasswordForm'
            className='grid grid-cols-12 gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              stepUpPasswordFormik.handleSubmit();
            }}
          >
            <div className='col-span-12'>
              <Form.Label title='Password' />
              <Input
                type={showPin ? 'text' : 'password'}
                name='password'
                className='w-full'
                onChange={stepUpPasswordFormik.handleChange}
                value={stepUpPasswordFormik.values.password}
                placeholder='Password'
                required
              />
              {stepUpPasswordFormik.touched.password &&
                stepUpPasswordFormik.errors.password && (
                  <label className='label-text-alt text-error'>
                    {stepUpPasswordFormik.errors.password}
                  </label>
                )}
            </div>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <Button
          color='primary'
          type='submit'
          loading={changeStepUpPasswordIsLoading}
          form='stepUpPasswordForm'
        >
          Verify
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default StepUpPasswordModal;
