type ChildrenProps = {
  children?: React.ReactNode;
};

export const LabelInputContainer = ({ children }: ChildrenProps) => {
  return <div className='grid grid-col-1 md:grid-cols-4 gap-2'>{children}</div>;
};

export const LabelContainer = ({ children }: ChildrenProps) => {
  return (
    <div className='col-auto md:col-span-1 flex flex-col justify-start font-bold'>
      {children}
    </div>
  );
};

export const InputContainer = ({ children }: ChildrenProps) => {
  return (
    <div className='col-auto md:col-span-3 flex flex-col justify-center'>
      {children}
    </div>
  );
};
