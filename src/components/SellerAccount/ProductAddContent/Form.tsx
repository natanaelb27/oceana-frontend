import ClassNames from '../../../utils/classnames';

type BasicProps = {
  children?: React.ReactNode;
  className?: string;
};

interface LabelProps extends BasicProps {
  required?: boolean;
}

export const Label = ({
  children,
  className = '',
  required = false,
}: LabelProps) => {
  return (
    <label className={ClassNames([className])}>
      {children}
      {required === true ? <span className='text-red-500'> *</span> : ''}
    </label>
  );
};
