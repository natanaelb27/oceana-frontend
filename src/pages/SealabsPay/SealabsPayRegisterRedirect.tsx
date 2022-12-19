import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FailedModal, Loading, SuccessModal } from '../../components/common';
import { TXN_STATUS } from '../../constants/sealabsPay';
import { useRegisterSealabsPayMutation } from '../../store/services/sealabsPayService';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toSealabsPayRegisterRequest } from '../../utils/mapperDTO';
import { notifyErrorToast } from '../../utils/toast';

const SealabsPayRegisterRedirect = () => {
  const redirectURL = '/user/account/sealabs-pay';
  const [txnStatus, setTxnStatus] = useState<string>('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sealabsPayRegister, { isLoading, isError }] =
    useRegisterSealabsPayMutation();

  useEffect(() => {
    const cardNumber = searchParams.get('card_number') || '';
    const nameOnCard = searchParams.get('name_on_card') || '';
    const status = searchParams.get('status') || '';
    const signature = searchParams.get('signature') || '';
    const txnId = searchParams.get('txn_id') || '';

    setTxnStatus(status);

    if (status === TXN_STATUS.SUCCESS) {
      sealabsPayRegister(
        toSealabsPayRegisterRequest(nameOnCard, cardNumber, txnId, signature)
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
        title='Failed'
        message='Oops... Something went wrong, please try again'
        onClose={() => navigate(redirectURL)}
        onAccepted={() => navigate(redirectURL)}
      />
    );
  }

  return (
    <SuccessModal
      open={true}
      title='Success'
      message='Your Sealabs Pay account has been registered'
      onClose={() => navigate(redirectURL)}
      onAccepted={() => navigate(redirectURL)}
    />
  );
};

export default SealabsPayRegisterRedirect;
