import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FailedModal, Loading, SuccessModal } from '../../components/common';
import { TXN_STATUS } from '../../constants/sealabsPay';
import { useUsePayCartWithSealabsPaySuccessMutation } from '../../store/services/cartService';
import {
  selectTransactionID,
  unsetTransactionID,
} from '../../store/slices/checkoutSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toPayCartWithSealabsPaySuccessRequest } from '../../utils/mapperDTO';
import { notifyErrorToast } from '../../utils/toast';

const SealabsPayPaymentRedirect = () => {
  const successRedirectURL = '/user/purchase';
  const failedRedirectURL = '/cart';
  const [payCartWithSealabsPaySuccess, { isLoading, isError }] =
    useUsePayCartWithSealabsPaySuccessMutation();
  const [txnStatus, setTxnStatus] = useState<string>('');
  const transactionID = useAppSelector(selectTransactionID);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cardNumber = searchParams.get('card_number') || '';
    const txnId = searchParams.get('txn_id') || '';
    const status = searchParams.get('status') || '';
    const signature = searchParams.get('signature') || '';

    setTxnStatus(status);

    if (status === TXN_STATUS.SUCCESS) {
      const req = toPayCartWithSealabsPaySuccessRequest(
        transactionID,
        txnId,
        cardNumber,
        signature
      );
      console.log(req);
      payCartWithSealabsPaySuccess(req)
        .unwrap()
        .catch((err) => {
          const { data } = err;
          const { message } = data;
          const messageCapitalized = capitalizeFirstLetter(message);
          notifyErrorToast(messageCapitalized, true);
        })
        .finally(() => dispatch(unsetTransactionID()));
    }
  }, []);

  if (isLoading) return <Loading isLoading={isLoading} />;

  if (isError || txnStatus === TXN_STATUS.FAILED) {
    return (
      <FailedModal
        open={true}
        title='Checkout Failed'
        message='Oops... Something went wrong, please try again'
        btnMessage='Back to Cart'
        onClose={() => navigate(failedRedirectURL)}
        onAccepted={() => navigate(failedRedirectURL)}
      />
    );
  }

  return (
    <SuccessModal
      open={true}
      title='Checkout Success'
      message='Click to see your order details'
      btnMessage='See Purchases'
      onClose={() => navigate(successRedirectURL)}
      onAccepted={() => navigate(successRedirectURL)}
    />
  );
};

export default SealabsPayPaymentRedirect;
