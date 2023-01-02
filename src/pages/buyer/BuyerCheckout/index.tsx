import { useEffect, useState } from 'react';
import { Button, Card, Divider, Textarea, Tooltip } from 'react-daisyui';
import { AiOutlineHome, AiOutlineShop } from 'react-icons/ai';
import { BiReceipt } from 'react-icons/bi';
import { BsTruck } from 'react-icons/bs';
import { FaAddressBook, FaListUl } from 'react-icons/fa';
import {
  HiOutlineChevronDown,
  HiOutlineLocationMarker,
  HiOutlineTruck,
} from 'react-icons/hi';
import { ImPriceTag, ImPriceTags } from 'react-icons/im';
import {
  IoBagCheckOutline,
  IoTicketOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { MdNavigateNext, MdOutlineAddLocationAlt } from 'react-icons/md';
import { TbDiscount2 } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import {
  Image,
  NoData,
  SealabsPayImg,
  Skeleton,
  VoucherTicket,
} from '../../../components/common';
import {
  LIMIT_SELLER_VOUCHER_ALL,
  VOUCHER_AVAILABILITY,
  VOUCHER_STATUS,
} from '../../../constants';
import {
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_UNPROCESSABLE_ENTITY,
} from '../../../constants/statusCodes';
import { useGetAddressesQuery } from '../../../store/services/addressService';
import {
  usePayCartWithSealabsPayMutation,
  usePayCartWithWalletMutation,
} from '../../../store/services/cartService';
import {
  useGetAllSealabsPayQuery,
  useSealabsPayPaymentOTPMutation,
} from '../../../store/services/sealabsPayService';
import { useGetWalletDetailsQuery } from '../../../store/services/walletService';
import {
  selectCheckout,
  setTransactionID,
} from '../../../store/slices/checkoutSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  AdditionalNotes,
  Address,
  AvailableProductsForDelivery,
  CheckoutCartOrderItem,
  CheckoutCartProduct,
  CheckoutCartProductItem,
  DeliveryService,
  MarketplaceVoucher,
  MerchantVoucher,
  MerchantVouchers,
  PaymentMethod,
  SealabsPayAccount,
} from '../../../types/component';
import { MerchantVoucherQuery } from '../../../types/query';
import { GetRajaOngkirShippingCostRequest } from '../../../types/request';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTotal,
  calculateTotalBeforeShipping,
  calculateTotalMerchantDiscount,
  calculateTotalWeight,
  calculateTotalWithShipping,
} from '../../../utils/checkout';
import {
  pascalCaseToTitleCase,
  toCardNumber,
  toETD,
  toPhoneNumber,
  toRupiah,
} from '../../../utils/convert';
import {
  toPayCartWithSealabsPayRequest,
  toPayCartWithWalletRequest,
  toSealabsPayPaymentRequest,
} from '../../../utils/mapperDTO';
import { titleCase } from '../../../utils/titleCase';
import { notifyErrorToast, notifyInfoToast } from '../../../utils/toast';
import DeliveryServiceModal from './DeliveryServiceModal';
import MarketplaceVoucherModal from './MarketplaceVoucherModal';
import MerchantVoucherModal from './MerchantVoucherModal';
import PaymentMethodModal from './PaymentMethodModal';
import PaymentWalletPinModal from './PaymentWalletPinModal';
import SealabsPayAccountsModal from './SealabsPayAccountsModal';
import ShippingAddressModal from './ShippingAddressModal';

type OpenCheckoutModal = {
  shippingAddress: {
    add: boolean;
    change: boolean;
  };
  deliveryService: boolean;
  merchantVoucher: boolean;
  marketplaceVoucher: boolean;
  paymentMethod: boolean;
  paymentWalletPin: boolean;
  sealabsPayAccounts: boolean;
};

