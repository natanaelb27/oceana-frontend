import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SuccessModal } from '../../../components/common';

const CheckoutSuccessRedirect = () => {
  const successRedirectURL = '/user/purchase';
  const navigate = useNavigate();

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
