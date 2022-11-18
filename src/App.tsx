import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import Routes from './routes';
import { useLazyGetProfileQuery } from './store/services/profileService';
import { selectRole, setCredentials } from './store/slices/authSlice';
import { useAppDispatch, useAppSelector } from './store/store';

const App = () => {
  const role = useAppSelector(selectRole);
  const dispatch = useAppDispatch();
  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    // TODO: yarn add js-cookie and add conditional to check for cookies (i.e. accessToken & refreshToken)
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    if (accessToken && refreshToken && !role) {
      getProfile()
        .unwrap()
        .then((response) => {
          const { data: getProfileData } = response;
          dispatch(setCredentials({ role: getProfileData?.role as string }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default App;
