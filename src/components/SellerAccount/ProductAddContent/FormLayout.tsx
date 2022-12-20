import ClassNames from '../../../utils/classnames';

type ChildrenProps = {
  children?: React.ReactNode;
  className?: string;
};

export const LabelInputErrorContainer = ({
  children,
  className = '',
}: ChildrenProps) => {
  return (
    <div className={'flex flex-col gap-2' + ClassNames([className])}>
      {children}
    </div>
  );
};

export const LabelInputContainer = ({
  children,
  className = '',
}: ChildrenProps) => {
  return (
    <div
      className={
        'grid grid-col-1 md:grid-cols-4 gap-2' + ClassNames([className])
      }
    >
      {children}
    </div>
  );
};

interface LabelContainerProps extends ChildrenProps {
  justify?: string;
}

export const LabelContainer = ({
  children,
  className = '',
  justify = 'justify-center',
}: LabelContainerProps) => {
  return (
    <div
      className={
        'col-auto md:col-span-1 flex flex-col' +
        ClassNames([justify + ' py-0 md:py-3', className])
      }
    >
      {children}
    </div>
  );
};

export const InputContainer = ({ children, className = '' }: ChildrenProps) => {
  return (
    <div
      className={
        'col-auto md:col-span-3 flex flex-col justify-center' +
        ClassNames([className])
      }
    >
      {children}
    </div>
  );
};

export const InputError = ({ children, className = '' }: ChildrenProps) => {
  return (
    <div
      className={
        'grid grid-cols-1 md:grid-cols-4 gap-2' + ClassNames([className])
      }
    >
      <div className='col-auto md:col-span-3 md:col-start-2 flex flex-col justify-center'>
        {children}
      </div>
    </div>
  );
};
