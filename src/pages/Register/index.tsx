import { gapi } from 'gapi-script';
import { useEffect, useState } from 'react';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { Tiles } from '../../components/common';
import {
  AuthContainer,
  FormContainer,
} from '../../components/common/Container';
import { STATUS_SEE_OTHER } from '../../constants';
import { useLoginWithGoogleMutation } from '../../store/services/authService';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/store';
import { Role } from '../../types/component';
import { toLoginWithGoogleRequest } from '../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import RegisterForm from './RegisterForm';
import RegisterGoogle from './RegisterGoogle';

const Register = () => {
  const clientId = process.env.REACT_APP_G_API_CLIENT_ID;
  const [step, setStep] = useState<number>(1);
  const nextStep = () => setStep(step + 1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const notifyFailedRegister = (message: string | null) =>
    notifyErrorToast(message || 'Sign up failed, please try again!');
  const handleSuccessRegister = () => {
    notifySuccessToast('Sign up successful!', true);

    navigate('/login');
  };
  const handleSuccessGoogleLogin = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const resGoogleLogin = response as GoogleLoginResponse;
    const basicProfile = resGoogleLogin.getBasicProfile();
    loginWithGoogle(
      toLoginWithGoogleRequest(
        basicProfile.getId(),
        basicProfile.getEmail(),
        basicProfile.getName(),
        basicProfile.getImageUrl()
      )
    )
      .unwrap()
      .then((response) => {
        console.log(response);
        const { data: loginResponseData } = response;
        const { role } = loginResponseData as Role;
        dispatch(setCredentials({ role }));
        navigate('/');
      })
      .catch((err) => {
        switch (err.status) {
          case STATUS_SEE_OTHER:
            nextStep();
            break;

          default:
            notifyErrorToast('Sign in with Google failed');
            break;
        }
      });
  };
  const handleFailedRegister = (
    message: string,
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    setFieldValue('password', '');
    setFieldValue('confirm', '');
    notifyFailedRegister(message);
  };
  const handleRegisterStep = (step: number) => {
    switch (step) {
      case 2:
        return <RegisterGoogle />;
      default:
        return (
          <RegisterForm
            clientId={clientId}
            handleSuccessRegister={handleSuccessRegister}
            handleFailedRegister={handleFailedRegister}
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
        <FormContainer className='max-h-[1080px] md:max-w-[580px] md:mt-0'>
          {handleRegisterStep(step)}
        </FormContainer>
      </AuthContainer>
    </Tiles>
  );
};

export default Register;
