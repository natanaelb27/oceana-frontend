import { Button } from 'react-daisyui';
import { useSealabsPayPaymentMutation } from '../../store/services/sealabsPayService';
import { toSealabsPayPaymentRequest } from '../../utils/mapperDTO';

const SealabsPay = () => {
  const [sealabsPayPayment] = useSealabsPayPaymentMutation();

  const handleClick = () => {
    const userCardNumber = process.env
      .REACT_APP_SEALABS_PAY_CARD_NUMBER as string;
    const amount = process.env.REACT_APP_SEALABS_PAY_TEST_AMOUNT as string;
    sealabsPayPayment(toSealabsPayPaymentRequest(userCardNumber, amount))
      .unwrap()
      .then((res) => {
        if (!res?.data) return;
        const { data: otpURLData } = res;
        console.log(otpURLData);
        window.location.replace(otpURLData);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className='py-10 w-screen flex flex-col items-center gap-10'>
      <Button onClick={handleClick}>Top Up with Sealabs Pay</Button>
    </div>
  );
};

export default SealabsPay;
