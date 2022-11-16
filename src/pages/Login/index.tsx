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

const Login = () => {
  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required('Please enter your username'),
      password: Yup.string().required('Please enter your password'),
    }),
    onSubmit: (values) => console.log(values),
  });
  return (
    <LoginContainer>
      <FormContainer>
        <FormTitle>Login</FormTitle>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup>
            <Input
              color='primary'
              name='username'
              onChange={formik.handleChange}
              placeholder='Email/Phone/Username'
              type='text'
              value={formik.values.username}
            />

            {formik.touched.username && formik.errors.username ? (
              <FormErrorText>{formik.errors.username}</FormErrorText>
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
