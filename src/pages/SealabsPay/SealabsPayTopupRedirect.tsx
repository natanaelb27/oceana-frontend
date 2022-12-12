import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FailedModal, Loading, SuccessModal } from '../../components/common';
import { TXN_STATUS } from '../../constants/sealabsPay';
import { useWalletTopUpMutation } from '../../store/services/walletService';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toWalletTopUpRequest } from '../../utils/mapperDTO';
import { notifyErrorToast } from '../../utils/toast';

const SealabsPayTopupRedirect = () => {
  const [txnStatus, setTxnStatus] = useState<string>('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [walletTopUp, { isLoading, isError }] = useWalletTopUpMutation();

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
      )
        .unwrap()
        .catch((err) => {
          const { data } = err;
          const { message } = data;
          const messageCapitalized = capitalizeFirstLetter(message);
          notifyErrorToast(messageCapitalized, true);
        });
    }
  }, []);

  if (isLoading) return <Loading isLoading={isLoading} />;

  if (isError || txnStatus === TXN_STATUS.FAILED) {
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

export default SealabsPayTopupRedirect;
