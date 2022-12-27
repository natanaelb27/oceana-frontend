import { UploadMediaRequest } from '../../types/request';
import { UploadMediaResponse } from '../../types/response/media';
import { baseApi } from '../store';

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<UploadMediaResponse, UploadMediaRequest>({
      query: ({ formData: request }) => ({
        url: '/medias/upload',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useUploadMediaMutation } = mediaApi;
