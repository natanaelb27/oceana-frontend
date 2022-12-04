import { useFormik } from 'formik';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { Button, Form, Input, Link } from 'react-daisyui';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  useLoginMutation,
  useLoginWithGoogleMutation,
} from '../../store/services/authService';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/store';
import { Role } from '../../types/component';
import {
  toLoginRequest,
  toLoginWithGoogleRequest,
} from '../../utils/mapperDTO';
import {
  AuthContainer,
  FormContainer,
} from '../../components/common/Container';
import {
  FormCTA,
  FormErrorText,
  FormFooter,
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
  const [loginWithGoogle] = useLoginWithGoogleMutation();

  const notifyInvalidCredentials = () =>
    notifyErrorToast('Invalid login credentials');

  const handleSuccessGoogleLogin = (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const resGoogleLogin = res as GoogleLoginResponse;
    const basicProfile = resGoogleLogin.getBasicProfile();
    loginWithGoogle(
      toLoginWithGoogleRequest(
        basicProfile.getId(),
        basicProfile.getEmail(),
        basicProfile.getName(),
        basicProfile.getImageUrl()
      )
    )
      .unwrap()
      .then((response) => {
        const { data: loginResponseData } = response;
        const { role } = loginResponseData as Role;
        dispatch(setCredentials({ role }));
        navigate('/');
      })
      .catch(() => notifyErrorToast('Sign in with Google failed'));
    navigate('/');
  };
  const handleFailedLogin = (
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
          const { data: loginResponseData } = response;
          const { role } = loginResponseData as Role;
          dispatch(setCredentials({ role }));
          navigate('/');
        })
        .catch(() => handleFailedLogin(setFieldValue));
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
            onSuccess={handleSuccessGoogleLogin}
            onFailure={notifyInvalidCredentials}
            cookiePolicy='single_host_origin'
          />
          <FormFooter />
        </FormContainer>
      </AuthContainer>
    </Tiles>
  );
};

export default Login;
