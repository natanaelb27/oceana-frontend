import { useFormik } from 'formik';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { Button, Form, Input, Link } from 'react-daisyui';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Tiles } from '../../components/common';
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
} from '../../components/common/Form/style';
import { useRegisterMutation } from '../../store/services/authService';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toRegisterRequest } from '../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import { passwordInUsername } from '../../utils/validation';

const Register = () => {
  const clientId = process.env.REACT_APP_G_API_CLIENT_ID;

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const notifyRegisterSuccess = () =>
    notifySuccessToast('Sign up successful!', true);
  const notifyRegisterFailed = (message: string | null) =>
    notifyErrorToast(message || 'Sign up failed, please try again!');
  const handleRegisterSuccess = () => {
    notifyRegisterSuccess();

    navigate('/login');
  };
  const handleSignInGoogleSuccess = () => {
    notifyRegisterSuccess();

    navigate('/');
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

  const phoneRegex =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
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
        .required('Please enter your email'),
      phoneNumber: Yup.string()
        .matches(phoneRegex, 'Invalid phone number')
        .required('Please enter your phone number'),
      password: Yup.string().required('Please enter your password'),
      confirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: (values, { setFieldValue }) => {
      const { firstName, lastName, username, email, password, phoneNumber } =
        values;
      const fullName =
        capitalizeFirstLetter(firstName.trim().toLocaleLowerCase()) +
        ' ' +
        capitalizeFirstLetter(lastName.trim().toLocaleLowerCase());

      // validate password does not contain username
      if (passwordInUsername(username, password)) {
        notifyRegisterFailed('Password must not contain username');
        return;
      }

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
    <Tiles>
      <AuthContainer>
        <FormContainer className='max-h-[1080px] md:max-w-[580px] md:mt-0'>
          <FormTitleContainer>
            <FormTitle to='/'>Oceana</FormTitle>
          </FormTitleContainer>
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
            <Button
              className='mt-2'
              color={!isLoading ? 'secondary' : 'accent'}
              loading={isLoading}
              type='submit'
            >
              Sign Up
            </Button>
          </Form>
          <FormCTA>
            Already have an account?{' '}
            <Link color='secondary' href='/login'>
              Login
            </Link>
          </FormCTA>
          <StyledDivider>---OR---</StyledDivider>
          <GoogleLogin
            className='w-full flex justify-center'
            clientId={String(clientId)}
            buttonText='Sign in with Google'
            onSuccess={handleSignInGoogleSuccess}
            onFailure={notifyRegisterFailed}
            cookiePolicy='single_host_origin'
          />
          <div className='footer mt-10 gap-y-4 text-base-100'>
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

export default Register;
