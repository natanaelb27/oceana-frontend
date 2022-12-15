import {
  ChangeEvent,
  createElement,
  FormEvent,
  forwardRef,
  ReactNode,
  Ref,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Countdown,
  Divider,
  Form,
  Input,
  InputGroup,
  Modal,
  Steps,
  Table,
  Tabs,
  Tooltip,
} from 'react-daisyui';
import { CgClose, CgMathPercent } from 'react-icons/cg';
import {
  HiOutlineClipboardCopy,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiPlus,
  HiSearch,
  HiOutlinePencil,
  HiOutlineXCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineReceiptRefund,
  HiOutlineTruck,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import {
  DELIVERY_STATUS,
  DISCOUNT_TYPE,
  LIMIT_SELLER_VOUCHER_LIST,
  LIMIT_TRANSACTION_HISTORY,
  VOUCHER_STATUS,
} from '../../../constants';
import {
  MerchantVoucherQuery,
  TransactionHistoryQuery,
} from '../../../types/query';
import { Merchant } from '../../../types/component';
import { useGetAllMerchantVoucherQuery } from '../../../store/services/shopService';
import {
  useDeleteMerchantVoucherMutation,
  useGetAllMerchantTransactionHistoryQuery,
  useUpdateProcessDeliveryMutation,
  useUpdateProcessOrderMutation,
} from '../../../store/services/myShopService';
import {
  toMerchantVoucherQuery,
  toTransactionHistoryQuery,
} from '../../../utils/mapperDTO';
import { ConfirmationModal, Pager } from '../../common';
import { stringCompare } from '../../../utils/validation';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import {
  toLongStringDatetime,
  toRupiah,
  toStringDate,
  toStringDatetime,
  toStringTime,
} from '../../../utils/convert';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import {
  DeleteMerchantVoucherResponse,
  UpdateOrderStatusResponse,
} from '../../../types/response';
import NoData from '../../common/NoData';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import moment from 'moment';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import { IoWalletOutline } from 'react-icons/io5';
import { useGetOrderDetailsQuery } from '../../../store/services/orderService';
import DateCountdown from '../../common/DateCountdown';
import { computeDatetime, getDateDiffNow } from '../../../utils/date';

type OpenModal = {
  processOrder: boolean;
  cancelOrder: boolean;
  processDelivery: boolean;
  claimFunds: boolean;
  processRefundOrder: boolean;
  detailOrder: boolean;
};

const OrderContent = () => {
  const navigate = useNavigate();

  const [openOrderTracking, setOpenOrderTracking] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<OpenModal>({
    processOrder: false,
    cancelOrder: false,
    processDelivery: false,
    claimFunds: false,
    processRefundOrder: false,
    detailOrder: false,
  });

  const [filterStatus, setFilterStatus] = useState<string>(VOUCHER_STATUS.ALL);

  const [transactionHistoryQuery, setTransactionHistoryQuery] =
    useState<TransactionHistoryQuery>({
      limit: LIMIT_TRANSACTION_HISTORY,
      page: 1,
      search: '',
      filterOrderStatus: DELIVERY_STATUS.ALL,
      filterOngoingOrderStatus: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
    });

  const {
    data: getAllMerchantTransactionHistoryData,
    isLoading: getAllMerchantTransactionHistoryLoading,
  } = useGetAllMerchantTransactionHistoryQuery(
    toTransactionHistoryQuery(transactionHistoryQuery)
  );

  const handlePageChange = (n: number) => {
    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: n,
    });
  };

  const [orderID, setOrderID] = useState<string | null>(null);

  const { data: getOrderDetailsData, isLoading: getOrderDetailsLoading } =
    useGetOrderDetailsQuery(orderID || '');

  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [startDate, endDate] = dateRange;

  const handleFilterDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
  };

  const handlePriorDateClick = (days: number) => {
    const today = new Date();
    const lastNDays = new Date(new Date().setDate(today.getDate() - days));
    setDateRange([lastNDays, today]);
  };

  const handleResetFilterDate = () => {
    setDateRange([null, null]);
    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: 1,
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
    });
    setIsDateOpen(false);
  };

  const handleApplyFilterDate = () => {
    if (startDate && endDate) {
      setTransactionHistoryQuery({
        ...transactionHistoryQuery,
        page: 1,
        filterStartTransactionDate: moment(startDate).format('YYYY-MM-DD'),
        filterEndTransactionDate: moment(endDate).format('YYYY-MM-DD'),
      });
      setIsDateOpen(false);
    }
  };

  type DateContainerProps = {
    className: string;
    children: ReactNode;
  };

  const DateContainer = ({ className, children }: DateContainerProps) => {
    return (
      <div className='p-3 bg-base-100 border-2 shadow-lg'>
        <div className='flex gap-3'>
          <div className='hidden md:flex flex-col gap-3'>
            <Button
              className='normal-case flex gap-2 md:w-auto md:px-5 md:py-0 btn-outline'
              onClick={() => handlePriorDateClick(7)}
            >
              <HiOutlineClock className='text-lg' />
              Last 7 Days
            </Button>
            <Button
              className='normal-case flex gap-2 md:w-auto md:px-5 md:py-0 btn-outline'
              onClick={() => handlePriorDateClick(30)}
            >
              <HiOutlineClock className='text-lg' />
              Last 30 Days
            </Button>
            <Button
              className='normal-case flex gap-2 md:w-auto md:px-5 md:py-0 btn-outline'
              onClick={() => handlePriorDateClick(60)}
            >
              <HiOutlineClock className='text-lg' />
              Last 60 Days
            </Button>
          </div>
          <div className='divider divider-horizontal hidden md:flex'></div>
          <CalendarContainer className={className}>
            <div className='relative'>{children}</div>
          </CalendarContainer>
        </div>
        <Divider className='m-0'></Divider>
        <div className='flex gap-3 justify-end'>
          <Button
            className='normal-case md:w-auto md:px-5 md:py-0'
            color='secondary'
            onClick={handleResetFilterDate}
          >
            Reset
          </Button>
          <Button
            className='normal-case md:w-auto md:px-5 md:py-0'
            color='primary'
            onClick={handleApplyFilterDate}
          >
            Apply
          </Button>
        </div>
      </div>
    );
  };

  type DateCustomInputProps = {
    onClick: () => void;
    value: string;
  };

  const dateWrapperRef = useRef<HTMLDivElement>(null);

  const handleDateOutsideClick = () => {
    if (
      transactionHistoryQuery.filterStartTransactionDate === '' &&
      transactionHistoryQuery.filterEndTransactionDate === ''
    ) {
      setDateRange([null, null]);
      setTransactionHistoryQuery({
        ...transactionHistoryQuery,
        page: 1,
        filterStartTransactionDate: '',
        filterEndTransactionDate: '',
      });
    } else {
      setDateRange([
        moment(
          transactionHistoryQuery.filterStartTransactionDate,
          'YYYY-MM-DD'
        ).toDate(),
        moment(
          transactionHistoryQuery.filterEndTransactionDate,
          'YYYY-MM-DD'
        ).toDate(),
      ]);
    }
    setIsDateOpen(false);
  };

  useOutsideAlerter(dateWrapperRef, handleDateOutsideClick);

  const DateCustomInput = (
    { onClick, value }: DateCustomInputProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        className='normal-case flex gap-2 w-[100%] md:w-auto md:pl-7 md:pr-7 btn-outline no-animation'
        onClick={() => {
          onClick;
          setIsDateOpen(!isDateOpen);
        }}
        ref={ref}
      >
        <HiOutlineCalendar className='text-lg' />
        {value ? value : 'Choose Transaction Date'}
      </Button>
    );
  };

  const handleFilterStatusClick = (status: string) => {
    if (
      [
        DELIVERY_STATUS.PENDING_PAYMENT,
        DELIVERY_STATUS.PENDING_SELLER,
        DELIVERY_STATUS.ON_PROCESS,
        DELIVERY_STATUS.OUT_FOR_DELIVERY,
        DELIVERY_STATUS.DELIVERED,
      ].indexOf(status) >= 0
    ) {
      setTransactionHistoryQuery({
        ...transactionHistoryQuery,
        page: 1,
        filterOrderStatus: DELIVERY_STATUS.ONGOING,
        filterOngoingOrderStatus: status,
      });
    } else {
      setTransactionHistoryQuery({
        ...transactionHistoryQuery,
        page: 1,
        filterOrderStatus: status,
        filterOngoingOrderStatus: '',
      });
    }

    setFilterStatus(status);
  };

  const getBadgeColor = (orderStatus: string) => {
    if (stringCompare(orderStatus, DELIVERY_STATUS.COMPLETED)) {
      return 'success';
    }

    if (
      stringCompare(orderStatus, DELIVERY_STATUS.CANCELED_BUYER) ||
      stringCompare(orderStatus, DELIVERY_STATUS.CANCELED_SELLER) ||
      stringCompare(orderStatus, DELIVERY_STATUS.COMPLAINED)
    ) {
      return 'error';
    }

    return 'warning';
  };

  const [
    updateProcessOrder,
    { isLoading: updateProcessOrderLoading, error: updateProcessOrderError },
  ] = useUpdateProcessOrderMutation();

  const [
    updateProcessDelivery,
    {
      isLoading: updateProcessDeliveryLoading,
      error: updateProcessDeliveryError,
    },
  ] = useUpdateProcessDeliveryMutation();

  const handleModalClose = () => {
    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });

    setOpenOrderTracking(false);

    setOrderID(null);
  };

  const handleProcessOrderClick = (orderID: string) => {
    setOrderID(orderID);

    setOpenModal({
      processOrder: true,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });
  };

  const handleProcessOrder = () => {
    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });

    if (!orderID) {
      return;
    }

    updateProcessOrder(orderID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Order has been updated to processed!');
      })
      .catch((err) => {
        if (err && 'data' in err) {
          const response = err.data as UpdateOrderStatusResponse;

          notifyErrorToast(response.message);
        }
      })
      .finally(() => {
        setOrderID(null);
      });
  };

  const handleCancelOrderClick = (orderID: string) => {
    setOrderID(orderID);

    setOpenModal({
      processOrder: false,
      cancelOrder: true,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });
  };

  const handleCancelOrder = () => {
    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });

    if (!orderID) {
      return;
    }
  };

  const handleProcessDeliveryClick = (orderID: string) => {
    setOrderID(orderID);

    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: true,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });
  };

  const handleProcessDelivery = () => {
    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });

    if (!orderID) {
      return;
    }

    updateProcessDelivery(orderID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Order has been updated to delivered!');
      })
      .catch((err) => {
        if (err && 'data' in err) {
          const response = err.data as UpdateOrderStatusResponse;

          notifyErrorToast(response.message);
        }
      })
      .finally(() => {
        setOrderID(null);
      });
  };

  const handleClaimFundsClick = (orderID: string) => {
    setOrderID(orderID);

    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: true,
      processRefundOrder: false,
      detailOrder: false,
    });
  };

  const handleClaimFunds = () => {
    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });

    if (!orderID) {
      return;
    }
  };

  const handleOrderDetailClick = (orderID: string) => {
    setOrderID(orderID);

    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: true,
    });
  };

  const handleProcessRefundClick = (orderID: string) => {
    setOrderID(orderID);

    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: true,
      detailOrder: false,
    });
  };

  const handleProcessRefund = () => {
    setOpenModal({
      processOrder: false,
      cancelOrder: false,
      processDelivery: false,
      claimFunds: false,
      processRefundOrder: false,
      detailOrder: false,
    });

    if (!orderID) {
      return;
    }
  };

  const handleViewOrderTrackingClick = () => {
    setOpenOrderTracking(!openOrderTracking);
  };

  const handleResetFilterClick = () => {
    setDateRange([null, null]);
    setFilterStatus(DELIVERY_STATUS.ALL);

    setTransactionHistoryQuery({
      limit: LIMIT_TRANSACTION_HISTORY,
      page: 1,
      search: '',
      filterOrderStatus: DELIVERY_STATUS.ALL,
      filterOngoingOrderStatus: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
    });
  };

  return (
    <div className='p-4 md:p-10'>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Order List</h5>
        <div ref={dateWrapperRef} className='w-[100%] md:w-auto'>
          <DatePicker
            selectsRange={true}
            startDate={
              isDateOpen
                ? startDate
                : transactionHistoryQuery.filterStartTransactionDate === ''
                ? null
                : moment(
                    transactionHistoryQuery.filterStartTransactionDate
                  ).toDate()
            }
            endDate={
              isDateOpen
                ? endDate
                : transactionHistoryQuery.filterEndTransactionDate === ''
                ? null
                : moment(
                    transactionHistoryQuery.filterEndTransactionDate
                  ).toDate()
            }
            dateFormat='dd MMM yyyy'
            maxDate={new Date()}
            calendarContainer={DateContainer}
            open={isDateOpen}
            shouldCloseOnSelect={false}
            className='border-2 rounded-lg p-2 text-center'
            onChange={(update) => handleFilterDateChange(update)}
            customInput={createElement(forwardRef(DateCustomInput))}
          />
        </div>
      </div>
      <Divider />
      <Tabs
        variant='bordered'
        value={filterStatus}
        onChange={handleFilterStatusClick}
        className='mb-3 border-b-2'
      >
        <Tabs.Tab value={VOUCHER_STATUS.ALL}>All</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.PENDING_PAYMENT}>Unpaid</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.PENDING_SELLER}>New Order</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.ON_PROCESS}>To Ship</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.OUT_FOR_DELIVERY}>Shipping</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.DELIVERED}>Delivered</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.COMPLETED}>Completed</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.COMPLAINED}>Complained</Tabs.Tab>
        <Tabs.Tab value={DELIVERY_STATUS.CANCELED}>Canceled</Tabs.Tab>
      </Tabs>

      <div className='overflow-x-auto'>
        {getAllMerchantTransactionHistoryData?.data &&
        getAllMerchantTransactionHistoryData?.data.length > 0 ? (
          <Table className='w-[100%]'>
            <Table.Head>
              <span>Products</span>
              <span>Order Total</span>
              <span>Transaction Date</span>
              <span>Courier Service</span>
              <span></span>
            </Table.Head>
            <Table.Body>
              {getAllMerchantTransactionHistoryData?.data.map(
                ({
                  transaction_id,
                  order_id,
                  invoice_number,
                  merchant_id,
                  shop_name,
                  user_id,
                  user_full_name,
                  courier_description,
                  order_details,
                  transaction_datetime,
                  order_status,
                  total_price,
                  refund_id,
                  claim_status,
                  seller_confirmation_expiration_datetime,
                  on_process_expiration_datetime,
                  delivered_expiration_datetime,
                }) => {
                  const productCount = order_details.length;
                  const firstProduct = order_details.at(0);
                  return (
                    <Table.Row key={order_id}>
                      <div className='flex flex-col max-w-md'>
                        <div className='flex'>
                          <div className='flex mr-5'>
                            <img
                              src={firstProduct?.product_image || ''}
                              alt={firstProduct?.product_name || ''}
                              className='h-12 w-12 md:h-20 md:w-20 rounded-md'
                            />
                          </div>
                          <div className='flex flex-col w-[70%]'>
                            <div className='flex gap-2 items-center'>
                              <span className='font-bold line-clamp-2 md:line-clamp-1 mt-0'>
                                {firstProduct?.product_name || ''}
                              </span>
                              {refund_id ? (
                                <Badge
                                  color='error'
                                  size='xs'
                                  className='font-bold p-2 rounded-none text-white'
                                >
                                  refund
                                </Badge>
                              ) : null}
                            </div>
                            <span className='font-light text-sm'>
                              {firstProduct?.quantity} item
                              {firstProduct?.quantity || 0 > 1
                                ? 's'
                                : null}{' '}
                              &times; {toRupiah(firstProduct?.price || 0)}
                            </span>
                            {productCount > 1 ? (
                              <span className='font-light text-sm'>
                                +{productCount - 1} other product
                                {productCount > 2 ? 's' : null}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className='flex text-sm'>
                        <span>{toRupiah(Math.round(total_price))}</span>
                      </div>
                      <div className='flex flex-col gap-2 text-sm'>
                        {toStringDate(transaction_datetime)}
                        <Badge
                          color={getBadgeColor(order_status)}
                          size='xs'
                          className='font-bold p-2'
                        >
                          {order_status}
                        </Badge>

                        {stringCompare(
                          order_status,
                          DELIVERY_STATUS.PENDING_SELLER
                        ) ? (
                          <Tooltip message='auto cancel countdown'>
                            <DateCountdown
                              date={moment(
                                seller_confirmation_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}

                        {stringCompare(
                          order_status,
                          DELIVERY_STATUS.ON_PROCESS
                        ) ? (
                          <Tooltip message='auto cancel countdown'>
                            <DateCountdown
                              date={moment(
                                on_process_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}

                        {stringCompare(
                          order_status,
                          DELIVERY_STATUS.DELIVERED
                        ) ? (
                          <Tooltip message='auto complete countdown'>
                            <DateCountdown
                              date={moment(
                                delivered_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}
                      </div>
                      <div className='flex text-sm'>{courier_description}</div>
                      <div className='flex text-sm'>
                        <div className='flex gap-1'>
                          <Tooltip message='Process Order'>
                            <Button
                              color='success'
                              size='sm'
                              onClick={() => handleProcessOrderClick(order_id)}
                              disabled={
                                !stringCompare(
                                  order_status,
                                  DELIVERY_STATUS.PENDING_SELLER
                                )
                              }
                            >
                              <HiOutlineCheck className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Cancel Order'>
                            <Button
                              color='error'
                              size='sm'
                              onClick={() => handleCancelOrderClick(order_id)}
                              disabled={
                                !stringCompare(
                                  order_status,
                                  DELIVERY_STATUS.PENDING_SELLER
                                )
                              }
                            >
                              <HiOutlineXCircle className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Process Delivery'>
                            <Button
                              color='success'
                              size='sm'
                              onClick={() =>
                                handleProcessDeliveryClick(order_id)
                              }
                              disabled={
                                !stringCompare(
                                  order_status,
                                  DELIVERY_STATUS.ON_PROCESS
                                )
                              }
                            >
                              <HiOutlineTruck className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Process Refund'>
                            <Button
                              color='warning'
                              size='sm'
                              onClick={() => handleProcessRefundClick(order_id)}
                              disabled={
                                !stringCompare(
                                  order_status,
                                  DELIVERY_STATUS.COMPLAINED
                                )
                              }
                            >
                              <HiOutlineReceiptRefund className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Claim Funds'>
                            <Button
                              color='success'
                              size='sm'
                              onClick={() => handleClaimFundsClick(order_id)}
                              disabled={
                                !stringCompare(
                                  order_status,
                                  DELIVERY_STATUS.COMPLETED
                                ) || claim_status
                              }
                            >
                              <IoWalletOutline className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Detail'>
                            <Button
                              color='info'
                              size='sm'
                              onClick={() => handleOrderDetailClick(order_id)}
                            >
                              <HiOutlineClipboardList className='text-lg' />
                            </Button>
                          </Tooltip>
                        </div>
                      </div>
                    </Table.Row>
                  );
                }
              )}
            </Table.Body>
          </Table>
        ) : transactionHistoryQuery.filterOrderStatus === DELIVERY_STATUS.ALL &&
          transactionHistoryQuery.filterStartTransactionDate === '' &&
          transactionHistoryQuery.filterEndTransactionDate === '' &&
          transactionHistoryQuery.filterOngoingOrderStatus === '' ? (
          <NoData
            title='No orders'
            message='Hang in there, fortune will not go away as long as you never give up.'
          />
        ) : (
          <NoData
            title='Oops, there are no transactions that match the filter'
            message='Try to reset or change your filter'
            buttonMessage='Reset Filter'
            buttonHandleClick={handleResetFilterClick}
          />
        )}
      </div>
      <div className='mt-6 flex justify-center'>
        <Pager
          page={transactionHistoryQuery.page}
          totalPage={
            getAllMerchantTransactionHistoryData?.metadata?.total_pages
              ? getAllMerchantTransactionHistoryData.metadata.total_pages
              : 0
          }
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmationModal
        open={openModal.processOrder}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleProcessOrder}
      />
      <ConfirmationModal
        open={openModal.cancelOrder}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleCancelOrder}
      />
      <ConfirmationModal
        open={openModal.processDelivery}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleProcessDelivery}
      />
      <ConfirmationModal
        open={openModal.processRefundOrder}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleProcessRefund}
      />
      <ConfirmationModal
        open={openModal.claimFunds}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleClaimFunds}
      />
      <Modal
        open={openModal.detailOrder}
        responsive
        className='md:w-9/12 md:max-w-2xl px-0'
        onClickBackdrop={handleModalClose}
      >
        <Button
          size='sm'
          shape='circle'
          color='ghost'
          className='absolute right-2 top-2'
          onClick={handleModalClose}
        >
          <CgClose className='text-lg' />
        </Button>
        <Modal.Header className='text-center font-bold'>
          Transaction Detail
        </Modal.Header>
        <Modal.Body className='max-h-[48rem] overflow-y-scroll'>
          {getOrderDetailsLoading && (
            <Card className='col-span-12 shadow animate-pulse'>
              <div className='p-4'>
                <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
                <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
                <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
              </div>
            </Card>
          )}
          {getOrderDetailsData?.data && (
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-[#f3f4f5]'>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-2 items-center'>
                    <span className='font-bold'>
                      {capitalizeFirstLetter(
                        getOrderDetailsData?.data.order_status
                      )}
                    </span>
                    {getOrderDetailsData?.data.refund_id ? (
                      <Badge
                        color='error'
                        size='xs'
                        className='font-bold p-2 rounded-none text-white'
                      >
                        refund
                      </Badge>
                    ) : null}

                    {stringCompare(
                      getOrderDetailsData?.data.order_status,
                      DELIVERY_STATUS.PENDING_SELLER
                    ) ? (
                      <Tooltip
                        position='bottom'
                        message='auto cancel countdown'
                      >
                        <DateCountdown
                          date={moment(
                            getOrderDetailsData?.data
                              .seller_confirmation_expiration_datetime
                          ).toDate()}
                        ></DateCountdown>
                      </Tooltip>
                    ) : null}

                    {stringCompare(
                      getOrderDetailsData?.data.order_status,
                      DELIVERY_STATUS.ON_PROCESS
                    ) ? (
                      <Tooltip
                        position='bottom'
                        message='auto cancel countdown'
                      >
                        <DateCountdown
                          date={moment(
                            getOrderDetailsData?.data
                              .on_process_expiration_datetime
                          ).toDate()}
                        ></DateCountdown>
                      </Tooltip>
                    ) : null}

                    {stringCompare(
                      getOrderDetailsData?.data.order_status,
                      DELIVERY_STATUS.DELIVERED
                    ) ? (
                      <Tooltip
                        position='bottom'
                        message='auto complete countdown'
                      >
                        <DateCountdown
                          date={moment(
                            getOrderDetailsData?.data
                              .delivered_expiration_datetime
                          ).toDate()}
                        ></DateCountdown>
                      </Tooltip>
                    ) : null}
                  </div>
                  <div
                    className='flex cursor-pointer text-primary items-center gap-1'
                    onClick={handleViewOrderTrackingClick}
                  >
                    <span className='text-sm'>
                      {openOrderTracking ? 'Hide' : 'View Detail'}
                    </span>
                    {openOrderTracking ? (
                      <HiOutlineChevronUp className='text-sm' />
                    ) : (
                      <HiOutlineChevronDown className='text-sm' />
                    )}
                  </div>
                </div>
                {openOrderTracking ? (
                  <div className='border-solid border-2 rounded p-3'>
                    <Steps vertical={true}>
                      {getOrderDetailsData?.data.order_tracking_history.map(
                        (history, n) => (
                          <Steps.Step
                            value=''
                            key={n}
                            color='primary'
                            className='h-[5rem]'
                          >
                            <div className='flex flex-col'>
                              <span className='text-sm font-bold text-left'>
                                {history.title}
                              </span>
                              <span className='text-sm font-light text-left'>
                                {toStringDatetime(history.datetime)}
                              </span>
                              <span className='text-sm text-left'>
                                {history.description}
                              </span>
                            </div>
                          </Steps.Step>
                        )
                      )}
                    </Steps>
                  </div>
                ) : null}
                <Divider className='m-0'></Divider>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>No. Invoice</span>
                  <span className='text-sm text-primary cursor-pointer'>
                    {getOrderDetailsData?.data.invoice_number}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Purchase Date</span>
                  <span className='text-sm'>
                    {toLongStringDatetime(
                      getOrderDetailsData?.data.transaction_datetime
                    )}
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-[#f3f4f5]'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Product Details</span>
                  <div className='flex items-center gap-1 cursor-pointer hover:text-primary'>
                    <span className='font-bold text-sm'>
                      {getOrderDetailsData?.data.shop_name}
                    </span>
                    <HiOutlineChevronRight className='text-sm' />
                  </div>
                </div>
                <div className='flex flex-col gap-4'>
                  {getOrderDetailsData?.data.order_details.map(
                    (orderDetail, n) => {
                      return (
                        <Card
                          className='flex gap-3 p-4 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                          key={n}
                        >
                          <div className='grid grid-cols-5 md:grid-cols-8'>
                            <div className='mr-5 col-span-1'>
                              <img
                                src={orderDetail.product_image || ''}
                                alt={orderDetail.product_name || ''}
                                className='h-12 w-12 md:h-18 md:w-18 rounded-md'
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null;
                                  currentTarget.src =
                                    'https://cdn.shopify.com/s/files/1/0332/8881/4637/products/noimageavailable_7b25b64a-d5f8-423b-a498-8a2785ea69b2_2000x.jpg?v=1669356395';
                                }}
                              />
                            </div>
                            <div className='flex flex-col col-span-4'>
                              <span className='font-bold line-clamp-2 md:line-clamp-1  cursor-pointer'>
                                {orderDetail.product_name || ''}
                              </span>
                              <span className='font-light text-sm line-clamp-2 md:line-clamp-1'>
                                {orderDetail.product_variations || ''}
                              </span>
                              <span className='font-light text-sm'>
                                {orderDetail.quantity} &times;{' '}
                                {toRupiah(orderDetail.price || 0)}
                              </span>
                            </div>
                            <div className='hidden md:flex items-center justify-end md:col-span-3'>
                              <div className='divider divider-horizontal'></div>
                              <div className='flex flex-col gap-2'>
                                <div className='flex flex-col text-right'>
                                  <span className='font-light text-sm'>
                                    Total Amount
                                  </span>
                                  <span className='font-bold'>
                                    {toRupiah(
                                      Math.round(orderDetail.total_price)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='flex md:hidden items-center justify-between'>
                            <div className='flex flex-col text-right'>
                              <span className='font-light text-sm'>
                                Total Amount
                              </span>
                              <span className='font-bold'>
                                {toRupiah(Math.round(orderDetail.total_price))}
                              </span>
                            </div>
                            <Button
                              className='normal-case md:w-auto'
                              color='primary'
                            >
                              Buy Again
                            </Button>
                          </div>
                        </Card>
                      );
                    }
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-[#f3f4f5]'>
                <span className='font-bold'>Shipping Info</span>
                <div className='flex flex-col gap-2'>
                  <div className='grid grid-cols-10'>
                    <span className='text-sm col-span-1'>Courier</span>
                    <span className='text-sm col-span-1 text-right mr-2'>
                      :
                    </span>
                    <span className='text-sm col-span-8'>
                      {getOrderDetailsData?.data.courier_description}
                    </span>
                  </div>
                  <div className='grid grid-cols-10'>
                    <span className='text-sm col-span-1'>
                      Buyer&apos;s Name
                    </span>
                    <span className='text-sm col-span-1 text-right mr-2'>
                      :
                    </span>
                    <span className='text-sm col-span-8'>
                      {getOrderDetailsData?.data.user_full_name}
                    </span>
                  </div>
                  <div className='grid grid-cols-10'>
                    <span className='text-sm col-span-1'>Address</span>
                    <span className='text-sm col-span-1 text-right mr-2'>
                      :
                    </span>
                    <span className='text-sm col-span-8'>
                      {getOrderDetailsData?.data.address.detail} <br />
                      {getOrderDetailsData?.data.address.city}
                      {', '}
                      {getOrderDetailsData?.data.address.district}
                      {', '}
                      {getOrderDetailsData?.data.address.province}
                      {', '}
                      {getOrderDetailsData?.data.address.zip_code}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2 p-5'>
                <span className='font-bold'>Payment Details</span>
                <div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm font-light'>Payment Method</span>
                    <span className='text-sm'>
                      {capitalizeFirstLetter(
                        getOrderDetailsData?.data.payment_method
                      )}
                    </span>
                  </div>
                  <Divider className='m-0'></Divider>
                  <div className='flex flex-col gap-2'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-light'>Total Price</span>
                      <span className='text-sm'>
                        {toRupiah(
                          Math.round(
                            getOrderDetailsData?.data
                              .total_price_before_discount
                          )
                        )}
                      </span>
                    </div>
                    {getOrderDetailsData?.data
                      .total_merchant_promotion_discount +
                      getOrderDetailsData?.data
                        .total_merchant_voucher_discount >
                    0 ? (
                      <div className='flex justify-between items-center'>
                        <span className='text-sm font-light'>
                          Total Discount
                        </span>
                        <span className='text-sm'>
                          -
                          {toRupiah(
                            Math.round(
                              getOrderDetailsData?.data
                                .total_merchant_promotion_discount +
                                getOrderDetailsData?.data
                                  .total_merchant_voucher_discount
                            )
                          )}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <Divider className='m-0'></Divider>
                  <div className='flex justify-between items-center'>
                    <span className='font-bold'>Total Order</span>
                    <span className='text-sm'>
                      {toRupiah(
                        Math.round(
                          getOrderDetailsData?.data
                            .total_price_before_discount -
                            getOrderDetailsData?.data
                              .total_merchant_promotion_discount -
                            getOrderDetailsData?.data
                              .total_merchant_voucher_discount
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OrderContent;
