import ClassNames from '../../../utils/classnames';
type ActionProps = {
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon: JSX.Element;
  disabled?: boolean;
};

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
