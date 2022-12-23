import { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, Tooltip } from 'react-daisyui';
import { AiOutlineHome, AiOutlineShop } from 'react-icons/ai';
import { BiReceipt } from 'react-icons/bi';
import { FaAddressBook, FaListUl } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineTruck } from 'react-icons/hi';
import { ImPriceTag, ImPriceTags } from 'react-icons/im';
import {
  IoAddSharp,
  IoBagCheckOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { MdNavigateNext, MdOutlineAddLocationAlt } from 'react-icons/md';
import { TbDiscount2 } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { VoucherTicket } from '../../../components/BuyerCheckout';
import { NoData, SealabsPayImg } from '../../../components/common';
import { STATUS_INTERNAL_SERVER_ERROR } from '../../../constants/statusCodes';
import { useGetAddressesQuery } from '../../../store/services/addressService';
import { usePayCartWithWalletMutation } from '../../../store/services/cartService';
import { useGetActiveMarketplaceVoucherQuery } from '../../../store/services/marketplaceService';
import { useGetWalletDetailsQuery } from '../../../store/services/walletService';
import { selectCheckout } from '../../../store/slices/checkoutSlice';
import { useAppSelector } from '../../../store/store';
import {
  Address,
  DeliveryService,
  MarketplaceVoucher,
  PaymentMethod,
} from '../../../types/component';
import {
  AdditionalNotes,
  CheckoutCartOrderItem,
  CheckoutCartProduct,
  CheckoutCartProductItem,
} from '../../../types/component/checkout';
import { GetRajaOngkirShippingCostRequest } from '../../../types/request';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import {
  calculateSubtotal,
  calculateTotal,
  calculateTotalWeight,
} from '../../../utils/checkout';
import {
  pascalCaseToTitleCase,
  toETD,
  toPhoneNumber,
  toRupiah,
} from '../../../utils/convert';
import { toPayCartWithWalletRequest } from '../../../utils/mapperDTO';
import { titleCase } from '../../../utils/titleCase';
import {
  notifyErrorToast,
  notifyInfoToast,
  notifySuccessToast,
} from '../../../utils/toast';
import DeliveryServiceModal from './DeliveryServiceModal';
import MarketplaceVoucherModal from './MarketplaceVoucherModal';
import PaymentMethodModal from './PaymentMethodModal';
import PaymentWalletPinModal from './PaymentWalletPinModal';
import ShippingAddressModal from './ShippingAddressModal';

type OpenCheckoutModal = {
  shippingAddress: {
    add: boolean;
    change: boolean;
  };
  deliveryService: boolean;
  shopVoucher: boolean;
  marketplaceVoucher: boolean;
  paymentMethod: boolean;
  paymentWalletPin: boolean;
};

const BuyerCheckout = () => {
  const { data: getAddressesData } = useGetAddressesQuery();
  const { data: getWalletDetailsData, refetch: refetchGetWalletDetails } =
    useGetWalletDetailsQuery();
  const { data: getActiveMarketplaceVoucherData } =
    useGetActiveMarketplaceVoucherQuery();
  const [payCartWithWallet, { isLoading: payCartWithWalletLoading }] =
    usePayCartWithWalletMutation();
  const checkout = useAppSelector(selectCheckout);
  const [openModal, setOpenModal] = useState<OpenCheckoutModal>({
    shippingAddress: {
      add: false,
      change: false,
    },
    deliveryService: false,
    shopVoucher: false,
    marketplaceVoucher: false,
    paymentMethod: false,
    paymentWalletPin: false,
  });
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Wallet
  );
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [deliveryService, setDeliveryService] =
    useState<DeliveryService | null>(null);
  const [currentMerchantID, setCurrentMerchantID] = useState<number>(0);
  const [getShippingCostRequest, setGetShippingCostRequest] =
    useState<GetRajaOngkirShippingCostRequest | null>(null);
  const [additionalNotes, setAdditionalNotes] =
    useState<AdditionalNotes | null>(null);
  const [marketplaceVoucher, setMarketplaceVoucher] =
    useState<MarketplaceVoucher | null>(null);

  const handleAddAddressClick = () => {
    setOpenModal({
      shippingAddress: {
        add: true,
        change: false,
      },
      deliveryService: false,
      shopVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
    });
  };

  const handleChangeAddressClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: true,
      },
      deliveryService: false,
      shopVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
    });
  };

  const handleChangeAdditionalNotes = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const productItemID = Number(e.target.id);
    const value = e.target.value;
    setAdditionalNotes((prev) => ({
      ...prev,
      [productItemID]: value,
    }));
  };

  const handleDeliveryServiceClick = (
    merchantID: number,
    productIDs: number[],
    origin: number,
    totalWeight: number
  ) => {
    if (!shippingAddress?.city_id) {
      notifyInfoToast('Please pick a shipping address');
      return;
    }
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: true,
      shopVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
    });
    setCurrentMerchantID(merchantID);
    setGetShippingCostRequest({
      origin,
      destination: shippingAddress.city_id,
      weight: totalWeight,
      courier: '',
      product_ids: productIDs,
    });
  };

  const handleShopVoucherClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      shopVoucher: true,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
    });
  };

  const handleMarketplaceVoucherClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      shopVoucher: false,
      marketplaceVoucher: true,
      paymentMethod: false,
      paymentWalletPin: false,
    });
  };

  const handlePaymentMethodClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      shopVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: true,
      paymentWalletPin: false,
    });
  };

  const handlePaymentWalletPinClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      shopVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: true,
    });
  };

  const handleModalClose = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      shopVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
    });
  };

  const handleOrderClick = () => {
    if (!shippingAddress?.id) {
      notifyInfoToast('Please pick a shipping address');
      return;
    }
    // validate delivery service
    if (!deliveryService) {
      notifyInfoToast('Please pick a delivery service');
      return;
    }
    const nDeliveryService = Object.keys(deliveryService).length;
    if (nDeliveryService !== checkout.length) {
      notifyInfoToast('Please pick a delivery service');
      return;
    }
    // validate payment method (sealabs pay, pick a card)

    handlePaymentWalletPinClick();
  };

  const handleSuccessPaymentWalletPin = (pin: string) => {
    const cartIDs: number[] = [];
    const checkoutCartOrderItems = checkout.map(
      (cartGroupedByMerchant): CheckoutCartOrderItem => {
        const checkoutCartProducts: CheckoutCartProduct[] = [];
        cartGroupedByMerchant.products.forEach((product) => {
          // if product_id already exist (different variation), skip and add to CheckoutCartProductItem
          const productIndex = checkoutCartProducts.findIndex(
            (checkoutCartProduct) =>
              checkoutCartProduct.product_id === product.product_id
          );
          const message = additionalNotes
            ? additionalNotes[product.product_item_id]
            : '';

          if (productIndex < 0) {
            const checkoutCartProductItems: CheckoutCartProductItem[] = [];

            checkoutCartProductItems.push({
              product_item_id: product.product_item_id,
              quantity: product.quantity,
              message,
            });
            // add to array of cart IDs for BE request
            cartIDs.push(product.carts_id);

            const checkoutCartProduct: CheckoutCartProduct = {
              product_id: product.product_id,
              product_merchant_promotion_id:
                product.product_merchant_promotion_id,
              product_items: checkoutCartProductItems,
            };
            checkoutCartProducts.push(checkoutCartProduct);
          } else {
            const checkoutCartProductItem: CheckoutCartProductItem = {
              product_item_id: product.product_item_id,
              quantity: product.quantity,
              message,
            };

            checkoutCartProducts
              .at(productIndex)
              ?.product_items.push(checkoutCartProductItem);
          }
        });

        const shippingFee = deliveryService
          ? (deliveryService[cartGroupedByMerchant.merchant_id]
              ?.courier_services[0].shipping_fee as number)
          : 0;

        const checkoutCartOrderItem: CheckoutCartOrderItem = {
          merchant_id: cartGroupedByMerchant.merchant_id,
          merchant_voucher_id: null,
          courier_service_id: 1,
          shipping_fee: shippingFee,
          products: checkoutCartProducts,
        };
        return checkoutCartOrderItem;
      }
    );
    const marketplaceVoucherID = marketplaceVoucher
      ? marketplaceVoucher.id
      : null;

    // debugging
    const dbgReq = toPayCartWithWalletRequest(
      checkoutCartOrderItems,
      cartIDs,
      marketplaceVoucherID,
      shippingAddress?.id as string,
      pin,
      totalPayment
    );
    console.log(dbgReq);

    payCartWithWallet(dbgReq)
      .unwrap()
      .then(() => notifySuccessToast('Payment success!'))
      .catch((err) => {
        const { data } = err;
        if (data.code === STATUS_INTERNAL_SERVER_ERROR) {
          notifyErrorToast('Payment failed, please try again');
          return;
        }
        const { message } = data;
        const messageCapitalized = capitalizeFirstLetter(message);
        notifyErrorToast(messageCapitalized);
      });
  };

  useEffect(() => {
    const initialNotes: AdditionalNotes = {};
    checkout.forEach((cartItem) =>
      cartItem.products.forEach((productItem) => {
        initialNotes[productItem.product_item_id] = '';
      })
    );
    setAdditionalNotes(initialNotes);
  }, []);

  useEffect(() => {
    if (!getWalletDetailsData?.data) {
      refetchGetWalletDetails();
      return;
    }
    setWalletBalance(getWalletDetailsData.data.balance);
  }, [getWalletDetailsData]);

  useEffect(() => {
    setTotalPayment(
      calculateTotal(checkout, deliveryService, marketplaceVoucher)
    );
  }, [checkout, deliveryService, marketplaceVoucher]);

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
      setShippingAddress(emptyAddress);
    }
    addresses.forEach((address) => {
      if (address.is_default) {
        setShippingAddress(address);
        return;
      }
    });
  }, [getAddressesData]);

  if (
    !getAddressesData?.data ||
    !shippingAddress ||
    !getActiveMarketplaceVoucherData?.data
  ) {
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
          {shippingAddress.id ? (
            <Tooltip message='Change shipping address' position='left'>
              <Button
                className='shadow-md'
                color='primary'
                shape='circle'
                size='md'
                onClick={handleChangeAddressClick}
              >
                <FaAddressBook className='text-xl' />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip message='Add a shipping address' position='left'>
              <Button
                className='shadow-md'
                color='primary'
                shape='circle'
                size='md'
                onClick={handleAddAddressClick}
              >
                <MdOutlineAddLocationAlt className='text-xl' />
              </Button>
            </Tooltip>
          )}
        </Card.Title>
        <Card.Body className='p-0 pl-2 flex flex-col gap-0'>
          {shippingAddress.id ? (
            <div>
              <div className='flex items-center gap-2'>
                <AiOutlineHome className='text-secondary' />
                <h3 className='font-bold'>{shippingAddress.name}</h3>
              </div>
              <div>
                <p>{toPhoneNumber(shippingAddress.phone_number as string)}</p>
                <p>{`${shippingAddress.sub_district}, ${shippingAddress.district}, ${shippingAddress.city}, ${shippingAddress.province} ${shippingAddress.zip_code}`}</p>
              </div>
            </div>
          ) : (
            <NoData message="Oops, you haven't set a shipping address" />
          )}
        </Card.Body>
      </Card>

      {/* Checked out products card */}
      {checkout.map(
        (
          { merchant_id, merchant_province, city_id, name, products },
          index
        ) => (
          <Card key={merchant_id} className='p-4 mb-4 shadow-lg'>
            <Card.Title className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <BiReceipt />
                <h2>Order {index + 1}</h2>
              </div>
              <Tooltip message='Delivery service' position='left'>
                <Button
                  className='shadow-md md:hidden'
                  color='primary'
                  shape='circle'
                  size='md'
                  onClick={() =>
                    handleDeliveryServiceClick(
                      merchant_id,
                      products.map((product) => product.product_id),
                      city_id,
                      calculateTotalWeight(products)
                    )
                  }
                >
                  <HiOutlineTruck className='text-2xl' />
                </Button>
              </Tooltip>
            </Card.Title>
            <Card.Body className='p-0 pl-2'>
              <div id={`merchant-${name}`}>
                <div className='flex items-center gap-2'>
                  <AiOutlineShop className='text-secondary' />
                  <h3 className='font-bold'>{name}</h3>
                </div>
                <p>{merchant_province}</p>
              </div>
              <div id='products'>
                {products.map((product) => {
                  return (
                    <div
                      key={product.carts_id}
                      className='grid grid-cols-3 py-3'
                    >
                      <div className='h-20 w-20 md:h-24 md:w-24 ml-2 mr-2'>
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
                      <div className='w-full flex flex-col col-span-2'>
                        <div className='justify-start mt-2 md:mt-0'>
                          {titleCase(product.product_name)}
                        </div>
                        <div className='text-sm mt-0.5'>
                          {titleCase(product.product_variation)}
                        </div>
                        <div className='mb-1'>
                          {product.price !== product.price_after_discount ? (
                            <div className='flex items-center'>
                              <div className='text-base font-bold'>
                                {toRupiah(product.price_after_discount)}
                              </div>
                              <h5 className='text-xs line-through ml-1'>
                                {toRupiah(product.price)}
                              </h5>
                            </div> // prevents looping
                          ) : (
                            <div className='text-base font-bold'>
                              {toRupiah(product.price_after_discount)}
                            </div>
                          )}
                        </div>
                        <div className='flex items-center justify-between'>
                          <div>{`x${product.quantity}`}</div>
                          <div className='text-lg font-bold'>
                            {toRupiah(
                              product.price_after_discount * product.quantity
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='col-span-3'>
                        <Input
                          className='w-full'
                          color='primary'
                          id={String(product.product_item_id)}
                          placeholder='Additional Notes (optional)'
                          size='sm'
                          type='text'
                          value={
                            additionalNotes
                              ? additionalNotes[product.product_item_id]
                              : ''
                          }
                          onChange={handleChangeAdditionalNotes}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
            <Card
              className='mt-2 bg-primary/10 hover:bg-primary/20 active:bg-primary/10 cursor-pointer'
              onClick={() =>
                handleDeliveryServiceClick(
                  merchant_id,
                  products.map((product) => product.product_id),
                  city_id,
                  calculateTotalWeight(products)
                )
              }
            >
              {!deliveryService || !deliveryService[merchant_id] ? (
                <div className='p-4 flex justify-between items-center'>
                  <div>Pick a delivery service</div>
                  <MdNavigateNext className='text-2xl' />
                </div>
              ) : (
                <div className='p-4 flex flex-col'>
                  <div className='flex justify-between items-center'>
                    <div>
                      {
                        deliveryService[merchant_id]?.courier_services[0]
                          .description
                      }
                    </div>
                    <div className='font-bold'>
                      {deliveryService[merchant_id]?.courier_services[0]
                        .shipping_fee &&
                        toRupiah(
                          deliveryService[merchant_id]?.courier_services[0]
                            .shipping_fee as number
                        )}
                    </div>
                  </div>
                  <div className='text-sm font-light'>
                    {deliveryService[merchant_id]?.courier_services[0].etd &&
                      `Estimated delivery: ${toETD(
                        deliveryService[merchant_id]?.courier_services[0]
                          .etd as string
                      )}`}
                  </div>
                </div>
              )}
            </Card>
            <Divider />
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <ImPriceTag />
                <p>Subtotal</p>
              </div>
              <p className='text-xl font-bold'>
                {deliveryService
                  ? toRupiah(
                      calculateSubtotal(
                        products,
                        deliveryService[merchant_id]?.courier_services[0]
                          .shipping_fee
                      )
                    )
                  : toRupiah(calculateSubtotal(products))}
              </p>
            </div>
          </Card>
        )
      )}

      {/* Voucher card */}
      <Card className='p-4 mb-4 shadow-lg'>
        <Card.Title className='flex justify-between'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center text-primary gap-1'>
              <TbDiscount2 className='text-primary' />
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
              onClick={handleMarketplaceVoucherClick}
            >
              <IoAddSharp className='text-3xl' />
            </Button>
          </Tooltip>
        </Card.Title>
        {marketplaceVoucher && (
          <Card.Body className='p-0 mt-2'>
            <VoucherTicket
              currentVoucher={marketplaceVoucher}
              selectedVoucher={marketplaceVoucher}
              onClickVoucher={handleMarketplaceVoucherClick}
            />
          </Card.Body>
        )}
      </Card>

      {/* Payment method card */}
      <Card className='p-4 mb-4 shadow-lg'>
        <Card.Title className='flex justify-between'>
          <div className='flex items-center gap-2'>
            {paymentMethod === PaymentMethod.Wallet ? (
              <IoWalletOutline className='w-5 h-5' />
            ) : (
              <SealabsPayImg className='w-5 h-5' />
            )}
            <h2>Payment Method</h2>
          </div>
          <Tooltip message='Change payment method' position='left'>
            <Button
              className='shadow-md'
              color='primary'
              shape='circle'
              size='md'
              onClick={handlePaymentMethodClick}
            >
              <FaListUl className='text-xl' />
            </Button>
          </Tooltip>
        </Card.Title>
        <Card.Body className='p-0 pl-2'>
          <div className='flex flex-col gap-2'>
            <div className='text-lg'>
              {pascalCaseToTitleCase(PaymentMethod[paymentMethod])}
            </div>
            {paymentMethod === PaymentMethod.Wallet ? (
              <div className='flex justify-between items-center'>
                <div className='text-sm font-light'>Balance</div>
                <div className='text-sm font-bold'>
                  {toRupiah(walletBalance)}
                </div>
              </div>
            ) : (
              <div className='flex justify-between items-center'>
                <div className='text-sm font-light'>Card Number</div>
                <div className='text-sm'>1234-1234-1234-1234</div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Total and make order button sticky bottom */}
      <Card className='container p-4 fixed bottom-0 left-0 rounded-b-none rounded-t-3xl bg-neutral md:relative'>
        <Card.Title className='flex justify-between text-neutral-content'>
          <div className='flex items-center gap-2'>
            <ImPriceTags />
            <h2>{toRupiah(totalPayment)}</h2>
          </div>
          <Button
            className='flex items-center gap-2 rounded-full shadow-md'
            color='primary'
            size='md'
            onClick={handleOrderClick}
          >
            <IoBagCheckOutline className='text-2xl' />
            <h2 className='inline'>Order</h2>
          </Button>
        </Card.Title>
      </Card>

      {/* Shipping Address Modal */}
      <ShippingAddressModal
        addresses={getAddressesData.data}
        currentShippingAddress={shippingAddress}
        open={openModal.shippingAddress}
        onClose={handleModalClose}
        setShippingAddress={setShippingAddress}
      />
      {/* Delivery Service Modal */}
      <DeliveryServiceModal
        deliveryService={deliveryService}
        currentMerchantID={currentMerchantID}
        getShippingCostRequest={getShippingCostRequest}
        open={openModal.deliveryService}
        onClose={handleModalClose}
        setDeliveryService={setDeliveryService}
      />
      {/* Shop Promotion/Voucher Modal */}
      {/* Marketplace Voucher Modal */}
      <MarketplaceVoucherModal
        activeMarketplaceVouchers={getActiveMarketplaceVoucherData.data}
        currentMarketplaceVoucher={marketplaceVoucher}
        totalPayment={calculateTotal(checkout, null, null)}
        open={openModal.marketplaceVoucher}
        onClose={handleModalClose}
        setMarketplaceVoucher={setMarketplaceVoucher}
      />
      {/* Payment Method Modal */}
      <PaymentMethodModal
        currentPaymentMethod={paymentMethod}
        open={openModal.paymentMethod}
        onClose={handleModalClose}
        setPaymentMethod={setPaymentMethod}
      />
      {/* Payment Wallet Pin Modal */}
      <PaymentWalletPinModal
        open={openModal.paymentWalletPin}
        isLoading={payCartWithWalletLoading}
        onClose={handleModalClose}
        onSuccess={handleSuccessPaymentWalletPin}
      />
    </div>
  );
};

export default BuyerCheckout;
