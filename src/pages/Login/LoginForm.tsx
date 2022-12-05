import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Input, Link } from 'react-daisyui';
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
import { useLoginMutation } from '../../store/services/authService';
import { toLoginRequest } from '../../utils/mapperDTO';
import { Role } from '../../types/component';
import { setCredentials } from '../../store/slices/authSlice';
import { baseApi, useAppDispatch } from '../../store/store';
import { TAG_TYPES } from '../../constants/tags';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

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

  return (
    <>
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

          {formik.touched.loginCredentials && formik.errors.loginCredentials ? (
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
        onFailure={() =>
          handleFailedLogin('Sign in with Google failed', formik.setFieldValue)
        }
        cookiePolicy='single_host_origin'
      />
      <FormFooter />
    </>
  );
};

export default LoginForm;
