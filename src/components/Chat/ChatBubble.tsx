import React from 'react';
import { Badge } from 'react-daisyui';
import { CHAT_POSITION } from '../../constants/chat';
import ClassNames from '../../utils/classnames';

type ChatBubbleProps = {
  position?: string;
  children?: JSX.Element | string;
};

const ChatBubble = ({
  position = CHAT_POSITION.RIGHT,
  children,
}: ChatBubbleProps) => {
  return (
    <div
      className={ClassNames([
        'w-full flex flex-col',
        position === CHAT_POSITION.RIGHT ? 'items-end' : '',
        position === CHAT_POSITION.LEFT ? 'items-start' : '',
      ])}
    >
      <Badge
        color={position === CHAT_POSITION.RIGHT ? undefined : 'primary'}
        className='p-4 rounded-lg'
      >
        {children}
      </Badge>
      <span className='text-xs text-accent-content p-1'>12:01</span>
    </div>
  );
};

export default ChatBubble;
