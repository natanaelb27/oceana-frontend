import { Tooltip } from 'react-daisyui';
import { CHAT_POSITION } from '../../constants/chat';
import ClassNames from '../../utils/classnames';
import { toStringDatetime, toStringTime } from '../../utils/convert';

type ChatBubbleProps = {
  position?: string;
  children?: JSX.Element | string;
  datetime?: string;
};

const ChatBubble = ({
  position = CHAT_POSITION.RIGHT,
  children,
  datetime,
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
            ? 'bg-base-content/70 hover:bg-base-content/60'
            : 'bg-primary hover:bg-primary/80',
          'p-3 rounded-lg text-base-100 break-all transition-all min-w-[2rem]',
        ])}
      >
        {children}
      </div>
      <Tooltip
        className='hover:cursor-pointer'
        position={position === CHAT_POSITION.RIGHT ? 'left' : 'right'}
        message={datetime ? toStringDatetime(datetime) : '--:--'}
      >
        <span className='text-xs text-base-content p-1'>
          {datetime ? toStringTime(datetime) : '--:--'}
        </span>
      </Tooltip>
    </div>
  );
};

export default ChatBubble;
