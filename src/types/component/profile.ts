export interface Profile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  gender?: string;
  photo?: string;
  birthdate?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePassword {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface RequestPasswordVerificationCode {
  status: boolean;
}

export interface CheckPasswordVerificationCode {
  status: boolean;
}
