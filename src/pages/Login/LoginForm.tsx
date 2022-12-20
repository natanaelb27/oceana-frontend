import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Input, Modal } from 'react-daisyui';
import { Link } from 'react-router-dom';
import { CgClose } from 'react-icons/cg';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import {
  FormCTA,
  FormErrorText,
  FormFooter,
  FormTitle,
  FormTitleContainer,
  InputGroup,
  StyledDivider,
} from '../../components/common/Form';
import {
  useLoginMutation,
  useVerifyResetPasswordMutation,
} from '../../store/services/authService';
import { toLoginRequest } from '../../utils/mapperDTO';
import { Role } from '../../types/component';
import { setCredentials } from '../../store/slices/authSlice';
import { baseApi, useAppDispatch } from '../../store/store';
import { TAG_TYPES } from '../../constants/tags';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { VerifyResetPasswordResponse } from '../../types/response';

type LoginFormProps = {
  clientId: string | undefined;
  handleSuccessLogin: () => void;
  handleSuccessGoogleLogin: (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => void;
  handleFailedLogin: (
    message: string,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => void;
};

const LoginForm = ({
  clientId,
  handleSuccessLogin,
  handleSuccessGoogleLogin,
  handleFailedLogin,
}: LoginFormProps) => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [openResetPasswordModal, setOpenResetPasswordModal] =
    useState<boolean>(false);
  const [verifyResetPassword, { isLoading: verifyResetPasswordIsLoading }] =
    useVerifyResetPasswordMutation();

  const loginFormik = useFormik({
    initialValues: { loginCredentials: '', password: '' },
    validationSchema: Yup.object({
      loginCredentials: Yup.string().required(
        'Please enter your login credential'
      ),
      password: Yup.string().required('Please enter your password'),
    }),
    onSubmit: (values, { setFieldValue }) => {
      login(toLoginRequest(values.loginCredentials, values.password))
        .unwrap()
        .then((response) => {
          const { data: loginResponseData } = response;
          const { role } = loginResponseData as Role;
          dispatch(setCredentials({ role }));
          dispatch(baseApi.util.invalidateTags(TAG_TYPES));
          handleSuccessLogin();
        })
        .catch((err) => {
          const { data: errorResponse } = err;
          const { message } = errorResponse;
          const messageCapitalized = capitalizeFirstLetter(message);
          handleFailedLogin(messageCapitalized, setFieldValue);
        });
    },
  });

  const resetPasswordFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid address')
        .required('Please enter your email'),
    }),
    onSubmit: (values) => {
      setOpenResetPasswordModal(true);
      verifyResetPassword({ email: values.email })
        .unwrap()
        .then((res) => {
          if (res.data?.status) {
            notifySuccessToast('Verification link has been sent to your email');
            handleModalClose();
          } else {
            notifyErrorToast('Something went wrong, please try again');
          }
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as VerifyResetPasswordResponse;

            notifyErrorToast(response.message);
          }
        });
    },
  });

  const handleForgetPasswordClick = () => {
    setOpenResetPasswordModal(true);
  };

  const handleModalClose = () => {
    setOpenResetPasswordModal(false);
  };

  return (
    <>
      <FormTitleContainer>
        <FormTitle to='/'>Oceana</FormTitle>
      </FormTitleContainer>
      <Form onSubmit={loginFormik.handleSubmit}>
        <InputGroup>
          <Input
            color='primary'
            name='loginCredentials'
            onChange={loginFormik.handleChange}
            placeholder='Email/Phone/Username'
            type='text'
            value={loginFormik.values.loginCredentials}
          />

          {loginFormik.touched.loginCredentials &&
          loginFormik.errors.loginCredentials ? (
            <FormErrorText>{loginFormik.errors.loginCredentials}</FormErrorText>
          ) : null}
        </InputGroup>
        <InputGroup>
          <Input
            color='primary'
            name='password'
            onChange={loginFormik.handleChange}
            placeholder='Password'
            type='password'
            value={loginFormik.values.password}
          />

          {loginFormik.touched.password && loginFormik.errors.password ? (
            <FormErrorText>{loginFormik.errors.password}</FormErrorText>
          ) : null}
          <a
            onClick={handleForgetPasswordClick}
            className='text-sm link link-accent no-underline font-medium mt-2.5'
          >
            Forget your password?
          </a>
        </InputGroup>
        <Button
          className='mt-2'
          color={!isLoading ? 'secondary' : 'accent'}
          loading={isLoading}
          type='submit'
        >
          Login
        </Button>
      </Form>
      <FormCTA>
        Need an account?{' '}
        <Link
          to='/register'
          className='link link-accent no-underline font-medium'
        >
          Sign Up
        </Link>
      </FormCTA>
      <StyledDivider>---OR---</StyledDivider>
      <GoogleLogin
        className='w-full flex justify-center'
        clientId={String(clientId)}
        buttonText='Sign in with Google'
        onSuccess={handleSuccessGoogleLogin}
        onFailure={() =>
          handleFailedLogin(
            'Sign in with Google failed',
            loginFormik.setFieldValue
          )
        }
        cookiePolicy='single_host_origin'
      />
      <FormFooter />
      <Modal
        open={openResetPasswordModal}
        className='md:max-w-2xl'
        onClickBackdrop={handleModalClose}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            resetPasswordFormik.handleSubmit();
          }}
        >
          <Button
            size='sm'
            shape='circle'
            color='ghost'
            className='absolute right-2 top-2'
            onClick={handleModalClose}
          >
            <CgClose className='text-lg' />
          </Button>
          <Modal.Header className='text-center'>Reset Password</Modal.Header>
          <Modal.Body>
            <Input
              name='email'
              placeholder='Email'
              type='email'
              value={resetPasswordFormik.values.email}
              onChange={resetPasswordFormik.handleChange}
              className='w-full'
            />
            {resetPasswordFormik.touched.email &&
            resetPasswordFormik.errors.email ? (
              <FormErrorText>{resetPasswordFormik.errors.email}</FormErrorText>
            ) : null}
          </Modal.Body>
          <Modal.Actions>
            <Button
              className='w-full'
              type='submit'
              loading={verifyResetPasswordIsLoading}
            >
              Confirm
            </Button>
          </Modal.Actions>
        </Form>
      </Modal>
    </>
  );
};

export default LoginForm;
