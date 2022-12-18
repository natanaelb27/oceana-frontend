type ChildrenProps = {
  children?: React.ReactNode;
};

export const LabelInputErrorContainer = ({ children }: ChildrenProps) => {
  return <div className='flex flex-col'>{children}</div>;
};

export const LabelInputContainer = ({ children }: ChildrenProps) => {
  return <div className='grid grid-cols-5 gap-3'>{children}</div>;
};

export const LabelContainer = ({ children }: ChildrenProps) => {
  return (
    <div className='col-span-3 md:col-span-1 flex flex-col justify-center font-bold'>
      {children}
    </div>
  );
};

export const InputContainer = ({ children }: ChildrenProps) => {
  return (
    <div className='col-span-4 md:col-span-3 flex flex-col justify-center'>
      {children}
    </div>
  );
};

export const ActionContainer = ({ children }: ChildrenProps) => {
  return (
    <div className='col-span-1 flex flex-col justify-center'>{children}</div>
  );
};

export const InputError = ({ children }: ChildrenProps) => {
  return (
    <div className='grid grid-col-1 md:grid-cols-5 gap-2'>
      <div className='col-auto md:col-span-3 md:col-start-2 flex flex-col justify-center'>
        {children}
      </div>
    </div>
  );
};
