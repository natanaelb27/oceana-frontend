import { useFormik } from 'formik';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { Button, Form, Input, Link } from 'react-daisyui';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { useLoginMutation } from '../../store/services/authService';
import { toLoginRequest } from '../../utils/mapperDTO';
import {
  FormContainer,
  FormErrorText,
  FormTitle,
  InputGroup,
  LoginContainer,
} from './style';

const Login = () => {
  const clientId = process.env.REACT_APP_G_API_CLIENT_ID;
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const notifyLoginSuccess = () =>
    toast.success('Login successful! Redirecting...', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  const notifyInvalidCredentials = () =>
    toast.error('Invalid login credentials', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
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
        .then(() => {
          notifyLoginSuccess();
          setTimeout(() => {
            navigate('/');
          }, 3000);
        })
        .catch(() => {
          setFieldValue('loginCredentials', '');
          setFieldValue('password', '');
          notifyInvalidCredentials();
        });
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
  });

  return (
    <LoginContainer>
      <ToastContainer />
      <FormContainer>
        <FormTitle>Login</FormTitle>
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
          <Button className='mt-2' color='primary' type='submit'>
            Login
          </Button>
        </Form>
        <p className='mt-2 text-base-100'>
          Need an account?{' '}
          <Link color='secondary' href='/register'>
            Sign Up
          </Link>
        </p>
        <span className='my-4 block text-xl text-center text-slate-400'>
          ---OR---
        </span>
        <GoogleLogin
          className='w-full flex justify-center'
          clientId={String(clientId)}
          buttonText='Sign in with Google'
          onSuccess={notifyLoginSuccess}
          onFailure={notifyInvalidCredentials}
          cookiePolicy='single_host_origin'
          isSignedIn={true}
        />
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
