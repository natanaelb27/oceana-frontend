import { useEffect, useState } from 'react';
import { Button, Card, Tooltip } from 'react-daisyui';
import { BiReceipt } from 'react-icons/bi';
import { FaAddressBook, FaListUl } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineTruck } from 'react-icons/hi';
import { ImPriceTags } from 'react-icons/im';
import {
  IoAddSharp,
  IoBagCheckOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { MdOutlineAddLocationAlt } from 'react-icons/md';
import { TbDiscount2 } from 'react-icons/tb';
import NoData from '../../../components/common/NoData';
import { useGetAddressesQuery } from '../../../store/services/addressService';
import { Address } from '../../../types/component';
import { toPhoneNumber } from '../../../utils/convert';

const BuyerCheckout = () => {
  const { data: getAddressesData } = useGetAddressesQuery();
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!getAddressesData?.data) {
      return;
    }
    const addresses = getAddressesData.data;
    if (addresses.length === 0) {
      const emptyAddress: Address = {
        id: '',
        user_id: '',
        phone_number: '',
        name: '',
        detail: '',
        sub_district_id: 0,
        sub_district: '',
        zip_code: '',
        district_id: 0,
        district: '',
        city_id: 0,
        city: '',
        province_id: 0,
        province: '',
        is_default: false,
        is_shop_address: false,
      };
      setDefaultAddress(emptyAddress);
    }
    addresses.forEach((address) => {
      if (address.is_default) {
        setDefaultAddress(address);
        return;
      }
    });
  }, [getAddressesData]);

  if (!getAddressesData?.data || !defaultAddress) {
    return (
      <div className='px-2 container mx-auto flex flex-col animate-pulse'>
        <div className='h-6 bg-base-200 rounded-full w-36 max-w-3/5'></div>
      </div>
    );
  }
  return (
    <div className='px-2 container mx-auto flex flex-col'>
      <h1 className='font-bold text-2xl text-primary my-4'>Checkout</h1>
      {/* Shipping address */}
      <Card className='p-4 mb-4 shadow-lg'>
        <Card.Title className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <HiOutlineLocationMarker />
            <h2>Shipping Address</h2>
          </div>
          <Tooltip message='Change shipping address' position='left'>
            <Button
              className='shadow-md'
              color='primary'
              shape='circle'
              size='md'
            >
              {defaultAddress.id ? (
                <FaAddressBook className='text-xl' />
              ) : (
                <MdOutlineAddLocationAlt className='text-xl' />
              )}
            </Button>
          </Tooltip>
        </Card.Title>
        <Card.Body className='p-0 mt-2 flex flex-col gap-0'>
          {defaultAddress.id ? (
            <div className='mt-4'>
              <h3 className='font-bold'>{defaultAddress.name}</h3>
              <div className='text-neutral'>
                <p>{toPhoneNumber(defaultAddress.phone_number as string)}</p>
                <p>{`${defaultAddress.sub_district}, ${defaultAddress.district}, ${defaultAddress.city}, ${defaultAddress.province} ${defaultAddress.zip_code}`}</p>
              </div>
            </div>
          ) : (
            <NoData message="Oops, you haven't set a shipping address" />
          )}
        </Card.Body>
      </Card>

      {/* Checked out products card */}
      <Card className='p-4 mb-4 shadow-lg'>
        <Card.Title className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <BiReceipt />
            <h2>Order 1</h2>
          </div>
          <Tooltip message='Delivery service' position='left'>
            <Button
              className='shadow-md'
              color='primary'
              shape='circle'
              size='md'
            >
              <HiOutlineTruck className='text-2xl' />
            </Button>
          </Tooltip>
        </Card.Title>
      </Card>

      {/* Voucher card */}
      <Card className='p-4 mb-4 shadow-lg'>
        <Card.Title className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <TbDiscount2 />
            <h2>Vouchers</h2>
          </div>
          <Tooltip message='Add a voucher' position='left'>
            <Button
              className='shadow-md'
              color='primary'
              shape='circle'
              size='md'
            >
              <IoAddSharp className='text-3xl' />
            </Button>
          </Tooltip>
        </Card.Title>
      </Card>

      {/* Payment method card */}
      <Card className='p-4 mb-4 shadow-lg'>
        <Card.Title className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <IoWalletOutline />
            <h2>Payment Method</h2>
          </div>
          <Tooltip message='Change payment method' position='left'>
            <Button
              className='shadow-md'
              color='primary'
              shape='circle'
              size='md'
            >
              <FaListUl className='text-xl' />
            </Button>
          </Tooltip>
        </Card.Title>
      </Card>

      {/* Total and make order button sticky bottom */}
      <Card className='p-4 px-10 w-full fixed bottom-0 left-0 flex justify-end rounded-b-none rounded-t-3xl bg-primary'>
        <Card.Title className='flex justify-between text-base-100'>
          <div className='flex items-center gap-2'>
            <ImPriceTags />
            <h2>Rp. 420000</h2>
          </div>
          <Button
            className='flex items-center gap-2 rounded-full shadow-md'
            color='secondary'
            size='md'
          >
            <IoBagCheckOutline className='text-2xl' />
            <h2 className='inline'>Order</h2>
          </Button>
        </Card.Title>
      </Card>
    </div>
  );
};

export default BuyerCheckout;
