import { useEffect, useState } from 'react';
import { Button, Card, Tooltip } from 'react-daisyui';
import { FaRegAddressBook } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useGetAddressesQuery } from '../../../store/services/addressService';
import { Address } from '../../../types/component';
import { toPhoneNumber } from '../../../utils/convert';

const BuyerCheckout = () => {
  const { data: getAddressesData } = useGetAddressesQuery();
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!getAddressesData?.data) return;
    const addresses = getAddressesData.data;
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
              size='sm'
            >
              <FaRegAddressBook />
            </Button>
          </Tooltip>
        </Card.Title>
        <Card.Body className='p-0 mt-2 flex flex-col gap-0'>
          <h3 className='font-bold'>{defaultAddress.name}</h3>
          <div className='text-neutral'>
            <p>{toPhoneNumber(defaultAddress.phone_number as string)}</p>
            <p>{`${defaultAddress.sub_district}, ${defaultAddress.district}, ${defaultAddress.city}, ${defaultAddress.province} ${defaultAddress.zip_code}`}</p>
          </div>
        </Card.Body>
      </Card>
      {/* Checked out products card */}
      {/* Voucher card */}
      {/* Payment method card */}
      {/* Total and make order button sticky bottom */}
    </div>
  );
};

export default BuyerCheckout;
