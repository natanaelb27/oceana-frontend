import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { doesHttpOnlyCookieExist } from '../utils/auth';
import { unsetCredentials } from './slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: 'include',
});

const baseQueryInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const refreshToken = doesHttpOnlyCookieExist('refresh_token');

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
        },
        api,
        extraOptions
      );

      if (!refreshResult.data) {
        api.dispatch(unsetCredentials());
      } else {
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export default baseQueryInterceptor;
