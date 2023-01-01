export interface ChatList {
  to_user_id: string;
  to_user_photo: string;
  to_user_full_name: string;
  to_merchant_id: number;
  to_merchant_name: string;
  to_merchant_photo: string;
  last_message: string;
  created_at: string;
}

export interface ChatList {
  to_user_id: string;
  to_user_photo: string;
  to_user_full_name: string;
  to_merchant_id: number;
  to_merchant_name: string;
  to_merchant_photo: string;
  last_message: string;
  created_at: string;
}

export interface Chat {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  media_url: string;
  created_at: string;
}

export interface ChatInfo {
  to_user_id: string;
  to_user_photo: string;
  to_user_full_name: string;
  to_merchant_id: number;
  to_merchant_name: string;
  to_merchant_photo: string;
  created_at: string;
  chats: Chat[];
}
