import { Metadata, Profile, Role, User } from './component';

export type GetRolesResponse = {
  data: User[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

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
