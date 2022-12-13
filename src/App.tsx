import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import { useLazyGetProfileQuery } from './store/services/profileService';
import { selectRole, setCredentials } from './store/slices/authSlice';
import { useAppDispatch, useAppSelector } from './store/store';
import { ToastContainer } from 'react-toastify';
import { useLocalStorage } from './hooks';
import { doesHttpOnlyCookieExist } from './utils/auth';
import { Loading } from './components/common';
import Cookies from 'js-cookie';

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const role = useAppSelector(selectRole);
  const dispatch = useAppDispatch();
  const [getProfile] = useLazyGetProfileQuery();

  const [theme] = useLocalStorage<string>(
    'theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    setLoading(true);
    document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);

    const refreshToken = doesHttpOnlyCookieExist('refresh_token');
    const accessTokenVerifier = Cookies.get('access_token_verifier');

    if (accessTokenVerifier === '' && !role) {
      getProfile()
        .unwrap()
        .then((response) => {
          const { data: getProfileData } = response;
          dispatch(
            setCredentials({
              role: getProfileData?.role ? getProfileData.role : null,
            })
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (refreshToken && !role) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <BrowserRouter>
      <Loading isLoading={loading} />
      <Routes />
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
