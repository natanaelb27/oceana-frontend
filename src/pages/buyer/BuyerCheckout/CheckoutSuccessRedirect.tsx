import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuccessModal } from '../../../components/common';
import {
  unsetCheckout,
  unsetTransactionID,
} from '../../../store/slices/checkoutSlice';
import { useAppDispatch } from '../../../store/store';

const CheckoutSuccessRedirect = () => {
  const successRedirectURL = '/user/purchase';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(unsetCheckout());
    dispatch(unsetTransactionID());
  }, []);

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

export default CheckoutSuccessRedirect;
