import { LoginRequest, RegisterRequest } from '../types/request';

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
