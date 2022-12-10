import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FailedModal, SuccessModal } from '../../components/common';
import { TXN_STATUS } from '../../constants/sealabsPay';
import { useWalletTopUpMutation } from '../../store/services/walletService';
import { toWalletTopUpRequest } from '../../utils/mapperDTO';

const SealabsPayRedirect = () => {
  const [txnStatus, setTxnStatus] = useState<string>('');
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

    setTxnStatus(status);

    if (status === TXN_STATUS.SUCCESS) {
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
      );
    }

    // setTimeout(() => {
    //   navigate('/');
    // }, timeout);
  }, []);

  if (txnStatus === TXN_STATUS.SUCCESS) {
    return (
      <SuccessModal
        open={true}
        title='Transaction Success'
        message='Your transaction has been processed successfully'
        onClose={() => navigate('/')}
        onAccepted={() => navigate('/')}
      />
    );
  } else if (txnStatus === TXN_STATUS.FAILED) {
    return (
      <FailedModal
        open={true}
        title='Transaction Failed'
        message='Oops... Something went wrong, please try again'
        onClose={() => navigate('/')}
        onAccepted={() => navigate('/')}
      />
    );
  }

  return <div>Not Found</div>;
};

export default SealabsPayRedirect;
