type NoDataProps = {
  title?: string;
  description?: string;
};

const NoData = ({ title, description }: NoDataProps) => {
  return (
    <div className='flex flex-col gap-5 text-center items-center'>
      <img
        src={require('./../../../assets/images/no-data.png')}
        alt='no-data'
        className='object-contain h-48 w-96'
      ></img>
      <div className='flex flex-col gap-3 text-center items-center w-96'>
        <span className='font-bold text-xl'>{title}</span>
        <span className='font-light'>{description}</span>
      </div>
    </div>
  );
};

export default NoData;
