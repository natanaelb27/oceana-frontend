import { useFormik } from 'formik';
import { Button, Form, Input, Modal } from 'react-daisyui';
import * as Yup from 'yup';
import {
  LETTERS_ONLY_REGEX,
  NUMBERS_ONLY_REGEX,
} from '../../../constants/regex';
import {
  CARD_NUMBER_LENGTH,
  REGISTER_CHARGE,
} from '../../../constants/sealabsPay';
import { useSealabsPayRegisterOTPMutation } from '../../../store/services/sealabsPayService';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toSealabsPayPaymentRequest } from '../../../utils/mapperDTO';
import { notifyErrorToast } from '../../../utils/toast';
import { FormContainer } from '../../common/Container';
import { FormCTA, FormErrorText, InputGroup } from '../../common/Form';

type SealabsPayRegisterModalProps = {
  open?: boolean;
  onClose: () => void;
};

const SealabsPayRegisterModal = ({
  open,
  onClose,
}: SealabsPayRegisterModalProps) => {
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
        .required('Please enter a name')
        .matches(LETTERS_ONLY_REGEX, 'Name can only contain letters.'),
      cardNumber: Yup.string()
        .required('Please enter your card number')
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
          const { data } = err;
          const { message } = data;
          const messageCapitalized = capitalizeFirstLetter(message);
          handleFailedSealabsPayRegister(messageCapitalized, setFieldValue);
        });
    },
  });

  return (
    <Modal
      className='bg-transparent overflow-hidden shadow-none'
      open={open}
      responsive
      onClickBackdrop={onClose}
    >
      <FormContainer className='bg-primary/80 shadow-none hover:bg-primary/80 hover:shadow-none'>
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
              className='text-xl md:text-2xl font-mono'
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
            **Please make sure your account has Rp. 1 for verification,
            we&apos;ll refund you once it&apos;s done!
          </FormCTA>
        </Form>
      </FormContainer>
    </Modal>
  );
};

export default SealabsPayRegisterModal;
