import moment from 'moment';
import { ProductQuery, TransactionHistoryQuery } from '../types/query';

import {
  LoginRequest,
  LoginWithGoogleRequest,
  RegisterRequest,
  RegisterWithGoogleRequest,
  UpdateProfileRequest,
} from '../types/request';

export const toLoginRequest = (
  loginCredentials: string,
  password: string
): LoginRequest => ({
  login_credentials: loginCredentials,
  password: password,
});

export const toRegisterRequest = (
  fullName: string,
  username: string,
  email: string,
  password: string,
  phoneNumber: string
): RegisterRequest => ({
  full_name: fullName,
  username,
  email,
  password,
  phone_number: phoneNumber,
  role: '001',
});

export const toLoginWithGoogleRequest = (
  googleId: string,
  fullName: string,
  email: string,
  imageUrl: string
): LoginWithGoogleRequest => ({
  google_id: googleId,
  full_name: fullName,
  email,
  image_url: imageUrl,
});

export const toRegisterWithGoogleRequest = (
  googleId: string,
  fullName: string,
  username: string,
  email: string,
  password: string,
  phoneNumber: string,
  imageUrl: string
): RegisterWithGoogleRequest => ({
  google_id: googleId,
  full_name: fullName,
  username,
  email,
  password,
  phone_number: phoneNumber,
  role: '001',
  image_url: imageUrl,
});

export const toUpdateProfileRequest = (
  fullName: string,
  birthdate: string,
  gender: string
): UpdateProfileRequest => ({
  full_name: fullName,
  birthdate: moment(birthdate).toISOString(),
  gender,
});

export const toUpdateProfileImageRequest = (photo: File) => {
  const formData = new FormData();

  formData.append('photo', photo);

  return formData;
};

export const toUpdateEmailRequest = (email: string) => ({
  email,
});

export const toProductQuery = (query: ProductQuery) => {
  let result = '';

  result += 'search=' + query.search;
  result += '&sort-by=' + query.sortBy;
  result += '&sort=' + query.sort;
  result += '&limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&merchant-id=' + query.merchantID;
  result += '&category-id=' + query.categoryID;
  result += '&price-minimum=' + query.priceMinimum;
  result += '&price-maximum=' + query.priceMaximum;
  result += '&merchant-cities=' + query.merchantCities.join(',');
  result += '&courier-services=' + query.courierServices.join(',');

  return result;
};

export const toTransactionHistoryQuery = (query: TransactionHistoryQuery) => {
  let result = '';

  result += 'limit=' + query.limit;
  result += '&page=' + query.page;
  result += '&search=' + query.search;
  result += '&filter-order-status=' + query.filterOrderStatus;
  result += '&filter-ongoing-order-status=' + query.filterOngoingOrderStatus;
  result +=
    '&filter-start-transaction-date=' + query.filterStartTransactionDate;
  result += '&filter-end-transaction-date=' + query.filterEndTransactionDate;

  return result;
};
