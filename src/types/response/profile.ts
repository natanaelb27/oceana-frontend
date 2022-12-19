import {
  CheckPasswordVerificationCode,
  Metadata,
  Profile,
  RequestPasswordVerificationCode,
  UpdateProfilePassword,
} from '../component';

export type GetProfileResponse = {
  data: Profile | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateProfileResponse = {
  data: Profile | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type UpdateProfilePasswordResponse = {
  data: UpdateProfilePassword | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type RequestPasswordVerificationCodeResponse = {
  data: RequestPasswordVerificationCode | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CheckPasswordVerificationCodeResponse = {
  data: CheckPasswordVerificationCode | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
