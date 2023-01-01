import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type ChatState = {
  chatBoxShown: boolean;
  toUserID: string | undefined;
};

const slice = createSlice({
  name: 'chat',
  initialState: { chatBoxShown: false, toUserID: undefined } as ChatState,
  reducers: {
    setChatBoxShown: (
      state,
      { payload: { chatBoxShown } }: PayloadAction<{ chatBoxShown: boolean }>
    ) => {
      state.chatBoxShown = chatBoxShown;
    },
    setToUserID: (
      state,
      { payload: { toUserID } }: PayloadAction<{ toUserID: string }>
    ) => {
      state.toUserID = toUserID;
    },
  },
});

export const selectChatBoxShown = (state: RootState) => state.chat.chatBoxShown;
export const selectToUserID = (state: RootState) => state.chat.toUserID;

export const { setChatBoxShown, setToUserID } = slice.actions;

export default slice.reducer;
