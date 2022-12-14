import { useEffect, useState } from 'react';
import { Button, Card, Tooltip } from 'react-daisyui';
import { AiOutlineShop } from 'react-icons/ai';
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
import { Link } from 'react-router-dom';
import NoData from '../../../components/common/NoData';
import { useGetAddressesQuery } from '../../../store/services/addressService';
import { selectCart } from '../../../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { Address } from '../../../types/component';
import { toPhoneNumber, toRupiah } from '../../../utils/convert';
import { titleCase } from '../../../utils/titleCase';

const BuyerCheckout = () => {
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const { data: getAddressesData } = useGetAddressesQuery();
  const cart = useAppSelector(selectCart);
  const dispatch = useAppDispatch();

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
      <h1 className='font-bold text-2xl text-primary my-4'>
        <Link to='/'>Checkout</Link>
      </h1>
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
      {cart.map(({ merchant_id, merchant_province, name, products }, index) => (
        <Card key={merchant_id} className='p-4 mb-4 shadow-lg'>
          <Card.Title className='flex justify-between'>
            <div className='flex items-center gap-2'>
              <BiReceipt />
              <h2>Order {index + 1}</h2>
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
          <Card.Body className='p-0 pl-2'>
            <div id={`merchant-${name}`}>
              <div className='flex items-center gap-2'>
                <AiOutlineShop className='text-primary' />
                <h3 className='font-bold'>{name}</h3>
              </div>
              <p className='text-neutral'>{merchant_province}</p>
            </div>
            <div id='products'>
              {products.map((product) => {
                console.log(product.product_variation);
                return (
                  <div
                    key={product.carts_id}
                    className='flex items-center py-3'
                  >
                    <div className='h-20 w-20 md:h-24 md:w-24 ml-2 mr-2 h-'>
                      <img
                        src='https://images.tokopedia.net/img/cache/100-square/product-1/2020/8/25/49295037/49295037_d63120b6-8ab4-4084-9765-a3b679ab18df_1000_1000.webp?ect=4g'
                        className='rounded-lg h-full w-full'
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src =
                            'https://cdn.shopify.com/s/files/1/0332/8881/4637/products/noimageavailable_7b25b64a-d5f8-423b-a498-8a2785ea69b2_2000x.jpg?v=1669356395';
                        }}
                      />
                    </div>
                    <div className='h-24 flex flex-col'>
                      <div className='justify-start mt-2 md:mt-0'>
                        {titleCase(product.product_name)}
                      </div>
                      <div className='text-sm mt-0.5'>
                        {titleCase(product.product_variation)}
                      </div>
                      {product.price !== product.price_after_discount ? (
                        <div className='flex items-center'>
                          <div className='text-lg font-bold'>
                            {toRupiah(product.price_after_discount)}
                          </div>
                          <h5 className='text-base line-through ml-1'>
                            {toRupiah(product.price)}
                          </h5>
                        </div> // prevents looping
                      ) : (
                        <div className='text-lg font-bold'>
                          {toRupiah(product.price_after_discount)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      ))}

      {/* Voucher card */}
      <Card className='p-4 mb-4 shadow-lg'>
        <Card.Title className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center text-primary gap-1'>
              <TbDiscount2 />
              <span className='font-main italic'>Oceana</span>
            </div>
            <h2>Vouchers</h2>
          </div>
          <Tooltip message="Add a voucher, it's on us!" position='left'>
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
      <Card className='p-4 w-full fixed bottom-0 left-0 flex justify-end rounded-b-none rounded-t-3xl bg-neutral'>
        <Card.Title className='flex justify-between text-neutral-content'>
          <div className='flex items-center gap-2'>
            <ImPriceTags />
            <h2>Rp. 420000</h2>
          </div>
          <Button
            className='flex items-center gap-2 rounded-full shadow-md'
            color='primary'
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
