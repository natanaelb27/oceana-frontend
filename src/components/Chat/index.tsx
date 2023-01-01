import { useFormik } from 'formik';
import { Resizable } from 're-resizable';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-daisyui';
import { AiOutlineDownSquare } from 'react-icons/ai';
import { BiPaperPlane } from 'react-icons/bi';
import { BsChatDotsFill, BsShop } from 'react-icons/bs';
import { CgSpinner } from 'react-icons/cg';
import { HiChatAlt2 } from 'react-icons/hi';
import Zoom from 'react-medium-image-zoom';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { CHAT_POSITION } from '../../constants/chat';
import useInterval from '../../hooks/Interval/index';
import {
  useCreateChatMutation,
  useLazyGetChatListQuery,
  useLazyGetChatQuery,
} from '../../store/services/chatService';
import { selectRole } from '../../store/slices/authSlice';
import {
  selectChatBoxShown,
  selectToUserID,
  setChatBoxShown,
  setToUserID,
} from '../../store/slices/chatSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { CreateChatRequest } from '../../types/request/chat';
import { CreateChatResponse } from '../../types/response';
import ClassNames from '../../utils/classnames';
import { notifyErrorToast } from '../../utils/toast';
import { Image } from '../common';
import Skeleton from '../common/Loading/Skeleton';
import ChatBubble from './ChatBubble';
import * as S from './style';
const Chat = () => {
  const [
    getChatList,
    { data: getChatListData, isLoading: getChatListIsLoading },
  ] = useLazyGetChatListQuery();
  const [getChat, { data: getChatData, isLoading: getChatIsLoading }] =
    useLazyGetChatQuery();
  const [createChat, { isLoading: createChatIsLoading }] =
    useCreateChatMutation();

  const dispatch = useAppDispatch();
  const chatBoxShown = useAppSelector(selectChatBoxShown);
  const toUserID = useAppSelector(selectToUserID);
  const role = useAppSelector(selectRole);

  const chatFormik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: Yup.object({
      // id: Yup.number().required('Please enter id'),
      message: Yup.string().required('Please enter message'),
    }),
    onSubmit: (values) => {
      createChat({
        media_url: '',
        message: values.message,
        to_user_id: toUserID,
      } as CreateChatRequest)
        .unwrap()
        .then(() => {
          chatFormik.setFieldValue('message', '');
        })
        .catch((err) => {
          if ('data' in err) {
            const response = err.data as CreateChatResponse;
            notifyErrorToast(response.message);
          } else {
            notifyErrorToast('there is something wrong please try again');
          }
        });
      return;
    },
  });

  useState(false);
  const [chatUpdateInterval, setChatUpdateInterval] = useState(30000);
  const [currentToUserID, setCurrentToUserID] = useState<string | undefined>(
    undefined
  );

  const toggleChatBoxShown = () => {
    dispatch(setChatBoxShown({ chatBoxShown: !chatBoxShown }));
  };

  const handleChatListItemOnClick = (id: string) => {
    dispatch(setToUserID({ toUserID: id }));
  };

  const handleMessageOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      chatFormik.handleSubmit();
    }
  };

  useEffect(() => {
    if (toUserID !== undefined) {
      getChat(toUserID);
    }
  }, [toUserID]);

  useEffect(() => {
    if (chatBoxShown === true) {
      // request interval is 5 seconds
      setChatUpdateInterval(5000);
    } else {
      // set interval request to 30 seconds
      setChatUpdateInterval(30000);
    }
  }, [chatBoxShown]);

  const scrollToLastMessage = () => {
    setTimeout(() => {
      const element = document.getElementById('lastMessage');
      if (element) {
        // 👇 Will scroll smoothly to the top of the next section
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        scrollToLastMessage();
      }
    }, 1000);
  };

  useEffect(() => {
    if (currentToUserID) {
      scrollToLastMessage();
    }
    setCurrentToUserID(getChatData?.data?.to_user_id);
  }, [getChatData]);

  useInterval(() => {
    if (role === null) {
      return;
    }
    getChatList();
    if (toUserID !== undefined) {
      getChat(toUserID);
    }
  }, chatUpdateInterval);

  const [middleResized, setMiddleResized] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: 2000,
    height: 2000,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    console.log(windowSize);
  }, [windowSize]);

  useEffect(() => {
    getChatList();
    window.addEventListener('resize', handleResize);
    handleResize();
  }, []);

  const isMobileView = windowSize.width < 550 || windowSize.height < 800;

  return (
    <>
      <S.ChatContainer
        className={ClassNames([
          'duration-500',
          chatBoxShown ? 'z-90 fixed' : 'z-0 bottom-[-100%]',
        ])}
      >
        <Resizable
          defaultSize={{
            height: '60vh',
            width: '50vh',
          }}
          size={
            isMobileView
              ? {
                  height: '80vh',
                  width: '80vw',
                }
              : undefined
          }
          minWidth='20vw'
          maxWidth='80vw'
          minHeight='30vh'
          maxHeight='90vh'
          enable={{
            topLeft: true,
            left: true,
            top: true,
          }}
        >
          <S.ChatBoxContainer>
            <div className='flex flex-col w-full h-full'>
              {/* section: header */}
              <div className='flex items-center justify-between p-2'>
                <span className='flex items-center gap-2 text-primary font-semibold'>
                  <HiChatAlt2 className='text-xl' /> OceaTalk
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
              <div className='flex h-full overflow-y-auto'>
                {/* section: chat */}
                <div className='w-full h-full overflow-y-auto'>
                  {/* section: chat with someon */}
                  {toUserID !== undefined &&
                  getChatData !== undefined &&
                  // if switching to other chats
                  toUserID === currentToUserID ? (
                    <div className='flex flex-col h-full justify-between'>
                      {/* section: profile */}
                      <div className='flex flex-row p-2 gap-2 items-center'>
                        <div className='aspect-square'>
                          <Zoom>
                            <Image
                              className='w-12 rounded-full'
                              src={getChatData?.data?.to_user_photo}
                            />
                          </Zoom>
                        </div>
                        <div className='flex flex-col'>
                          <div className='text-sm'>
                            {getChatData?.data?.to_user_full_name}
                          </div>
                          {getChatData?.data?.to_merchant_id !== 0 && (
                            <Link
                              className='text-primary underline'
                              to={'/shops/' + getChatData?.data?.to_merchant_id}
                            >
                              <div className='text-sm flex flex-row gap-1 items-center'>
                                <BsShop className='text-base' />
                                {getChatData?.data?.to_merchant_name}
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className='border-b-[0.5px] border-base-content/20 ' />
                      {/* section: chat */}
                      <div className='overflow-auto h-full'>
                        <div className='h-fit flex flex-col-reverse gap-2 p-2 md:p-4'>
                          {getChatData?.data?.chats.map((valueChat, i) => (
                            <React.Fragment key={'message-' + i}>
                              {i === 0 && <div id='lastMessage' />}
                              <ChatBubble
                                position={
                                  getChatData.data?.to_user_id ===
                                  valueChat.to_user_id
                                    ? CHAT_POSITION.RIGHT
                                    : CHAT_POSITION.LEFT
                                }
                                datetime={valueChat.created_at}
                              >
                                {valueChat.message}
                              </ChatBubble>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div className='border-b-[0.5px] border-base-content/20 ' />
                      {/* section: chat input*/}
                      <Form
                        id='createChatForm'
                        className='flex flex-row'
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!createChatIsLoading) {
                            chatFormik.handleSubmit();
                          }
                        }}
                      >
                        <textarea
                          name='message'
                          placeholder='Say something...'
                          className='h-20 p-2 w-full min-h-12 max-h-52'
                          value={chatFormik.values.message}
                          onChange={chatFormik.handleChange}
                          onKeyDown={handleMessageOnKeyDown}
                        />
                        <button
                          type='submit'
                          className={ClassNames([
                            'p-2 w-20 bg-base-300 flex items-center justify-center text-[1.5rem] transition-all',
                            createChatIsLoading ? 'bg-base-content/60' : '',
                          ])}
                          form='createChatForm'
                          disabled={createChatIsLoading ? true : false}
                        >
                          {createChatIsLoading ? (
                            <CgSpinner className='animate-spin' />
                          ) : (
                            <BiPaperPlane />
                          )}
                        </button>
                      </Form>
                    </div>
                  ) : (
                    <div className='h-full flex items-center justify-center'>
                      <BsChatDotsFill className='text-[6rem] text-accent-content/30' />
                    </div>
                  )}
                </div>
                <div className='border-r-[0.5px] border-base-content/20 ' />
                <Resizable
                  enable={{ left: true }}
                  size={
                    isMobileView || !middleResized
                      ? {
                          width: '50%',
                          height: '100%',
                        }
                      : undefined
                  }
                  maxWidth='70%'
                  minWidth='10%'
                  onResize={() => {
                    if (!middleResized) {
                      setMiddleResized(true);
                    }
                  }}
                >
                  {/* section: chat list */}
                  <div className='w-full h-full overflow-y-auto '>
                    {!role && (
                      <div className='w-full h-full flex items-center justify-center'>
                        <p className='text-center'>
                          You must be logged in to be able to access chats.
                        </p>
                      </div>
                    )}
                    {role &&
                      (!getChatListIsLoading || currentToUserID) &&
                      getChatListData?.data?.map((valueChatList, i) => (
                        <div
                          key={'chat-list-' + i}
                          className={ClassNames([
                            'flex items-center gap-4 p-2 cursor-pointer',
                            toUserID === valueChatList.to_user_id
                              ? 'bg-base-content/10'
                              : '',
                          ])}
                          onClick={() => {
                            handleChatListItemOnClick(valueChatList.to_user_id);
                          }}
                        >
                          <Image
                            className='min-w-[2rem] max-w-[3rem] min-h-[2rem] rounded-full'
                            src={valueChatList.to_user_photo}
                          />
                          <div className='flex flex-col'>
                            <span className='text-accent-content font-semibold w-52 truncate text-sm'>
                              {valueChatList.to_user_full_name}
                            </span>
                            {valueChatList.to_merchant_id !== 0 && (
                              <span className='text-accent-content font-semibold w-52 truncate text-sm flex gap-1'>
                                <BsShop className='text-lg' />
                                {valueChatList.to_merchant_name}
                              </span>
                            )}
                            {valueChatList.last_message !== '' && (
                              <span className='text-accent-content/70 w-52 truncate'>
                                {valueChatList.last_message}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    {role && getChatListData == undefined && (
                      <div className='p-2'>
                        <Skeleton className='h-16' />
                        <Skeleton className='h-16' />
                        <Skeleton className='h-16' />
                        <Skeleton className='h-16' />
                        <Skeleton className='h-16' />
                      </div>
                    )}
                  </div>
                </Resizable>
              </div>
            </div>
          </S.ChatBoxContainer>
        </Resizable>
      </S.ChatContainer>
      <S.ChatContainer>
        <S.ChatButton
          onClick={toggleChatBoxShown}
          className={ClassNames([
            'duration-500',
            !chatBoxShown ? '' : 'translate-y-[100%]',
          ])}
        >
          <span className='flex items-center justify-center'>
            <HiChatAlt2 className='text-xl' /> Chat
          </span>
        </S.ChatButton>
      </S.ChatContainer>
    </>
  );
};

export default Chat;
