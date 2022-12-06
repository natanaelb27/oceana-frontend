import ShopDetailCard from '../../components/ShopDetail/ShopDetailCard';
import ShopVouchers from '../../components/ShopDetail/ShopVouchers';

const ShopDetail = () => {
  return (
    <>
      <div className='flex justify-center items-center'>
        <ShopDetailCard/>
      </div>
      <div className='flex justify-center items-center'>
        <ShopVouchers/>
      </div>
    </>
  );
};

export default ShopDetail;
