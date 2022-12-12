import { useFormik } from 'formik';
import { Button, Form, Input } from 'react-daisyui';
import * as Yup from 'yup';
import { FormContainer } from '../../../components/common/Container';
import {
  FormCTA,
  FormErrorText,
  FormTitle,
  InputGroup,
} from '../../../components/common/Form';
import {
  LETTERS_ONLY_REGEX,
  NUMBERS_ONLY_REGEX,
} from '../../../constants/regex';
import {
  CARD_NUMBER_LENGTH,
  REGISTER_CHARGE,
} from '../../../constants/sealabsPay';
import { STATUS_CONFLICT } from '../../../constants/statusCodes';
import { useSealabsPayRegisterOTPMutation } from '../../../store/services/sealabsPayService';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toSealabsPayPaymentRequest } from '../../../utils/mapperDTO';
import { notifyErrorToast } from '../../../utils/toast';

const BuyerCheckout = () => {
  const [sealabsPayRegister, { isLoading }] =
    useSealabsPayRegisterOTPMutation();

  const handleFailedSealabsPayRegister = (
    message: string,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    setFieldValue('nameOnCard', '');
    setFieldValue('cardNumber', '');
    notifyErrorToast(message, true);
  };

  const formik = useFormik({
    initialValues: { nameOnCard: '', cardNumber: '' },
    validationSchema: Yup.object({
      nameOnCard: Yup.string()
        .required('Name on card must not be empty')
        .matches(LETTERS_ONLY_REGEX, 'Name can only contain letters.'),
      cardNumber: Yup.string()
        .required('Card number must not be empty')
        .matches(NUMBERS_ONLY_REGEX, 'Must be only digits')
        .min(CARD_NUMBER_LENGTH, `Must be exactly ${CARD_NUMBER_LENGTH} digits`)
        .max(
          CARD_NUMBER_LENGTH,
          `Must be exactly ${CARD_NUMBER_LENGTH} digits`
        ),
    }),
    onSubmit: (values, { setFieldValue }) => {
      sealabsPayRegister(
        toSealabsPayPaymentRequest(
          values.nameOnCard,
          values.cardNumber,
          REGISTER_CHARGE
        )
      )
        .unwrap()
        .then((res) => {
          if (!res?.data) return;
          const { data: otpURLData } = res;
          window.location.replace(otpURLData);
        })
        .catch((err) => {
          const { data, status } = err;
          const { message } = data;
          const messageCapitalized = capitalizeFirstLetter(message);
          switch (status) {
            case STATUS_CONFLICT:
              handleFailedSealabsPayRegister(messageCapitalized, setFieldValue);
              break;

            default:
              handleFailedSealabsPayRegister(
                'Invalid card number',
                setFieldValue
              );
              break;
          }
        });
    },
  });

  return (
    <div className='py-10 w-screen flex flex-col items-center gap-10'>
      <FormTitle className='text-base-content hover:translate-y-0 cursor-default'>
        Sealabs Pay
      </FormTitle>
      <FormContainer className='bg-primary/80 hover:bg-primary/80 hover:shadow-2xl'>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup>
            <Input
              color='primary'
              name='nameOnCard'
              onChange={formik.handleChange}
              placeholder='Name on Card'
              type='text'
              value={formik.values.nameOnCard}
            />
            {formik.touched.nameOnCard && formik.errors.nameOnCard ? (
              <FormErrorText>{formik.errors.nameOnCard}</FormErrorText>
            ) : null}
          </InputGroup>
          <InputGroup>
            <Input
              className='text-2xl md:text-3xl'
              id='cardNumber'
              name='cardNumber'
              onChange={formik.handleChange}
              placeholder='Card Number'
              size='lg'
              type='text'
              value={formik.values.cardNumber}
            />
            {formik.touched.cardNumber && formik.errors.cardNumber ? (
              <FormErrorText>{formik.errors.cardNumber}</FormErrorText>
            ) : null}
          </InputGroup>
          <Button
            className='mt-2'
            color={!isLoading ? 'secondary' : 'accent'}
            loading={isLoading}
            type='submit'
          >
            Register
          </Button>
          <FormCTA>
            **Your account will be charged Rp. 1 for verification, and refunded
            once verification is complete
          </FormCTA>
        </Form>
      </FormContainer>
    </div>
  );
};

export default BuyerCheckout;
