import moment from 'moment';
import { ProductQuery } from '../types/query';
import {
  LoginRequest,
  LoginWithGoogleRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from '../types/request';

export const toLoginRequest = (
  loginCredentials: string,
  password: string
): LoginRequest => ({
  login_credentials: loginCredentials,
  password: password,
});

export const toLoginWithGoogleRequest = (
  googleId: string
): LoginWithGoogleRequest => ({
  google_id: googleId,
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
