import { useState } from 'react';
import { Button } from 'react-daisyui';
import { useSealabsPayPaymentMutation } from '../../store/services/sealabsPayService';
import { toSealabsPayPaymentRequest } from '../../utils/mapperDTO';

const SealabsPay = () => {
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [sealabsPayPayment] = useSealabsPayPaymentMutation();
  const handleClick = () => {
    const cardNumber = process.env.REACT_APP_SEALABS_PAY_CARD_NUMBER as string;
    const amount = process.env.REACT_APP_SEALABS_PAY_TEST_AMOUNT as string;
    sealabsPayPayment(toSealabsPayPaymentRequest(cardNumber, amount))
      .unwrap()
      .then((res) => {
        const { data: otpURL } = res;
        console.log(otpURL);
        setRedirectUrl(otpURL as string);
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className='py-10 w-screen flex flex-col items-center gap-10'>
      <Button onClick={handleClick}>Top Up with Sealabs Pay</Button>
      {redirectUrl && (
        <iframe
          width='390'
          height='844'
          src={redirectUrl}
          title='YouTube video player'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default SealabsPay;
