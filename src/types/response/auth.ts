import { Metadata, Profile, Role } from '../component';

export type LoginResponse = {
  data: Role | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type RegisterResponse = {
  data: Profile | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type VerifyResetPasswordResponse = {
  data: {
    status: boolean;
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type ResetPasswordResponse = {
  data: {
    status: boolean;
  } | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
