export type UpdateProfileRequest = {
  full_name?: string;
  gender?: string;
  birthdate?: string;
};

export type UpdateProfileEmailRequest = {
  email: string;
};

export type UpdateProfileUsernameRequest = {
  username: string;
};

export type UpdateProfilePasswordRequest = {
  password: string;
  verification_code: string;
};

export type CheckPasswordVerificationCodeRequest = {
  verification_code: string;
};

export type DeleteBatchFavoriteProducts = {
  product_ids: number[];
};
