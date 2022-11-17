import { Form, Input, Button, Link } from 'react-daisyui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  LoginContainer,
  FormContainer,
  FormTitle,
  FormErrorText,
  InputGroup,
} from './style';
import { useLoginMutation } from '../../store/services/authService';
import { toLoginRequest } from '../../utils/mapperDTO';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
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
      containerId: 'success',
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
      containerId: 'error',
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
  return (
    <LoginContainer>
      <ToastContainer containerId='success' />
      <ToastContainer containerId='error' />
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
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
