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

    // TODO: yarn add js-cookie and add conditional to check for cookies (i.e. accessToken & refreshToken)
    // const accessToken = Cookies.get('access_token');
    // const refreshToken = Cookies.get('refresh_token');

    const accessToken = doesHttpOnlyCookieExist('access_token');
    const refreshToken = doesHttpOnlyCookieExist('refresh_token');

    console.log({ accessToken, refreshToken, role });
    if (accessToken && refreshToken && !role) {
      getProfile()
        .unwrap()
        .then((response) => {
          const { data: getProfileData } = response;
          dispatch(setCredentials({ role: getProfileData?.role as string }));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (refreshToken && !role) {
      // TODO integrate BE: fetch refresh token
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
