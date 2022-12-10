import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Form, Input } from 'react-daisyui';
import { useSealabsPayTopupMutation } from '../../store/services/sealabsPayService';
import { toSealabsPayPaymentRequest } from '../../utils/mapperDTO';
import { FormContainer } from '../../components/common/Container';
import { FormErrorText, InputGroup } from '../../components/common/Form';
import { toCardNumber } from '../../utils/convert';

const SealabsPay = () => {
  const userCardNumber = process.env
    .REACT_APP_SEALABS_PAY_CARD_NUMBER as string;
  const [sealabsPayPayment, { isLoading }] = useSealabsPayTopupMutation();

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: Yup.object({
      amount: Yup.number()
        .min(10000, 'Minimum top-up value is Rp 10.0000')
        .required('Please enter an amount'),
    }),
    onSubmit: (values) => {
      sealabsPayPayment(
        toSealabsPayPaymentRequest(userCardNumber, String(values.amount))
      )
        .unwrap()
        .then((res) => {
          if (!res?.data) return;
          const { data: otpURLData } = res;
          console.log(otpURLData);
          window.location.replace(otpURLData);
        })
        .catch((err) => console.error(err));
    },
  });

  return (
    <div className='py-10 w-screen flex flex-col items-center gap-10'>
      <FormContainer className='bg-primary/80 hover:bg-primary/80 hover:shadow-2xl'>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup className='text-base-100'>
            <label htmlFor='cardNumber'>Card Number</label>
            <Input
              className='disabled:bg-transparent disabled:border-none text-4xl'
              id='cardNumber'
              name='cardNumber'
              type='text'
              value={toCardNumber(userCardNumber)}
              disabled
            />
          </InputGroup>
          <InputGroup>
            <Input
              color='primary'
              name='amount'
              onChange={formik.handleChange}
              placeholder='Amount'
              type='number'
              value={formik.values.amount}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <FormErrorText>{formik.errors.amount}</FormErrorText>
            ) : null}
          </InputGroup>

          <Button
            className='mt-2'
            color={!isLoading ? 'secondary' : 'accent'}
            loading={isLoading}
            type='submit'
          >
            Top Up with Sealabs Pay
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default SealabsPay;
