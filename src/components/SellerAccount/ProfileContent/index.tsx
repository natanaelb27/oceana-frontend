import { ChangeEvent, useRef } from 'react';
import { Button, Card, Divider } from 'react-daisyui';
import { HiOutlinePhotograph, HiStar } from 'react-icons/hi';

import { Merchant } from '../../../types/component';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { UpdateProfileResponse } from '../../../types/response';
import { useUpdateMyShopPhotoMutation } from '../../../store/services/myShopService';
import { toUpdateMerchantImageRequest } from '../../../utils/mapperDTO/merchant';
import { useGetMerchantByIDQuery } from '../../../store/services/merchantService';

type ProfileContentProps = {
  profile: Merchant | null | undefined;
};

const ProfileContent = ({ profile }: ProfileContentProps) => {
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const { data: merchantData } = useGetMerchantByIDQuery(
    profile?.id ? String(profile.id) : ''
  );
  const [updateMyShopPhoto, { isLoading: updateMyShopPhotoIsLoading }] =
    useUpdateMyShopPhotoMutation();

  const handleUploadImageClick = () => {
    photoFileInputRef.current?.click();
  };

  const handleUploadImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files?.[0]) {
      return;
    }

    if (!e.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/)) {
      return;
    }

    updateMyShopPhoto(toUpdateMerchantImageRequest(e.target.files[0]))
      .unwrap()
      .then(() => {
        notifySuccessToast('Profile updated!');
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as UpdateProfileResponse;

          notifyErrorToast(response.message);
        }
      });
  };

  if (!profile || !merchantData?.data) {
    return (
      <div className='p-4 md:p-10 animate-pulse'>
        <div className='h-6 bg-base-200 rounded-full w-48 max-w-3/5'></div>
        <Divider />
        <div className='grid grid-cols-12 gap-4 md:gap-10'>
          <div className='col-span-12 md:col-span-4'>
            <Card className='shadow max-w-xs'>
              <div className='h-64 w-full bg-base-200 rounded'></div>
              <div className='p-4'>
                <div className='h-12 w-full bg-base-200 rounded-full'></div>
              </div>
            </Card>
          </div>
          <div className='col-span-12 md:col-span-8'>
            <div className='grid grid-col-12 gap-4 mb-10'>
              <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
            </div>
            <div className='grid grid-col-12 gap-4 mb-10'>
              <div className='h-4 bg-base-200 rounded-full col-span-12 w-2/5 mb-1'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-3'></div>
              <div className='h-4 bg-base-200 rounded-full col-span-9'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    name,
    photo,
    shop_province,
    shop_city,
    shop_district,
    shop_sub_district,
    rating_star,
    total_rating,
    product_count,
  } = merchantData.data;

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Profile</h5>
      <Divider />
      <div className='grid grid-cols-12 gap-4 md:gap-10'>
        <div className='col-span-12 md:col-span-4'>
          <Card className='shadow max-w-xs'>
            <figure>
              <img
                src={
                  photo
                    ? photo
                    : 'https://i.pinimg.com/736x/2a/4d/11/2a4d11d5d32c83812d2e07742578835c.jpg'
                }
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = require('./../../../assets/images/no-image.webp');
                }}
                alt='Profile Photo'
              />
            </figure>
            <div className='p-4'>
              <Button
                className='w-full normal-case font-medium mb-2.5'
                color='primary'
                loading={updateMyShopPhotoIsLoading}
                onClick={handleUploadImageClick}
                startIcon={<HiOutlinePhotograph className='text-xl truncate' />}
              >
                Choose Image
              </Button>
              <input
                type='file'
                ref={photoFileInputRef}
                onChange={handleUploadImageChange}
                className='hidden'
              />
            </div>
          </Card>
        </div>
        <div className='col-span-12 md:col-span-8'>
          <div className='grid grid-col-12 gap-4 mb-10'>
            <span className='col-span-12 font-medium mb-1'>
              General Information
            </span>
            <span className='col-span-3 text-sm font-light'>Name</span>
            <span className='col-span-9 text-sm'>{name}</span>
            <span className='col-span-3 text-sm font-light'>Province</span>
            <span className='col-span-9 text-sm'>{shop_province}</span>
            <span className='col-span-3 text-sm font-light'>City</span>
            <span className='col-span-9 text-sm'>{shop_city}</span>
            <span className='col-span-3 text-sm font-light'>District</span>
            <span className='col-span-9 text-sm'>{shop_district}</span>
            <span className='col-span-3 text-sm font-light'>Sub-District</span>
            <span className='col-span-9 text-sm'>{shop_sub_district}</span>
          </div>
          <div className='grid grid-col-12 gap-4 mb-10'>
            <span className='col-span-12 font-medium mb-1'>Statistics</span>
            <span className='col-span-3 text-sm font-light'>Total Product</span>
            <span className='col-span-9 text-sm'>{product_count} item(s)</span>
            <span className='col-span-3 text-sm font-light'>Avg. Rating</span>
            <span className='col-span-9 flex flex-row'>
              {[1, 2, 3, 4, 5].map((row: number) =>
                row <= rating_star ? (
                  <HiStar key={row} className='text-warning text-xl' />
                ) : (
                  <HiStar key={row} className='text-lg' />
                )
              )}
            </span>
            <span className='col-span-3 text-sm font-light'>Total Rating</span>
            <span className='col-span-9 text-sm'>{total_rating} rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
