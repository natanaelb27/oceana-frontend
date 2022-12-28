import { StepUpPasswordRequest } from '../../types/request';
import { baseApi } from '../store';

export const autPrivateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    stepUpPassword: builder.mutation<void, StepUpPasswordRequest>({
      query: (request) => ({
        url: '/auth/step-up/password',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useStepUpPasswordMutation } = autPrivateApi;
