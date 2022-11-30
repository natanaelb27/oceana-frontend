import { useFormik } from 'formik';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { Button, Form, Input, Link } from 'react-daisyui';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useLoginMutation } from '../../store/services/authService';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/store';
import { Role } from '../../types/component';
import { toLoginRequest } from '../../utils/mapperDTO';
import {
  AuthContainer,
  FormContainer,
} from '../../components/common/Container';
import {
  FormCTA,
  FormErrorText,
  FormTitle,
  FormTitleContainer,
  InputGroup,
  StyledDivider,
} from '../../components/common/Form';
import { notifyErrorToast } from '../../utils/toast';
import { Tiles } from '../../components/common';

const Login = () => {
  const clientId = process.env.REACT_APP_G_API_CLIENT_ID;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const notifyInvalidCredentials = () =>
    notifyErrorToast('Invalid login credentials');

  const handleLoginSuccess = () => {
    navigate('/');
  };
  const handleLoginFailed = (
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    setFieldValue('loginCredentials', '');
    setFieldValue('password', '');
    notifyInvalidCredentials();
  };

  const formik = useFormik({
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
          // TODO: refactor handleLoginSuccess(response: LoginResponse) once sign-in with Google has a BE endpoint
          const { data: loginResponseData } = response;
          const { role } = loginResponseData as Role;
          dispatch(setCredentials({ role }));
          handleLoginSuccess();
        })
        .catch(() => handleLoginFailed(setFieldValue));
    },
  });

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId,
        scope: '',
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  return (
    <Tiles>
      <AuthContainer>
        <FormContainer>
          <FormTitleContainer>
            <FormTitle to='/'>Oceana</FormTitle>
          </FormTitleContainer>
          <Form onSubmit={formik.handleSubmit}>
            <InputGroup>
              <Input
                color='primary'
                name='loginCredentials'
                onChange={formik.handleChange}
                placeholder='Email/Phone/Username'
                type='text'
                value={formik.values.loginCredentials}
              />

              {formik.touched.loginCredentials &&
              formik.errors.loginCredentials ? (
                <FormErrorText>{formik.errors.loginCredentials}</FormErrorText>
              ) : null}
            </InputGroup>
            <InputGroup>
              <Input
                color='primary'
                name='password'
                onChange={formik.handleChange}
                placeholder='Password'
                type='password'
                value={formik.values.password}
              />

              {formik.touched.password && formik.errors.password ? (
                <FormErrorText>{formik.errors.password}</FormErrorText>
              ) : null}
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
            <Link color='secondary' href='/register'>
              Sign Up
            </Link>
          </FormCTA>
          <StyledDivider>---OR---</StyledDivider>
          <GoogleLogin
            className='w-full flex justify-center'
            clientId={String(clientId)}
            buttonText='Sign in with Google'
            onSuccess={handleLoginSuccess}
            onFailure={notifyInvalidCredentials}
            cookiePolicy='single_host_origin'
          />
          <div className='footer mt-12 gap-y-4 text-base-100'>
            <p className='justify-self-center md:justify-self-start'>
              © Oceana {new Date().getFullYear()}. All rights reserved.
            </p>
            <div className='justify-self-center md:place-self-center md:justify-self-end'>
              <div className='grid grid-flow-col gap-4'>
                <a>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    className='fill-current'
                  >
                    <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    className='fill-current'
                  >
                    <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z'></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    className='fill-current'
                  >
                    <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z'></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </FormContainer>
      </AuthContainer>
    </Tiles>
  );
};

export default Login;
