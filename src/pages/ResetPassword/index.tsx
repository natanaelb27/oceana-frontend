import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Form, Input, InputGroup } from 'react-daisyui';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Tiles } from '../../components/common';
import {
  AuthContainer,
  FormContainer,
} from '../../components/common/Container';
import { FormErrorText } from '../../components/common/Form';
import { useResetPasswordMutation } from '../../store/services/authService';
import { ResetPasswordResponse } from '../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';

const ResetPassword = () => {
  const [resetPassword, { isLoading: resetPasswordIsLoading }] =
    useResetPasswordMutation();
  const [resetPasswordID, setResetPasswordID] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setResetPasswordID(params?.resetPasswordID ? params.resetPasswordID : null);
  }, [params]);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().required('Please enter your password'),
      confirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: (values) => {
      if (!resetPasswordID) {
        return;
      }

      const { password } = values;

      resetPassword({ id: resetPasswordID, request: { password: password } })
        .unwrap()
        .then((res) => {
          if (res.data?.status) {
            notifySuccessToast(
              'Yay! You have successfully reset your password!'
            );
            navigate('/login');
          } else {
            notifyErrorToast('Something went wrong, please try again');
          }
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as ResetPasswordResponse;

            notifyErrorToast(response.message);
          }
        });
    },
  });

  const handleDisplayPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const handleDisplayConfirmPasswordClick = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Tiles>
      <AuthContainer>
        <FormContainer>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit(e);
            }}
            className='flex gap-2'
          >
            <div className='w-full flex justify-center mb-8'>
              <Link
                to='/'
                className='rounded-xl p-4 text-center text-5xl text-primary-content font-bold md:text-6xl transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none'
              >
                Oceana
              </Link>
            </div>
            <InputGroup>
              <Input
                name='password'
                type={showPassword ? 'text' : 'password'}
                className='w-full'
                placeholder='Password'
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {showPassword ? (
                <Button type='button' onClick={handleDisplayPasswordClick}>
                  <HiEyeOff className='text-neutral-content' />
                </Button>
              ) : (
                <Button type='button' onClick={handleDisplayPasswordClick}>
                  <HiEye className='text-neutral-content' />
                </Button>
              )}
            </InputGroup>
            {formik.touched.password && formik.errors.password ? (
              <FormErrorText>{formik.errors.password}</FormErrorText>
            ) : null}
            <InputGroup>
              <Input
                name='confirm'
                type={showConfirmPassword ? 'text' : 'password'}
                className='w-full'
                placeholder='Confirm Password'
                value={formik.values.confirm}
                onChange={formik.handleChange}
              />
              {showConfirmPassword ? (
                <Button
                  type='button'
                  onClick={handleDisplayConfirmPasswordClick}
                >
                  <HiEyeOff className='text-neutral-content' />
                </Button>
              ) : (
                <Button
                  type='button'
                  onClick={handleDisplayConfirmPasswordClick}
                >
                  <HiEye className='text-neutral-content' />
                </Button>
              )}
            </InputGroup>
            {formik.touched.confirm && formik.errors.confirm ? (
              <FormErrorText>{formik.errors.confirm}</FormErrorText>
            ) : null}
            <Button
              type='submit'
              className='mt-8 w-full'
              color='secondary'
              loading={resetPasswordIsLoading}
            >
              Confirm
            </Button>
          </Form>
        </FormContainer>
      </AuthContainer>
    </Tiles>
  );
};

export default ResetPassword;
