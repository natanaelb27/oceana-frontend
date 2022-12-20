import {
  LoginRequest,
  LoginWithGoogleRequest,
  RegisterRequest,
  RegisterWithGoogleRequest,
} from '../../types/request';

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
