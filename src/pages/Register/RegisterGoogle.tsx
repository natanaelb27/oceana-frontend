import { useFormik } from 'formik';
import { Button, Form, Input } from 'react-daisyui';
import * as Yup from 'yup';
import {
  FormErrorText,
  FormFooter,
  FormTitle,
  FormTitleContainer,
  InputGroup,
} from '../../components/common/Form';
import { PHONE_REGEX } from '../../constants/regex';
import { useRegisterWithGoogleMutation } from '../../store/services/authService';
import { selectRegisterGoogleState } from '../../store/slices/registerGoogleSlice';
import { useAppSelector } from '../../store/store';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toRegisterWithGoogleRequest } from '../../utils/mapperDTO';
import { notifyErrorToast } from '../../utils/toast';
import { passwordInUsername } from '../../utils/validation';

type RegisterGoogleProps = {
  handleSuccessRegister: () => void;
  handleFailedRegister: (
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void,
    message?: string
  ) => void;
};

const RegisterGoogle = ({
  handleSuccessRegister,
  handleFailedRegister,
}: RegisterGoogleProps) => {
  const [registerWithGoogle, { isLoading }] = useRegisterWithGoogleMutation();
  const registerGoogleState = useAppSelector(selectRegisterGoogleState);

  const formik = useFormik({
    initialValues: {
      username: '',
      phoneNumber: '',
      password: '',
      confirm: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Please enter a username'),
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
      const { username, password, phoneNumber } = values;
      // validate password does not contain username
      if (passwordInUsername(username, password)) {
        notifyErrorToast('Password must not contain username');
        return;
      }
      const { googleId, fullName, email, imageUrl } = registerGoogleState;
      registerWithGoogle(
        toRegisterWithGoogleRequest(
          googleId,
          fullName,
          username,
          email,
          password,
          phoneNumber,
          imageUrl
        )
      )
        .unwrap()
        .then(() => handleSuccessRegister())
        .catch((err) => {
          const { data: errorResponse } = err;
          const { message } = errorResponse;
          const messageCapitalized = capitalizeFirstLetter(message);
          handleFailedRegister(setFieldValue, messageCapitalized);
        })
        .finally(() => window.location.reload());
    },
  });

  return (
    <>
      <FormTitleContainer>
        <FormTitle className='hover:translate-y-0 cursor-default'>
          Oceana
        </FormTitle>
      </FormTitleContainer>
      <Form onSubmit={formik.handleSubmit}>
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
      <FormFooter />
    </>
  );
};

export default RegisterGoogle;
