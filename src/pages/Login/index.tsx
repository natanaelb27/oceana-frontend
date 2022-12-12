import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogleMutation } from '../../store/services/authService';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/store';
import { Role } from '../../types/component';
import { toLoginWithGoogleRequest } from '../../utils/mapperDTO';
import {
  AuthContainer,
  FormContainer,
} from '../../components/common/Container';
import { notifyErrorToast } from '../../utils/toast';
import { Tiles } from '../../components/common';
import { STATUS_SEE_OTHER } from '../../constants';
import { setRegisterGoogleState } from '../../store/slices/registerGoogleSlice';
import RegisterGoogle from '../Register/RegisterGoogle';
import LoginForm from './LoginForm';

const Login = () => {
  const clientId = process.env.REACT_APP_G_API_CLIENT_ID;
  const [step, setStep] = useState<number>(1);
  const nextStep = () => setStep(step + 1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginWithGoogle] = useLoginWithGoogleMutation();

  const handleSuccessLogin = () => navigate('/');
  const handleFailedLogin = (
    message: string,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    setFieldValue('loginCredentials', '');
    setFieldValue('password', '');
    notifyErrorToast(message, true);
  };
  const handleSuccessGoogleLogin = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const resGoogleLogin = response as GoogleLoginResponse;
    const basicProfile = resGoogleLogin.getBasicProfile();
    const googleId = basicProfile.getId();
    const email = basicProfile.getEmail();
    const fullName = basicProfile.getName();
    const imageUrl = basicProfile.getImageUrl();
    loginWithGoogle(
      toLoginWithGoogleRequest(googleId, fullName, email, imageUrl)
    )
      .unwrap()
      .then((response) => {
        const { data: loginResponseData } = response;
        const { role } = loginResponseData as Role;
        dispatch(setCredentials({ role }));
        navigate('/');
      })
      .catch((err) => {
        switch (err.status) {
          case STATUS_SEE_OTHER:
            dispatch(
              setRegisterGoogleState({
                googleId,
                email,
                fullName,
                imageUrl,
              })
            );
            nextStep();
            break;

          default:
            notifyErrorToast('Sign in with Google failed');
            break;
        }
      });
  };

  const handleLoginStep = (step: number) => {
    switch (step) {
      case 2:
        return (
          <RegisterGoogle
            handleSuccessRegister={handleSuccessLogin}
            handleFailedRegister={handleFailedLogin}
          />
        );

      default:
        return (
          <LoginForm
            clientId={clientId}
            handleSuccessLogin={handleSuccessLogin}
            handleFailedLogin={handleFailedLogin}
            handleSuccessGoogleLogin={handleSuccessGoogleLogin}
          />
        );
    }
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId,
        scope: '',
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  return (
    <Tiles>
      <AuthContainer>
        <FormContainer>{handleLoginStep(step)}</FormContainer>
      </AuthContainer>
    </Tiles>
  );
};

export default Login;
