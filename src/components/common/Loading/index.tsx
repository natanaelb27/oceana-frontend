type LoadingProps = {
  isLoading?: boolean;
};

const Loading = ({ isLoading }: LoadingProps) => {
  return (
    <div
      className={`${
        isLoading ? 'fixed' : 'hidden'
      } top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-base-100 flex flex-col items-center justify-center transition-2 duration-200`}
    >
      <h1 className='text-center text-primary text-4xl mb-2.5 animate-bounce font-semibold'>
        Loading...
      </h1>
      <p className='w-1/3 text-center text-base-content'>
        This may take a few seconds, please don&apos;t close this page.
      </p>
    </div>
  );
};

export default Loading;
