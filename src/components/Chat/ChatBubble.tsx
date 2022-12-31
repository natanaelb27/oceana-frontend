import React from 'react';
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
      <div
        className={ClassNames([
          position === CHAT_POSITION.RIGHT
            ? 'bg-base-content/70'
            : 'bg-primary',
          'p-3 rounded-lg text-secondary-content break-all',
        ])}
      >
        {children}
      </div>
      <span className='text-xs text-accent-content p-1'>12:01</span>
    </div>
  );
};

export default ChatBubble;
