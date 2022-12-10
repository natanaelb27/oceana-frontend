import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SuccessModal } from '../../components/common';
import { useWalletTopUpMutation } from '../../store/services/walletService';
import { toWalletTopUpRequest } from '../../utils/mapperDTO';

const SealabsPaySuccess = () => {
  const timeout = 3000;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [walletTopUp] = useWalletTopUpMutation();

  useEffect(() => {
    const cardNumber = searchParams.get('card_number') || '';
    const txnId = searchParams.get('txn_id') || '';
    const amount = searchParams.get('amount') || '';
    const merchantCode = searchParams.get('merchant_code') || '';
    const status = searchParams.get('status') || '';
    const message = searchParams.get('message') || '';
    const signature = searchParams.get('signature') || '';

    console.log(txnId);
    console.log(amount);
    console.log(merchantCode);
    console.log(status);
    console.log(message);
    console.log(signature);
    console.log(cardNumber);

    setTimeout(() => {
      walletTopUp(
        toWalletTopUpRequest(
          cardNumber,
          txnId,
          amount,
          merchantCode,
          status,
          message,
          signature
        )
      )
        .unwrap()
        .then((res) => {
          console.log(res);
          console.log(cardNumber);
        })
        .catch((err) => console.error(err));
    }, timeout);

    // setTimeout(() => {
    //   navigate('/');
    // }, timeout);
  }, []);

  return (
    <SuccessModal
      open={true}
      title='Transaction Success'
      message='Your transaction has been processed successfully'
      onClose={() => navigate('/')}
      onAccepted={() => navigate('/')}
    />
  );
};

export default SealabsPaySuccess;
