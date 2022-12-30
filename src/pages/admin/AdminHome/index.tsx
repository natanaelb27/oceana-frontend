import { Button, Divider } from 'react-daisyui';
import { HiOutlineUserCircle, HiOutlineMail } from 'react-icons/hi';
import { AdminVouchers, AdminRefunds } from '../../../components';
import { Image, Loading } from '../../../components/common';
import { useGetProfileQuery } from '../../../store/services/profileService';

const AdminHome = () => {
  const { data: getProfile } = useGetProfileQuery();

  const handleScrollClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!getProfile?.data) {
    return <Loading isLoading />;
  }

  return (
    <div className='container mx-auto'>
      <div className='px-4 py-10'>
        <div className='flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 py-8 md:py-24'>
          <div className='flex-1'>
            <h3 className='text-2xl md:text-4xl text-center md:text-left mb-2.5'>
              Welcome,{' '}
              <span className='font-bold text-primary'>
                {getProfile.data.full_name}
              </span>
              !
            </h3>
            <span className='flex items-center justify-center md:justify-start mb-12 text-secondary'>
              <HiOutlineUserCircle className='text-xl mr-2' />
              {getProfile.data.username}
              <span className='mx-2'>|</span>
              <HiOutlineMail className='text-xl mr-2' />
              {getProfile.data.email}
            </span>
            <p className='mb-4 text-center md:text-left'>
              &quot;Nothing in the world can take the place of Persistence.
              Talent will not; nothing is more common than unsuccessful men with
              talent. Genius will not; unrewarded genius is almost a proverb.
              Education will not; the world is full of educated derelicts. The
              slogan &apos;Press On&apos; has solved and always will solve the
              problems of the human race.&quot;
            </p>
            <p className='mb-12 text-center md:text-left'>
              - Natanael Benediktus, CEO of Oceana
            </p>
            <div className='flex gap-2 justify-center md:justify-start'>
              <Button
                color='primary'
                onClick={() => handleScrollClick('vouchers')}
              >
                Vouchers
              </Button>
              <Button
                color='secondary'
                onClick={() => handleScrollClick('refunds')}
              >
                Refunds
              </Button>
            </div>
          </div>
          <div className='flex flex-1 justify-center'>
            <Image
              src={require('../../../assets/images/admin.gif')}
              className='h-full'
              alt='Logo'
            />
          </div>
        </div>
        <Divider />
        <div id='vouchers' className='p-4 bg-base-200 rounded-xl'>
          <AdminVouchers />
        </div>
        <Divider />
        <div id='refunds'>
          <AdminRefunds />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
