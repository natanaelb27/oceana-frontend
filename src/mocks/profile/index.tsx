import { GetProfileResponse } from '../../types/response';

export const guestProfileMocks: GetProfileResponse = {
  data: null,
  code: 401,
  error: 'Unauthorized',
  message: 'access is denied due to invalid credentials',
  metadata: null,
};

export const buyerProfileMocks: GetProfileResponse = {
  data: {
    id: '1',
    full_name: 'John Doe',
    username: 'john.doe',
    email: 'john.doe@email.com',
    phone_number: '081234567890',
    gender: 'Male',
    photo: 'photo.png',
    birthdate: new Date().toISOString(),
    role: '001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  code: 200,
  error: null,
  message: 'OK',
  metadata: null,
};

export const sellerProfileMocks: GetProfileResponse = {
  data: {
    id: '1',
    full_name: 'Jane Doe',
    username: 'jane.doe',
    email: 'jane.doe@email.com',
    phone_number: '081234567890',
    gender: 'Female',
    photo: 'photo.png',
    birthdate: new Date().toISOString(),
    role: '011',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  code: 200,
  error: null,
  message: 'OK',
  metadata: null,
};
