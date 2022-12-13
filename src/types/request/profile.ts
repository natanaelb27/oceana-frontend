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
