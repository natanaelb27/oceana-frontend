import { useFormik } from 'formik';
import { useState } from 'react';
import { Button, Form, Input } from 'react-daisyui';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
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
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void,
    message?: string
  ) => void;
};

const RegisterForm = ({
  clientId,
  handleSuccessRegister,
  handleSuccessGoogleLogin,
  handleFailedRegister,
}: RegisterFormProps) => {
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
      password: Yup.string()
        .min(8, 'Too short, minimum 8 characters')
        .matches(/[a-z]+/, 'Must contain at least one lowercase character')
        .matches(/[A-Z]+/, 'Must contain at least one uppercase character')
        .matches(/[@$!%*#?&]+/, 'Must contain at least one special character')
        .matches(/\d+/, 'Must contain at least one number')
        .required('Please enter your password'),
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
          handleFailedRegister(setFieldValue, messageCapitalized);
        });
    },
  });
  return (
    <>
      <FormTitleContainer>
        <FormTitle to='/'>Oceana</FormTitle>
      </FormTitleContainer>
      <Form onSubmit={formik.handleSubmit}>
        <div className='flex justify-between'>
          <InputGroup className='md:inline'>
            <Input
              className='input-sm max-w-[140px] md:input-md md:max-w-[240px]'
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
              className='input-sm max-w-[140px] md:input-md md:max-w-[240px]'
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
        <div className='md:flex md:justify-between'>
          <InputGroup className='relative'>
            <Input
              className='input-sm md:input-md md:max-w-[240px]'
              color='primary'
              name='password'
              onChange={formik.handleChange}
              placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
            />
            <Button
              className='absolute top-0 right-0 md:top-2 md:right-5'
              color='ghost'
              shape='circle'
              size='sm'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye className='text-primary' />
              )}
            </Button>

            {formik.touched.password && formik.errors.password ? (
              <FormErrorText>{formik.errors.password}</FormErrorText>
            ) : null}
          </InputGroup>
          <InputGroup>
            <Input
              className='input-sm md:input-md md:max-w-[240px]'
              color='primary'
              name='confirm'
              onChange={formik.handleChange}
              placeholder='Confirm Password'
              type={showPassword ? 'text' : 'password'}
              value={formik.values.confirm}
            />

            {formik.touched.confirm && formik.errors.confirm ? (
              <FormErrorText>{formik.errors.confirm}</FormErrorText>
            ) : null}
          </InputGroup>
        </div>
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
        <Link to='/login' className='link link-accent no-underline font-medium'>
          Login
        </Link>
      </FormCTA>
      <StyledDivider>---OR---</StyledDivider>
      <GoogleLogin
        className='w-full flex justify-center'
        clientId={String(clientId)}
        buttonText='Sign in with Google'
        onSuccess={handleSuccessGoogleLogin}
        onFailure={() => handleFailedRegister(formik.setFieldValue)}
        cookiePolicy='single_host_origin'
      />
      <FormFooter />
    </>
  );
};

export default RegisterForm;
