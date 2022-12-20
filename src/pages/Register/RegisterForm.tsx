import { useFormik } from 'formik';
import { Button, Form, Input, Link } from 'react-daisyui';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import * as Yup from 'yup';
import {
  FormCTA,
  FormErrorText,
  FormFooter,
  FormTitle,
  FormTitleContainer,
  InputGroup,
  StyledDivider,
} from '../../components/common/Form';
import { LETTERS_ONLY_REGEX, PHONE_REGEX } from '../../constants/regex';
import { useRegisterMutation } from '../../store/services/authService';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toRegisterRequest } from '../../utils/mapperDTO';
import { notifyErrorToast } from '../../utils/toast';
import { passwordInUsername } from '../../utils/validation';

type RegisterFormProps = {
  clientId: string | undefined;
  handleSuccessRegister: () => void;
  handleSuccessGoogleLogin: (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => void;
  handleFailedRegister: (
    message: string,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => void;
};

const RegisterForm = ({
  clientId,
  handleSuccessRegister,
  handleSuccessGoogleLogin,
  handleFailedRegister,
}: RegisterFormProps) => {
  const [register, { isLoading }] = useRegisterMutation();

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
      firstName: Yup.string()
        .required('Please enter your first name')
        .matches(LETTERS_ONLY_REGEX, 'Name must be in letters'),
      lastName: Yup.string()
        .required('Please enter your last name')
        .matches(LETTERS_ONLY_REGEX, 'Name must be in letters'),
      username: Yup.string().required('Please enter a username'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Please enter your email'),
      phoneNumber: Yup.string()
        .matches(PHONE_REGEX, 'Invalid phone number')
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
        notifyErrorToast('Password must not contain username');
        return;
      }

      register(
        toRegisterRequest(fullName, username, email, password, phoneNumber)
      )
        .unwrap()
        .then(() => handleSuccessRegister())
        .catch((err) => {
          const { data: errorResponse } = err;
          const { message } = errorResponse;
          const messageCapitalized = capitalizeFirstLetter(message);
          handleFailedRegister(messageCapitalized, setFieldValue);
        });
    },
  });
  return (
    <>
      <FormTitleContainer>
        <FormTitle to='/'>Oceana</FormTitle>
      </FormTitleContainer>
      <Form onSubmit={formik.handleSubmit}>
        <div className='md:flex md:justify-between'>
          <InputGroup className='md:inline'>
            <Input
              className='input-sm md:input-md max-w-[240px]'
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
              className='input-sm md:input-md max-w-[240px]'
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
        onSuccess={handleSuccessGoogleLogin}
        onFailure={() => notifyErrorToast('Sign up failed, please try again!')}
        cookiePolicy='single_host_origin'
      />
      <FormFooter />
    </>
  );
};

export default RegisterForm;
