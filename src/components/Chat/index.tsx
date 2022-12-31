import { HiChatAlt2 } from 'react-icons/hi';
import * as S from './style';
import { useState } from 'react';
import ClassNames from '../../utils/classnames';
import { Button, Divider, Textarea, Badge } from 'react-daisyui';
import { BiDownArrow, BiX } from 'react-icons/bi';
import { AiFillDownSquare, AiOutlineDownSquare } from 'react-icons/ai';
import { Image } from '../common';
import ChatBubble from './ChatBubble';
import { CHAT_POSITION } from '../../constants/chat';

const Chat = () => {
  // const { data: getChatListData, isLoading: getChatListIsLoading } =
  //   useGetChatListQuery();
  // const [getChat] = useLazyGetChatQuery();
  // const [createChat, { isLoading: createChatIsLoading }] =
  //   useCreateChatMutation();

  const [chatBoxShown, setChatBoxShown] = useState(false);

  const toggleChatBoxShown = () => {
    setChatBoxShown(!chatBoxShown);
  };

  const handleChatListItemOnClick = () => {
    console.log('handleChatListItemOnClick');
  };

  return (
    <S.ChatContainer>
      <S.ChatBoxContainer
        className={ClassNames([
          'duration-500',
          !chatBoxShown ? '' : 'translate-y-[100%]',
        ])}
      >
        <div className='flex flex-col w-full h-full'>
          {/* section: header */}
          <div className='flex items-center justify-between p-2'>
            <span className='flex items-center gap-2 text-primary font-semibold'>
              <HiChatAlt2 className='text-xl' /> OceaChat
            </span>
            <button
              className='text-base-content/70'
              onClick={toggleChatBoxShown}
            >
              <AiOutlineDownSquare className='text-xl' />
            </button>
          </div>
          <div className='border-b-[0.5px] border-base-content/20 ' />
          {/* section: body */}
          <div className='flex h-fit overflow-auto'>
            {/* section: chat */}
            <div className='w-full h-full overflow-auto'>
              <div className='flex flex-col h-full justify-between'>
                <div className='flex flex-row p-2 gap-2 items-center'>
                  <Image
                    className='h-12 w-12 rounded-full'
                    src='https://people.sea.com/media/190797/RRRqeyAV1659088665.jpg'
                  />
                  <div className='text-sm'>Azmi Adhani (Azmi Shop)</div>
                </div>
                <div className='border-b-[0.5px] border-base-content/20 ' />
                <div className='overflow-y-auto h-full p-2 flex flex-col-reverse gap-2'>
                  {new Array(50).fill(undefined).map((_, i) => (
                    <ChatBubble
                      key={'message-' + i}
                      position={
                        i % 2 ? CHAT_POSITION.RIGHT : CHAT_POSITION.LEFT
                      }
                    >
                      {'Test' + i}
                    </ChatBubble>
                  ))}
                </div>
                <div className='border-b-[0.5px] border-base-content/20 ' />
                <textarea placeholder='Say something...' className='h-20 p-2' />
              </div>
            </div>
            <div className='border-r-[0.5px] border-base-content/20 ' />
            {/* section: chat list */}
            <div className='w-full h-full overflow-auto  p-2'>
              {new Array(50).fill(undefined).map((_, i) => (
                <div
                  key={'chat-list-' + i}
                  className='flex items-center gap-4 p-2 cursor-pointer'
                  onClick={handleChatListItemOnClick}
                >
                  <Image
                    className='h-12 w-12 rounded-full'
                    src='https://people.sea.com/media/190797/RRRqeyAV1659088665.jpg'
                  />
                  <div className='flex flex-col'>
                    <span className='text-accent-content font-semibold w-52 truncate'>
                      Azmi Adhani (Azmi Shop) Azmi Adhani (Azmi Shop)
                    </span>
                    <span className='text-accent-content/70 w-52 truncate'>
                      Hi can we do this and that and this
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </S.ChatBoxContainer>
      <S.ChatButton
        onClick={toggleChatBoxShown}
        className={ClassNames([
          'duration-500',
          chatBoxShown ? '' : 'translate-y-[100%]',
        ])}
      >
        <span className='flex items-center justify-center'>
          <HiChatAlt2 className='text-xl' /> Chat
        </span>
      </S.ChatButton>
    </S.ChatContainer>
  );
};

export default Chat;
