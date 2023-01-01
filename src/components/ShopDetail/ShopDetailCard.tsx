import moment from 'moment';
import { useEffect } from 'react';
import { Button } from 'react-daisyui';
import { AiFillStar } from 'react-icons/ai';
import { HiChat, HiShoppingBag } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useLazyGetProfileQuery } from '../../store/services/profileService';
import { ShopInformation } from '../../types/component';
import { Role } from '../../types/role';
import { Image } from '../common';

type ShopDetailCardProps = {
  merchant: ShopInformation | null | undefined;
  role: Role;
};

const ShopDetailCard = ({ merchant, role }: ShopDetailCardProps) => {
  const navigate = useNavigate();

  const handleClickChatSeller = () => {
    if (role) {
      console.log('first');
    } else {
      navigate('/login');
    }
  };

  const [getProfile, { data: getProfileData }] = useLazyGetProfileQuery();

  useEffect(() => {
    if (role) {
      getProfile();
    }
  }, [role]);

  return (
    <div className='flex justify-between items-center p-5 border rounded-md w-full md:w-3/5 my-10'>
      <div className='flex gap-4 items-center'>
        <Image src={merchant?.photo} className='w-20 h-20 rounded-full'></Image>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-1'>
            <HiShoppingBag className='text-info text-xl' />
            <span className='text-xl font-bold'>{merchant?.name}</span>
          </div>
          <div className='flex flex-col md:flex-row md:items-center gap-1'>
            <span className='text-sm'>
              Since {moment(merchant?.joined_date).format('MMMM YYYY')}
            </span>
            <span className='hidden md:flex'>•</span>
            <span className='text-sm font-light'>{merchant?.shop_city}</span>
          </div>
          <Button
            size='sm'
            className='normal-case text-sm btn-outline'
            color='primary'
            startIcon={<HiChat></HiChat>}
            onClick={handleClickChatSeller}
            disabled={
              role ? getProfileData?.data?.id === merchant?.user_id : false
            }
          >
            Chat Seller
          </Button>
        </div>
      </div>
      <div className='hidden md:flex justify-center items-center h-fit'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex gap-1 items-center justify-center'>
            <AiFillStar className='text-2xl text-yellow-500' />
            <span className='text-xl font-semibold'>
              {merchant?.rating_star}
            </span>
          </div>
          <div>Rating &amp; Reviews</div>
        </div>
        <div className='divider divider-horizontal'></div>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex gap-1 items-center justify-center'>
            <span className='text-xl font-semibold'>
              {merchant?.total_rating}
            </span>
          </div>
          <div>Total Ratings</div>
        </div>
        <div className='divider divider-horizontal'></div>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex gap-1 items-center justify-center'>
            <span className='text-xl font-semibold'>
              {merchant?.product_count}
            </span>
          </div>
          <div>Total Products</div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailCard;