const BuyerCheckout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: getAddressesData } = useGetAddressesQuery();
  const { data: getWalletDetailsData, refetch: refetchGetWalletDetails } =
    useGetWalletDetailsQuery('');
  const { data: getAllSealabsPayData } = useGetAllSealabsPayQuery();
  const [payCartWithWallet, { isLoading: payCartWithWalletLoading }] =
    usePayCartWithWalletMutation();
  const [
    payCartWithSealabsPay,
    {
      data: payCartWithSealabsPayData,
      isLoading: payCartWithSealabsPayLoading,
    },
  ] = usePayCartWithSealabsPayMutation();
  const [sealabsPayPaymentOTP] = useSealabsPayPaymentOTPMutation();
  const checkout = useAppSelector(selectCheckout);
  const [openModal, setOpenModal] = useState<OpenCheckoutModal>({
    shippingAddress: {
      add: false,
      change: false,
    },
    deliveryService: false,
    merchantVoucher: false,
    marketplaceVoucher: false,
    paymentMethod: false,
    paymentWalletPin: false,
    sealabsPayAccounts: false,
  });
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Wallet
  );
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [currentSealabsPayAccount, setCurrentSealabsPayAccount] =
    useState<SealabsPayAccount | null>(null);
  const [deliveryService, setDeliveryService] =
    useState<DeliveryService | null>(null);
  const [availableProductsForDelivery, setAvailableProductsForDelivery] =
    useState<AvailableProductsForDelivery>({});
  const [currentMerchantID, setCurrentMerchantID] = useState<number>(0);
  const [currentMerchantProductIDs, setCurrentMerchantProductIDs] = useState<
    number[]
  >([]);
  const [currentMerchantName, setCurrentMerchantName] = useState<string>('');
  const [
    currentMerchantSubtotalBeforeShipping,
    setCurrentMerchantSubtotalBeforeShipping,
  ] = useState<number>(0);
  const [getShippingCostRequest, setGetShippingCostRequest] =
    useState<GetRajaOngkirShippingCostRequest | null>(null);
  const [additionalNotes, setAdditionalNotes] =
    useState<AdditionalNotes | null>(null);
  const [marketplaceVoucher, setMarketplaceVoucher] =
    useState<MarketplaceVoucher | null>(null);
  const [merchantVouchers, setMerchantVouchers] =
    useState<MerchantVouchers | null>(null);
  const [voucherQuery, setVoucherQuery] = useState<MerchantVoucherQuery>({
    limit: LIMIT_SELLER_VOUCHER_ALL,
    page: 1,
    sortBy: '',
    sort: '',
    searchVoucherCode: '',
    filterVoucherStatus: VOUCHER_STATUS.ONGOING,
    filterVoucherAvailability: VOUCHER_AVAILABILITY.AVAILABLE,
    merchantID: currentMerchantID,
  });

  const handleAddAddressClick = () => {
    setOpenModal({
      shippingAddress: {
        add: true,
        change: false,
      },
      deliveryService: false,
      merchantVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
      sealabsPayAccounts: false,
    });
    console.log(openModal);
  };

  const handleChangeAddressClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: true,
      },
      deliveryService: false,
      merchantVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
      sealabsPayAccounts: false,
    });
  };

  const handleChangeAdditionalNotes = (
    e: React.ChangeEvent<HTMLTextAreaElement>
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
    setCurrentMerchantID(merchantID);
    setCurrentMerchantProductIDs(productIDs);
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: true,
      merchantVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
      sealabsPayAccounts: false,
    });
    setGetShippingCostRequest({
      origin,
      destination: shippingAddress.city_id,
      weight: totalWeight,
      courier: '',
      product_ids: productIDs,
    });
  };

  const handleMerchantVoucherClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      merchantVoucher: true,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
      sealabsPayAccounts: false,
    });
  };

  const handleMarketplaceVoucherClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      merchantVoucher: false,
      marketplaceVoucher: true,
      paymentMethod: false,
      paymentWalletPin: false,
      sealabsPayAccounts: false,
    });
  };

  const handlePaymentMethodClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      merchantVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: true,
      paymentWalletPin: false,
      sealabsPayAccounts: false,
    });
  };

  const handlePaymentWalletPinClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      merchantVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: true,
      sealabsPayAccounts: false,
    });
  };

  const handleSealabsPayAccountsClick = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      merchantVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
      sealabsPayAccounts: true,
    });
  };

  const handleModalClose = () => {
    setOpenModal({
      shippingAddress: {
        add: false,
        change: false,
      },
      deliveryService: false,
      merchantVoucher: false,
      marketplaceVoucher: false,
      paymentMethod: false,
      paymentWalletPin: false,
      sealabsPayAccounts: false,
    });
  };

  const handleOrderClick = () => {
    if (!shippingAddress?.id) {
      notifyInfoToast('Please pick a shipping address');
      return;
    }
    // validate active wallet
    if (!getWalletDetailsData?.data?.is_active) {
      notifyInfoToast('Please activate your wallet');
      return;
    }
    // validate wallet balance
    if (walletBalance < totalPayment) {
      notifyInfoToast('Insufficient wallet balance, please top up your wallet');
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
    if (
      paymentMethod === PaymentMethod.SealabsPay &&
      !currentSealabsPayAccount
    ) {
      notifyInfoToast('Please pick a Sealabs Pay Account');
      return;
    }

    const createdOrder = createCheckoutOrder();
    const shippingAddressID = shippingAddress ? shippingAddress.id : '';
    const currentCardNumber = currentSealabsPayAccount
      ? currentSealabsPayAccount.card_number
      : '';
    if (
      paymentMethod === PaymentMethod.SealabsPay &&
      currentCardNumber === ''
    ) {
      notifyInfoToast('No card selected, please select a SealabsPay Account');
      return;
    }
    const currentNameOnCard = currentSealabsPayAccount
      ? currentSealabsPayAccount.name_on_card
      : '';

    const marketplaceVoucherID = marketplaceVoucher
      ? marketplaceVoucher.id
      : null;
    switch (paymentMethod) {
      case PaymentMethod.SealabsPay:
        payCartWithSealabsPay(
          toPayCartWithSealabsPayRequest(
            createdOrder[0] as CheckoutCartOrderItem[],
            createdOrder[1] as number[],
            marketplaceVoucherID,
            shippingAddressID,
            currentCardNumber,
            totalPayment
          )
        )
          .unwrap()
          .then((res) => {
            const { data: paymentResponseData } = res;
            dispatch(
              setTransactionID({
                transactionID: paymentResponseData?.id as string,
              })
            );

            sealabsPayPaymentOTP(
              toSealabsPayPaymentRequest(
                currentNameOnCard,
                currentCardNumber,
                String(totalPayment)
              )
            )
              .unwrap()
              .then((res) => {
                if (!res?.data) return;
                const { data: otpURLData } = res;
                window.location.replace(otpURLData);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => {
            const { data } = err;
            const { message } = data;
            const messageCapitalized = capitalizeFirstLetter(message);
            if (data.code === STATUS_INTERNAL_SERVER_ERROR) {
              notifyErrorToast('Payment failed, our fault. Please try again.');
              return;
            }
            if (data.code === STATUS_UNPROCESSABLE_ENTITY) {
              notifyErrorToast(messageCapitalized);
              notifyInfoToast(
                'We apologize for the inconvenience. Please try again.'
              );
              navigate('/cart');
              return;
            }
            notifyErrorToast(messageCapitalized);
          });
        break;

      default:
        handlePaymentWalletPinClick();
        break;
    }
  };

  // index-0: checkoutCartOrderItems, index-1: cartIDs
  const createCheckoutOrder = () => {
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

          // only add to checkout request if product available for delivery
          if (
            availableProductsForDelivery[
              cartGroupedByMerchant.merchant_id
            ].includes(product.product_id)
          ) {
            if (productIndex < 0) {
              const checkoutCartProductItems: CheckoutCartProductItem[] = [];

              checkoutCartProductItems.push({
                product_item_id: product.product_item_id,
                quantity: product.quantity,
                message,
              });
              // add to array of cart IDs for BE request
              cartIDs.push(product.carts_id);

              const pmpID =
                product.product_merchant_promotion_id !== 0
                  ? product.product_merchant_promotion_id
                  : null;

              const checkoutCartProduct: CheckoutCartProduct = {
                product_id: product.product_id,
                product_merchant_promotion_id: pmpID,
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
          }
        });

        let shippingFee = 0;
        let courierServiceID = 0;
        if (deliveryService) {
          shippingFee = deliveryService[cartGroupedByMerchant.merchant_id]
            ?.courier_services[0].shipping_fee as number;
          courierServiceID = deliveryService[cartGroupedByMerchant.merchant_id]
            ?.courier_services[0].id as number;
        }
        const merchantVoucherID =
          merchantVouchers &&
          merchantVouchers[cartGroupedByMerchant.merchant_id]
            ? (merchantVouchers[cartGroupedByMerchant.merchant_id]
                ?.id as number)
            : null;

        const checkoutCartOrderItem: CheckoutCartOrderItem = {
          merchant_id: cartGroupedByMerchant.merchant_id,
          merchant_voucher_id: merchantVoucherID,
          courier_service_id: courierServiceID,
          shipping_fee: shippingFee,
          products: checkoutCartProducts,
        };
        return checkoutCartOrderItem;
      }
    );
    return [checkoutCartOrderItems, cartIDs];
  };
  const handleSuccessPaymentWalletPin = (pin: string) => {
    const createdOrder = createCheckoutOrder();
    const marketplaceVoucherID = marketplaceVoucher
      ? marketplaceVoucher.id
      : null;

    payCartWithWallet(
      toPayCartWithWalletRequest(
        createdOrder[0] as CheckoutCartOrderItem[],
        createdOrder[1] as number[],
        marketplaceVoucherID,
        shippingAddress?.id as string,
        pin,
        totalPayment
      )
    )
      .unwrap()
      .then(() => navigate('/checkout/success'))
      .catch((err) => {
        const { data } = err;
        const { message } = data;
        const messageCapitalized = capitalizeFirstLetter(message);
        if (data.code === STATUS_INTERNAL_SERVER_ERROR) {
          notifyErrorToast('Payment failed, our fault. Please try again.');
          return;
        }
        if (data.code === STATUS_UNPROCESSABLE_ENTITY) {
          notifyErrorToast(messageCapitalized);
          notifyInfoToast(
            'We apologize for the inconvenience. Please try again.'
          );
          navigate('/cart');
          return;
        }
        notifyErrorToast(messageCapitalized);
      });
  };

  useEffect(() => {
    const initialNotes: AdditionalNotes = {};
    const initialAvailableProductsForDelivery: AvailableProductsForDelivery =
      {};
    checkout.forEach((cartItem) =>
      cartItem.products.forEach((productItem) => {
        initialNotes[productItem.product_item_id] = '';

        if (!initialAvailableProductsForDelivery[cartItem.merchant_id]) {
          initialAvailableProductsForDelivery[cartItem.merchant_id] = [
            productItem.product_id,
          ];
        } else if (
          !initialAvailableProductsForDelivery[cartItem.merchant_id].includes(
            productItem.product_id
          )
        ) {
          initialAvailableProductsForDelivery[cartItem.merchant_id].push(
            productItem.product_id
          );
        }
      })
    );
    setAdditionalNotes(initialNotes);
    setAvailableProductsForDelivery(initialAvailableProductsForDelivery);
  }, []);

  useEffect(() => {
    if (!getAllSealabsPayData?.data) {
      return;
    }
    getAllSealabsPayData.data
      .filter((account) => account.is_default)
      .forEach((account, _, accounts) => {
        if (accounts.length !== 0) {
          setCurrentSealabsPayAccount(account);
          return;
        }
        if (getAllSealabsPayData.data?.length !== 0) {
          setCurrentSealabsPayAccount(
            getAllSealabsPayData.data?.at(0) as SealabsPayAccount
          );
          return;
        }
      });
  }, [getAllSealabsPayData]);
  useEffect(() => {
    if (!getWalletDetailsData?.data) {
      refetchGetWalletDetails();
      return;
    }
    setWalletBalance(getWalletDetailsData.data.balance);
  }, [getWalletDetailsData]);

  useEffect(() => {
    setTotalPayment(
      calculateTotal(
        checkout,
        deliveryService,
        marketplaceVoucher,
        merchantVouchers,
        availableProductsForDelivery
      )
    );
  }, [
    checkout,
    deliveryService,
    marketplaceVoucher,
    merchantVouchers,
    availableProductsForDelivery,
  ]);

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
    !getAllSealabsPayData?.data
  ) {
    return (
      <div className='px-2 container mx-auto flex flex-col'>
        <Skeleton className='my-4 w-44 h-8 rounded-full' />

        <div className='grid grid-cols-1 md:grid-cols-12'>
          <div className='md:col-span-7'>
            {Array(4)
              .fill(0)
              .map((_, n) => (
                <Card key={n} className='p-4 mb-4 shadow-lg'>
                  <Card.Title className='flex justify-between'>
                    <Skeleton className='w-48 h-7 rounded-full' />
                    <Skeleton className='w-12 h-12 rounded-full' />
                  </Card.Title>
                  <Card.Body className='p-0 pl-2 flex flex-col '>
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='w-40 h-5' />
                      <Skeleton className='w-72 h-5' />
                      <Skeleton className='w-32 h-5' />
                    </div>
                    <Divider />
                    <div className='flex justify-between'>
                      <Skeleton className='w-32 h-5' />
                      <Skeleton className='w-32 h-5' />
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </div>

          <div className='col-span-1' />
          {/* Total and make order button sticky bottom */}
          <div className='md:col-span-4'>
            <Card className='container p-6 fixed -bottom-1 left-0 z-30 rounded-b-none rounded-t-3xl bg-neutral shadow-2xl md:sticky md:w-full md:z-0'>
              <Card.Body className='hidden p-0 text-neutral-content md:flex md:flex-col md:mb-2'>
                <Skeleton className='w-20 h-5' />
                <Skeleton className='w-20 h-5' />
              </Card.Body>
              <Card.Title className='flex justify-between text-neutral-content'>
                <Skeleton className='w-32 h-7' />
                <Skeleton className='w-28 h-10 rounded-full' />
              </Card.Title>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='px-2 container mx-auto flex flex-col'>
      <h1 className='font-bold text-2xl text-primary my-4'>
        <Link to='/'>Checkout</Link>
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-12'>
        {/* Shipping address */}
        <div className='md:col-span-7'>
          <Card
            className='group p-4 mb-4 shadow-lg cursor-pointer hover:bg-base-200'
            onClick={
              shippingAddress.id
                ? handleChangeAddressClick
                : handleAddAddressClick
            }
          >
            <Card.Title className='flex justify-between'>
              <div className='flex items-center gap-2 group-hover:text-primary'>
                <HiOutlineLocationMarker />
                <h2>Shipping Address</h2>
              </div>
              {shippingAddress.id ? (
                <Tooltip message='Change shipping address' position='left'>
                  <Button
                    className='bg-primary border-none shadow-md group-hover:bg-secondary'
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
                    className='bg-primary border-none shadow-md group-hover:bg-secondary'
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
                    <p>
                      {toPhoneNumber(shippingAddress.phone_number as string)}
                    </p>
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
                      className='shadow-md border-none hover:bg-secondary'
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
                      <HiOutlineTruck className='text-2xl text-base-content' />
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
                          className={`grid grid-cols-3 p-3 mb-1 rounded-xl md:grid-cols-8 ${
                            !availableProductsForDelivery[merchant_id].includes(
                              product.product_id
                            )
                              ? 'bg-base-200 text-base-content/50'
                              : ''
                          }`}
                        >
                          <div className='h-20 w-20 md:h-24 md:w-24 md:col-span-1'>
                            <Image
                              src={product.product_media_url}
                              className={`rounded-lg h-full w-full ${
                                !availableProductsForDelivery[
                                  merchant_id
                                ].includes(product.product_id)
                                  ? 'opacity-60'
                                  : 'opacity-100'
                              }`}
                              alt='Checkout Item'
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
                              {product.price !==
                              product.price_after_discount ? (
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
                                  product.price_after_discount *
                                    product.quantity
                                )}
                              </div>
                            </div>
                          </div>
                          <div className='col-span-4'>
                            {!availableProductsForDelivery[
                              merchant_id
                            ].includes(product.product_id) ? (
                              <div className='p-3 flex justify-center text-sm text-center text-error bg-base-300 rounded-xl animate-pulse'>
                                Delivery service does not support this product
                              </div>
                            ) : (
                              <Textarea
                                className='w-full'
                                color='primary'
                                id={String(product.product_item_id)}
                                placeholder='Additional Notes (optional)'
                                rows={1}
                                value={
                                  additionalNotes
                                    ? additionalNotes[product.product_item_id]
                                    : ''
                                }
                                onChange={handleChangeAdditionalNotes}
                              />
                            )}
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
                        {deliveryService[merchant_id]?.courier_services[0]
                          .etd &&
                          `Estimated delivery: ${toETD(
                            deliveryService[merchant_id]?.courier_services[0]
                              .etd as string
                          )}`}
                      </div>
                    </div>
                  )}
                </Card>
                <Divider />
                {!merchantVouchers || !merchantVouchers[merchant_id] ? (
                  <Card
                    className='group p-4 shadow-md hover:bg-base-200 active:bg-base-100 cursor-pointer'
                    onClick={() => {
                      setCurrentMerchantID(merchant_id);
                      setCurrentMerchantName(name);
                      setCurrentMerchantSubtotalBeforeShipping(
                        calculateSubtotal(
                          products.filter((product) =>
                            availableProductsForDelivery[merchant_id].includes(
                              product.product_id
                            )
                          )
                        )
                      );
                      setVoucherQuery((prev) => ({
                        ...prev,
                        merchantID: merchant_id,
                      }));
                      handleMerchantVoucherClick();
                    }}
                  >
                    <Card.Title className='flex justify-between'>
                      <div className='flex gap-2 group-hover:text-primary group-active:text-base-content'>
                        <IoTicketOutline />
                        <div className='text-base '>{`${name}'s Vouchers`}</div>
                      </div>
                      <div>
                        <MdNavigateNext className='text-2xl group-hover:text-primary' />
                      </div>
                    </Card.Title>
                  </Card>
                ) : (
                  <VoucherTicket
                    currentVoucher={
                      merchantVouchers[merchant_id] as MerchantVoucher
                    }
                    selectedVoucher={merchantVouchers[merchant_id]}
                    onClickVoucher={() => {
                      setCurrentMerchantID(merchant_id);
                      setCurrentMerchantName(name);
                      setCurrentMerchantSubtotalBeforeShipping(
                        calculateSubtotal(
                          products.filter((product) =>
                            availableProductsForDelivery[merchant_id].includes(
                              product.product_id
                            )
                          )
                        )
                      );
                      setVoucherQuery((prev) => ({
                        ...prev,
                        merchantID: merchant_id,
                      }));
                      handleMerchantVoucherClick();
                    }}
                  />
                )}
                <Divider />
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-1'>
                    <ImPriceTag />
                    <p>Subtotal</p>
                  </div>
                  <p className='text-xl font-bold'>
                    {deliveryService && merchantVouchers
                      ? toRupiah(
                          calculateSubtotal(
                            products,
                            deliveryService[merchant_id]?.courier_services[0]
                              .shipping_fee,
                            merchantVouchers[merchant_id],
                            availableProductsForDelivery[merchant_id]
                          )
                        )
                      : deliveryService
                      ? toRupiah(
                          calculateSubtotal(
                            products,
                            deliveryService[merchant_id]?.courier_services[0]
                              .shipping_fee,
                            null,
                            availableProductsForDelivery[merchant_id]
                          )
                        )
                      : merchantVouchers
                      ? toRupiah(
                          calculateSubtotal(
                            products,
                            0,
                            merchantVouchers[merchant_id],
                            availableProductsForDelivery[merchant_id]
                          )
                        )
                      : toRupiah(
                          calculateSubtotal(
                            products,
                            0,
                            null,
                            availableProductsForDelivery[merchant_id]
                          )
                        )}
                  </p>
                </div>
              </Card>
            )
          )}

          {/* Voucher card */}
          <Card
            className='group p-4 mb-4 shadow-lg cursor-pointer hover:bg-base-200'
            onClick={handleMarketplaceVoucherClick}
          >
            <Card.Title className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <div className='flex items-center text-primary gap-1'>
                  <TbDiscount2 className='text-primary group-hover:text-secondary' />
                  <span className='font-main italic group-hover:text-secondary'>
                    Oceana
                  </span>
                </div>
                <h2>Vouchers</h2>
              </div>
              <Tooltip message="Add a voucher, it's on us!" position='left'>
                <Button
                  className='bg-primary border-none shadow-md group-hover:bg-secondary'
                  shape='circle'
                  size='md'
                  onClick={handleMarketplaceVoucherClick}
                >
                  <IoTicketOutline className='text-2xl' />
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
          <Card className='col-span-1 p-4 mb-4 shadow-lg'>
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
                  className='bg-primary border-none shadow-md hover:bg-secondary'
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
                ) : getAllSealabsPayData.data.length !== 0 ? (
                  <div
                    className='p-4 z-20 flex justify-between items-center cursor-pointer rounded-xl bg-primary/10 hover:bg-primary/20 active:bg-primary/10'
                    onClick={handleSealabsPayAccountsClick}
                  >
                    {currentSealabsPayAccount ? (
                      <>
                        <div className='text-sm font-light'>
                          {currentSealabsPayAccount.name_on_card}
                        </div>
                        <div className='flex gap-2 items-center'>
                          <div className='text-sm font-bold'>
                            {toCardNumber(currentSealabsPayAccount.card_number)}
                          </div>
                          <div className='text-xl'>
                            <HiOutlineChevronDown />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className='flex gap-2 items-center'>
                        <div className='text-sm font-bold'>
                          Please select a card
                        </div>
                        <div className='text-xl'>
                          <HiOutlineChevronDown />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className='p-4 w-full z-20 rounded-xl cursor-pointer bg-primary/10 hover:bg-primary/20 hover:text-accent active:bg-primary/10'
                    onClick={() => navigate('/user/account/sealabs-pay')}
                  >
                    Create an account?
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className='col-span-1' />
        {/* Total and make order button sticky bottom */}
        <div className='md:col-span-4'>
          <Card className='container p-6 fixed bottom-0 left-0 z-40 rounded-b-none rounded-t-3xl text-neutral-content bg-neutral shadow-xl md:sticky md:top-24 md:rounded-3xl md:text-base-content md:bg-base-100 md:w-full md:z-0'>
            <Card.Body className='hidden p-0 md:flex md:flex-col md:gap-1'>
              <div className='flex items-center justify-between text-lg'>
                <div className='flex items-center gap-2'>
                  <ImPriceTag />
                  <h3>
                    {toRupiah(
                      calculateTotalBeforeShipping(
                        checkout,
                        availableProductsForDelivery
                      )
                    )}
                  </h3>
                </div>
                <div>
                  <h3 className='hidden text-xs md:inline'>before shipping</h3>
                </div>
              </div>
              <div className='flex items-center justify-between text-lg'>
                <div className='flex items-center gap-2'>
                  <HiOutlineTruck />
                  <h3>
                    {toRupiah(
                      calculateTotalWithShipping(
                        checkout,
                        deliveryService,
                        availableProductsForDelivery
                      ) -
                        calculateTotalBeforeShipping(
                          checkout,
                          availableProductsForDelivery
                        )
                    )}
                  </h3>
                </div>
                <div>
                  <h3 className='hidden text-xs md:inline'>shipping fee</h3>
                </div>
              </div>
              <div className='flex items-center justify-between text-lg'>
                <div className='flex items-center gap-2'>
                  <IoTicketOutline />
                  <h3>{`${
                    merchantVouchers
                      ? toRupiah(
                          -1 *
                            calculateTotalMerchantDiscount(
                              checkout,
                              merchantVouchers,
                              availableProductsForDelivery
                            )
                        )
                      : toRupiah(0)
                  }`}</h3>
                </div>
                <div>
                  <h3 className='hidden text-xs md:inline'>shop vouchers</h3>
                </div>
              </div>
              <div className='flex items-center justify-between text-lg'>
                <div className='flex items-center gap-2'>
                  <TbDiscount2 className='text-primary' />
                  <h3>{`${
                    marketplaceVoucher
                      ? toRupiah(
                          -1 *
                            calculateDiscount(
                              marketplaceVoucher,
                              calculateTotalBeforeShipping(
                                checkout,
                                availableProductsForDelivery
                              )
                            )
                        )
                      : toRupiah(0)
                  }`}</h3>
                </div>
                <div>
                  <h3 className='hidden text-xs md:inline'>
                    <span className='font-main font-bold italic text-primary'>
                      Oceana
                    </span>{' '}
                    voucher
                  </h3>
                </div>
              </div>
              <Divider className='m-0 md:my-6' />
            </Card.Body>
            <Card.Title className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <ImPriceTags />
                <h2>{toRupiah(totalPayment)}</h2>
              </div>
              <Button
                className='flex items-center gap-2 rounded-full shadow-md'
                color={
                  !payCartWithSealabsPayData && !payCartWithSealabsPayLoading
                    ? 'primary'
                    : 'accent'
                }
                size='md'
                onClick={handleOrderClick}
                loading={
                  Boolean(payCartWithSealabsPayData) ||
                  payCartWithSealabsPayLoading
                }
              >
                {!payCartWithSealabsPayData &&
                  !payCartWithSealabsPayLoading && (
                    <IoBagCheckOutline className='text-2xl' />
                  )}
                <h2 className='inline'>Order</h2>
              </Button>
            </Card.Title>
          </Card>
        </div>
      </div>

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
        currentMerchantProductIDs={currentMerchantProductIDs}
        getShippingCostRequest={getShippingCostRequest}
        open={openModal.deliveryService}
        onClose={handleModalClose}
        setDeliveryService={setDeliveryService}
        setAvailableProductsForDelivery={setAvailableProductsForDelivery}
      />
      {/* Shop Promotion/Voucher Modal */}
      <MerchantVoucherModal
        currentMerchantID={currentMerchantID}
        currentMerchantName={currentMerchantName}
        merchantVouchers={merchantVouchers}
        subtotalBeforeShipping={currentMerchantSubtotalBeforeShipping}
        voucherQuery={voucherQuery}
        open={openModal.merchantVoucher}
        onClose={handleModalClose}
        setMerchantVouchers={setMerchantVouchers}
      />
      {/* Marketplace Voucher Modal */}
      <MarketplaceVoucherModal
        currentMarketplaceVoucher={marketplaceVoucher}
        totalPayment={calculateTotal(checkout, null, null, null)}
        open={openModal.marketplaceVoucher}
        onClose={handleModalClose}
        setMarketplaceVoucher={setMarketplaceVoucher}
      />
      {/* Payment Method Modal */}
      <PaymentMethodModal
        currentPaymentMethod={paymentMethod}
        sealabsPayAccounts={getAllSealabsPayData.data}
        open={openModal.paymentMethod}
        onClose={handleModalClose}
        setPaymentMethod={setPaymentMethod}
      />
      {/* SealabsPay Accounts Modal */}
      <SealabsPayAccountsModal
        open={openModal.sealabsPayAccounts}
        onClose={handleModalClose}
        sealabsPayAccounts={getAllSealabsPayData.data}
        setCurrentSealabsPayAccount={setCurrentSealabsPayAccount}
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
