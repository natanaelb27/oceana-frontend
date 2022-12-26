import { Button } from 'react-daisyui';
import ClassNames from '../../../utils/classnames';

interface ActionProps {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: JSX.Element;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Action = ({ className, onClick, icon, disabled }: ActionProps) => {
  if (className === undefined) {
    className = '';
  }
  disabled = disabled === undefined ? false : disabled;

  return (
    <button
      type='button'
      className={ClassNames([className, disabled ? 'text-gray-400' : ''])}
      onClick={
        disabled
          ? () => {
              return;
            }
          : onClick
      }
      disabled={disabled}
    >
      {icon !== undefined && <div>{icon}</div>}
    </button>
  );
};

interface ChildrenProps {
  children?: React.ReactNode;
}

interface ButtonAddMoreProps extends ChildrenProps {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export const ButtonAddMore = ({
  className,
  onClick,
  disabled,
  children,
}: ButtonAddMoreProps) => {
  if (className === undefined) {
    className = '';
  }
  return (
    <Button
      type='button'
      className='border-dashed border-base-content hover:border-primary bg-base-100 hover:bg-primary text-base-content hover:text-primary hover:bg-opacity-10 '
      onClick={
        disabled
          ? () => {
              return;
            }
          : onClick
      }
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
