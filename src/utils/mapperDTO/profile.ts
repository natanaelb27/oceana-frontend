import moment from 'moment';

import { UpdateProfileRequest } from '../../types/request';

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
