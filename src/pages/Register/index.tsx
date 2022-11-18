import { useFormik } from 'formik';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { Button, Form, Input, Link } from 'react-daisyui';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import {
  AuthContainer,
  GlassContainer,
} from '../../components/common/Container';
import {
  FormErrorText,
  FormTitle,
  InputGroup,
} from '../../components/common/Form/style';
import { useRegisterMutation } from '../../store/services/authService';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toRegisterRequest } from '../../utils/mapperDTO';

const Register = () => {
  const clientId = process.env.REACT_APP_G_API_CLIENT_ID;
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const notifyRegisterSuccess = () =>
    toast.success('Sign up successful! Redirecting...', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  const notifyRegisterFailed = (message: string | null) =>
    toast.error(message || 'Sign up failed, please try again!', {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  const handleRegisterSuccess = () => {
    notifyRegisterSuccess();

    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };
  const handleRegisterFailed = (
    message: string,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    setFieldValue('password', '');
    setFieldValue('confirm', '');
    notifyRegisterFailed(message);
  };
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirm: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Please enter your first name'),
      lastName: Yup.string().required('Please enter your last name'),
      username: Yup.string().required('Please enter a username'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Please enter a username'),
      phoneNumber: Yup.string().required('Please enter your phone number'),
      password: Yup.string().required('Please enter your password'),
      confirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: (values, { setFieldValue }) => {
      const { firstName, lastName, username, email, password, phoneNumber } =
        values;
      const fullName = firstName.trim() + ' ' + lastName.trim();

      register(
        toRegisterRequest(fullName, username, email, password, phoneNumber)
      )
        .unwrap()
        .then(() => handleRegisterSuccess())
        .catch((err) => {
          console.log(err);
          const { data: errorResponse } = err;
          const { message } = errorResponse;
          const messageCapitalized = capitalizeFirstLetter(message);
          handleRegisterFailed(messageCapitalized, setFieldValue);
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
  }, []);

  return (
    <AuthContainer>
      <ToastContainer />
      <GlassContainer className='max-h-[1080px] max-w-[720px] md:mt-0'>
        <FormTitle>Sign Up</FormTitle>
        <Form onSubmit={formik.handleSubmit}>
          <div className='md:flex md:justify-between'>
            <InputGroup className='md:inline'>
              <Input
                className='input-sm md:input-md'
                color='primary'
                name='firstName'
                onChange={formik.handleChange}
                placeholder='First Name'
                type='text'
                value={formik.values.firstName}
              />

              {formik.touched.firstName && formik.errors.firstName ? (
                <FormErrorText>{formik.errors.firstName}</FormErrorText>
              ) : null}
            </InputGroup>
            <InputGroup className='md:inline'>
              <Input
                className='input-sm md:input-md'
                color='primary'
                name='lastName'
                onChange={formik.handleChange}
                placeholder='Last Name'
                type='text'
                value={formik.values.lastName}
              />

              {formik.touched.lastName && formik.errors.lastName ? (
                <FormErrorText>{formik.errors.lastName}</FormErrorText>
              ) : null}
            </InputGroup>
          </div>
          <InputGroup>
            <Input
              className='input-sm md:input-md'
              color='primary'
              name='username'
              onChange={formik.handleChange}
              placeholder='Username'
              type='text'
              value={formik.values.username}
            />

            {formik.touched.username && formik.errors.username ? (
              <FormErrorText>{formik.errors.username}</FormErrorText>
            ) : null}
          </InputGroup>
          <InputGroup>
            <Input
              className='input-sm md:input-md'
              color='primary'
              name='email'
              onChange={formik.handleChange}
              placeholder='Email'
              type='text'
              value={formik.values.email}
            />

            {formik.touched.email && formik.errors.email ? (
              <FormErrorText>{formik.errors.email}</FormErrorText>
            ) : null}
          </InputGroup>
          <InputGroup>
            <Input
              className='input-sm md:input-md'
              color='primary'
              name='phoneNumber'
              onChange={formik.handleChange}
              placeholder='Phone Number'
              type='text'
              value={formik.values.phoneNumber}
            />

            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <FormErrorText>{formik.errors.phoneNumber}</FormErrorText>
            ) : null}
          </InputGroup>
          <InputGroup>
            <Input
              className='input-sm md:input-md'
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
          <InputGroup>
            <Input
              className='input-sm md:input-md'
              color='primary'
              name='confirm'
              onChange={formik.handleChange}
              placeholder='Confirm Password'
              type='password'
              value={formik.values.confirm}
            />

            {formik.touched.confirm && formik.errors.confirm ? (
              <FormErrorText>{formik.errors.confirm}</FormErrorText>
            ) : null}
          </InputGroup>
          <Button className='mt-2' color='primary' type='submit'>
            Sign Up
          </Button>
        </Form>
        <p className='mt-2 text-base-100'>
          Already have an account?{' '}
          <Link color='secondary' href='/login'>
            Login
          </Link>
        </p>
        <span className='my-4 block text-xl text-center text-slate-400'>
          ---OR---
        </span>
        <GoogleLogin
          className='w-full flex justify-center'
          clientId={String(clientId)}
          buttonText='Sign in with Google'
          onSuccess={notifyRegisterSuccess}
          onFailure={notifyRegisterFailed}
          cookiePolicy='single_host_origin'
          isSignedIn={true}
        />
      </GlassContainer>
    </AuthContainer>
  );
};

export default Register;
