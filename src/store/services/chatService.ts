import { CreateChatRequest } from '../../types/request';
import {
  CreateChatResponse,
  GetChatListResponse,
  GetChatResponse,
} from '../../types/response';
import { baseApi } from '../store';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatList: builder.query<GetChatListResponse, void>({
      query: () => ({
        url: '/chats',
        method: 'GET',
      }),
      providesTags: ['ChatList'],
    }),
    getChat: builder.query<GetChatResponse, string>({
      query: (id) => ({
        url: `/chats/${id}`,
        method: 'GET',
      }),
      providesTags: ['Chat'],
    }),
    createChat: builder.mutation<CreateChatResponse, CreateChatRequest>({
      query: (request) => ({
        url: '/chats',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['ChatList', 'Chat'],
    }),
  }),
});

export const {
  useGetChatListQuery,
  useLazyGetChatListQuery,
  useGetChatQuery,
  useLazyGetChatQuery,
  useCreateChatMutation,
} = chatApi;
