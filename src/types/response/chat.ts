import { ChatInfo, ChatList, Metadata } from '../component';

export type GetChatListResponse = {
  data: ChatList[] | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type GetChatResponse = {
  data: ChatInfo | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};

export type CreateChatResponse = {
  data: boolean | null;
  code: number;
  error: string | null;
  message: string;
  metadata: Metadata | null;
};
