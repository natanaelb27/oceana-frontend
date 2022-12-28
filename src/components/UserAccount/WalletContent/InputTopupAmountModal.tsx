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
        <div className='flex justify-center'>
          <Card className='p-6 mb-3 w-[320px] h-[200px] glass text-base-100 rounded-3xl shadow-lg md:w-[420px] md:h-[240px] bg-primary/80 hover:bg-primary/80 hover:shadow-lg'>
            <Card.Title className='flex justify-between text-4xl'>
              <h1 className='text-2xl md:text-3xl'>
                {sealabsPayDetails.nameOnCard}
              </h1>
              <SealabsPayCardImg className='w-14' />
            </Card.Title>
            <Card.Body className='p-0 pt-6 md:pt-10'>
              <h2 className='text-xl font-mono md:text-3xl'>
                {toCardNumber(sealabsPayDetails.cardNumber, false)}
              </h2>
            </Card.Body>
          </Card>
        </div>
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
