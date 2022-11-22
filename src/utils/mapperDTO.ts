import moment from 'moment';
import {
  LoginRequest,
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
