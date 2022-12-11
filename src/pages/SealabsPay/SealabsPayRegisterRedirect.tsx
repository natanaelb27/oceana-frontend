import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FailedModal, Loading, SuccessModal } from '../../components/common';
import { TXN_STATUS } from '../../constants/sealabsPay';
import { useSealabsPayRegisterMutation } from '../../store/services/sealabsPayService';
import { toSealabsPayRegisterRequest } from '../../utils/mapperDTO';

const SealabsPayRegisterRedirect = () => {
  const [txnStatus, setTxnStatus] = useState<string>('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sealabsPayRegister, { isLoading }] = useSealabsPayRegisterMutation();

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
      );
    }
  }, []);

  if (txnStatus === TXN_STATUS.SUCCESS) {
    return (
      <SuccessModal
        open={true}
        title='Success'
        message='Your Sealabs Pay account has been registered'
        onClose={() => navigate('/')}
        onAccepted={() => navigate('/')}
      />
    );
  } else if (txnStatus === TXN_STATUS.FAILED) {
    return (
      <FailedModal
        open={true}
        title='Failed'
        message='Oops... Something went wrong, please try again'
        onClose={() => navigate('/')}
        onAccepted={() => navigate('/')}
      />
    );
  }

  return <Loading isLoading={isLoading} />;
};

export default SealabsPayRegisterRedirect;
