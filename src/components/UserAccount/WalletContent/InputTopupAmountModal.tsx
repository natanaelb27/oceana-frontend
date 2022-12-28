import { useFormik } from 'formik';
import { Button, Card, Form, Input, Modal } from 'react-daisyui';
import * as Yup from 'yup';
import { useSealabsPayTopupOTPMutation } from '../../../store/services/sealabsPayService';
import { toCardNumber } from '../../../utils/convert';
import { toSealabsPayPaymentRequest } from '../../../utils/mapperDTO';
import { SealabsPayCardImg } from '../../common';
import { FormErrorText } from '../../common/Form';

type SealabsPayDetails = {
  nameOnCard: string;
  cardNumber: string;
};

type InputTopupAmountModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sealabsPayDetails: SealabsPayDetails;
};

const InputTopupAmountModal = ({
  open,
  setOpen,
  sealabsPayDetails,
}: InputTopupAmountModalProps) => {
  useSealabsPayTopupOTPMutation();
  const [sealabsPayPayment, { isLoading }] = useSealabsPayTopupOTPMutation();
  const inputTopUpAmountFormik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number().required('Please enter amount'),
    }),
    onSubmit: (values) => {
      sealabsPayPayment(
        toSealabsPayPaymentRequest(
          sealabsPayDetails.nameOnCard,
          sealabsPayDetails.cardNumber,
          String(values.amount)
        )
      )
        .unwrap()
        .then((res) => {
          if (!res?.data) return;
          const { data: otpURLData } = res;
          window.location.replace(otpURLData);
        })
        .catch((err) => console.error(err));
    },
  });

  const handleCloseInputTopupAmountModal = () => {
    setOpen(false);
    inputTopUpAmountFormik.setValues({
      amount: '',
    });
  };
  return (
    <Modal
      open={open}
      responsive
      onClickBackdrop={handleCloseInputTopupAmountModal}
    >
      <Modal.Header className='text-center font-bold'>
        Top Up Wallet
      </Modal.Header>
      <Modal.Body>
        <Card className='bg-primary hover:bg-primary glass'>
          <Card.Body>
            <SealabsPayCardImg />
            <div className='text-white font-mono font-semibold text-lg'>
              {toCardNumber(sealabsPayDetails.cardNumber)}
            </div>
          </Card.Body>
        </Card>
        <Form
          id='inputTopupAmountForm'
          onSubmit={(e) => {
            e.preventDefault();
            inputTopUpAmountFormik.handleSubmit();
          }}
        >
          <Form.Label title='Amount' />
          <Input
            placeholder='Amount'
            name='amount'
            type='number'
            onChange={inputTopUpAmountFormik.handleChange}
            value={inputTopUpAmountFormik.values.amount}
          />
          {inputTopUpAmountFormik.touched.amount &&
          inputTopUpAmountFormik.errors.amount ? (
            <FormErrorText className='md:text-sm'>
              {inputTopUpAmountFormik.errors.amount}
            </FormErrorText>
          ) : null}
        </Form>
      </Modal.Body>
      <Modal.Actions>
        <Button
          color='primary'
          type='submit'
          loading={isLoading}
          form='inputTopupAmountForm'
        >
          Top Up
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default InputTopupAmountModal;
