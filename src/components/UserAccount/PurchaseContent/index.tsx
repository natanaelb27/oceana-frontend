import {
  ChangeEvent,
  createElement,
  forwardRef,
  FormEvent,
  ReactNode,
  Ref,
  useState,
  useRef,
} from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  Dropdown,
  Form,
  Input,
  InputGroup,
  Modal,
  Radio,
  Steps,
  Tooltip,
} from 'react-daisyui';
import { useOutsideAlerter } from '../../../hooks';
import { ConfirmationModal, Image, Pager } from '../../common';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChevronRight,
  HiOutlineShoppingBag,
  HiSearch,
  HiOutlineDotsHorizontal,
  HiOutlineDotsVertical,
} from 'react-icons/hi';
import {
  LIMIT_TRANSACTION_HISTORY,
  DELIVERY_STATUS,
  REVIEW_STATUS,
} from '../../../constants';
import { TransactionHistoryQuery } from '../../../types/query';
import {
  useGetAllTransactionHistoryQuery,
  useLazyGetOrderDetailsQuery,
} from '../../../store/services/orderService';
import { toTransactionHistoryQuery } from '../../../utils/mapperDTO';
import {
  toRupiah,
  toLongStringDatetime,
  toStringDate,
  toStringDatetime,
} from '../../../utils/convert';
import { CgClose } from 'react-icons/cg';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import moment from 'moment';
import NoData from '../../common/NoData';
import { stringCompare } from '../../../utils/validation';
import DateCountdown from '../../common/DateCountdown';
import { Link, useNavigate } from 'react-router-dom';
import { useUpdateCompleteOrderMutation } from '../../../store/services/profileService';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { UpdateOrderStatusResponse } from '../../../types/response';
import { toUrl } from '../../../utils/toUrl';

type OpenModal = {
  completeOrder: boolean;
  detailOrder: boolean;
};

const PurchaseContent = () => {
  const navigate = useNavigate();

  const [transactionHistoryQuery, setTransactionHistoryQuery] =
    useState<TransactionHistoryQuery>({
      limit: LIMIT_TRANSACTION_HISTORY,
      page: 1,
      search: '',
      filterOrderStatus: DELIVERY_STATUS.ALL,
      filterOngoingOrderStatus: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
      filterIsReviewed: REVIEW_STATUS.ALL,
    });

  const {
    data: getAllTransactionHistoryData,
    isLoading: getAllTransactionHistoryLoading,
  } = useGetAllTransactionHistoryQuery(
    toTransactionHistoryQuery(transactionHistoryQuery)
  );

  const [updateCompleteOrder, { isLoading: updateCompleteOrderIsLoading }] =
    useUpdateCompleteOrderMutation();

  const [orderID, setOrderID] = useState<string | null>(null);

  // const { data: getOrderDetailsData, isLoading: getOrderDetailsLoading } =
  //   useGetOrderDetailsQuery(orderID || '');

  const [
    getOrderDetails,
    { data: getOrderDetailsData, isLoading: getOrderDetailsLoading },
  ] = useLazyGetOrderDetailsQuery();

  const getBadgeColor = (orderStatus: string) => {
    if (stringCompare(orderStatus, DELIVERY_STATUS.COMPLETED)) {
      return 'success';
    }

    if (
      stringCompare(orderStatus, DELIVERY_STATUS.CANCELED_BUYER) ||
      stringCompare(orderStatus, DELIVERY_STATUS.CANCELED_SELLER) ||
      stringCompare(orderStatus, DELIVERY_STATUS.CANCELED_SYSTEM) ||
      stringCompare(orderStatus, DELIVERY_STATUS.COMPLAINED)
    ) {
      return 'error';
    }

    return 'warning';
  };

  const getStatusDisplay = (orderStatus: string) => {
    switch (orderStatus) {
      case DELIVERY_STATUS.ALL:
        return 'All';
      case DELIVERY_STATUS.ONGOING:
        return 'Ongoing';
      case DELIVERY_STATUS.PENDING_SELLER:
        return 'Waiting for Confirmation';
      case DELIVERY_STATUS.ON_PROCESS:
        return 'On Process';
      case DELIVERY_STATUS.OUT_FOR_DELIVERY:
        return 'Out for Delivery';
      case DELIVERY_STATUS.DELIVERED:
        return 'Delivered';
      case DELIVERY_STATUS.COMPLAINED:
        return 'Complained';
      case DELIVERY_STATUS.COMPLETED:
        return 'Completed';
      case DELIVERY_STATUS.CANCELED:
        return 'Canceled';
      default:
        return '';
    }
  };

  const [openModal, setOpenModal] = useState<OpenModal>({
    detailOrder: false,
    completeOrder: false,
  });

  const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);
  const [openOrderTracking, setOpenOrderTracking] = useState<boolean>(false);

  const handleRefundClick = (id: string) => {
    navigate(`/user/refund/create/${id}`);
  };

  const handleCompleteOrderClick = (id: string) => {
    setOrderID(id);

    setOpenModal({
      detailOrder: false,
      completeOrder: true,
    });
  };

  const handleCompleteOrder = () => {
    setOpenModal({
      detailOrder: false,
      completeOrder: false,
    });

    if (!orderID) {
      return;
    }

    updateCompleteOrder(orderID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Order has been updated to completed!');
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

  const handleViewDetailsClick = (id: string) => {
    setOrderID(id);
    getOrderDetails(id);

    setOpenModal({
      detailOrder: true,
      completeOrder: false,
    });
  };

  const handleModalClose = () => {
    setOpenModal({
      detailOrder: false,
      completeOrder: false,
    });
    setOpenOrderTracking(false);
    setOrderID(null);
  };

  const handleFilterStatusClick = () => {
    setOpenStatusModal(true);
  };

  const handleStatusModalClose = () => {
    setOpenStatusModal(false);
  };

  const handleViewOrderTrackingClick = () => {
    setOpenOrderTracking(!openOrderTracking);
  };

  const [search, setSearch] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: 1,
      search: search,
    });
  };

  const handleSearchClick = () => {
    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: 1,
      search: search,
    });
  };

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

  const [activeStatusButton, setStatusActiveButton] = useState<string>(
    DELIVERY_STATUS.ALL
  );

  const [activeOngoingStatusButton, setActiveOngoingStatusButton] =
    useState<string>('');

  const handleStatusClick = (status: string) => {
    setStatusActiveButton(status);
    setActiveOngoingStatusButton('');

    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: 1,
      filterOrderStatus: status,
      filterOngoingOrderStatus: '',
    });
  };

  const handleOngoingStatusClick = (status: string) => {
    setStatusActiveButton(DELIVERY_STATUS.ONGOING);
    setActiveOngoingStatusButton(status);

    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: 1,
      filterOrderStatus: DELIVERY_STATUS.ONGOING,
      filterOngoingOrderStatus: status,
    });
  };

  const handleModalFilterStatusClick = (status: string) => {
    setStatusActiveButton(status);
    setActiveOngoingStatusButton('');

    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: 1,
      filterOrderStatus: status,
      filterOngoingOrderStatus: '',
    });

    setOpenStatusModal(false);
  };

  const handleModalFilterOngoingStatusClick = (status: string) => {
    setStatusActiveButton(DELIVERY_STATUS.ONGOING);
    setActiveOngoingStatusButton(status);

    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: 1,
      filterOrderStatus: DELIVERY_STATUS.ONGOING,
      filterOngoingOrderStatus: status,
    });

    setOpenStatusModal(false);
  };

  const handleResetFilterClick = () => {
    setSearch('');
    setDateRange([null, null]);
    handleStatusClick(DELIVERY_STATUS.ALL);

    setTransactionHistoryQuery({
      limit: LIMIT_TRANSACTION_HISTORY,
      page: 1,
      search: '',
      filterOrderStatus: DELIVERY_STATUS.ALL,
      filterOngoingOrderStatus: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
      filterIsReviewed: REVIEW_STATUS.ALL,
    });
  };

  const handlePageChange = (n: number) => {
    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: n,
    });
  };

  const handleStartShoppingClick = () => {
    navigate('/');
  };

  const handleNavigateShop = (merchantID: number) => {
    navigate(`/shops/${merchantID}`);
  };

  const handleNavigateProductPage = (
    productName: string,
    merchantID: number,
    productID: number
  ) => {
    navigate(`/products/${toUrl(productName)}-i.${merchantID}-${productID}`);
  };

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Transaction History</h5>
      <Divider />
      <div className='flex flex-col gap-3 mb-5'>
        <div className='flex flex-col md:flex-row gap-3 items-center'>
          <Form onSubmit={handleFormSubmit} className='w-full md:w-auto'>
            <InputGroup>
              <Input
                type='text'
                placeholder='Search...'
                className='w-full md:max-w-xs'
                value={search}
                onChange={handleSearchChange}
              />
              <Button onClick={handleSearchClick}>
                <HiSearch className='text-lg' />
              </Button>
            </InputGroup>
          </Form>
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
        <div className='flex items-center gap-2'>
          <span className='font-bold hidden md:block'>Status</span>
          <div className='hidden md:flex items-center gap-2 overflow-x-auto overflow-y-hidden p-1'>
            <Button
              className={
                'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
                (activeStatusButton === DELIVERY_STATUS.ALL ? 'btn-active' : '')
              }
              onClick={() => handleStatusClick(DELIVERY_STATUS.ALL)}
            >
              All
            </Button>
            <Button
              className={
                'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
                (activeStatusButton === DELIVERY_STATUS.ONGOING
                  ? 'btn-active'
                  : '')
              }
              onClick={() => handleStatusClick(DELIVERY_STATUS.ONGOING)}
            >
              Ongoing
            </Button>
            <Button
              className={
                'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
                (activeStatusButton === DELIVERY_STATUS.COMPLETED
                  ? 'btn-active'
                  : '')
              }
              onClick={() => handleStatusClick(DELIVERY_STATUS.COMPLETED)}
            >
              Completed
            </Button>
            <Button
              className={
                'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
                (activeStatusButton === DELIVERY_STATUS.CANCELED
                  ? 'btn-active'
                  : '')
              }
              onClick={() => handleStatusClick(DELIVERY_STATUS.CANCELED)}
            >
              Canceled
            </Button>
          </div>
          <div className='flex items-center gap-2 overflow-x-auto'>
            <Button
              className='normal-case flex flex-row gap-1 justify-between btn-outline min-w-[30%] md:hidden'
              onClick={handleFilterStatusClick}
            >
              {getStatusDisplay(
                activeOngoingStatusButton || activeStatusButton
              )}{' '}
              <HiOutlineChevronDown className='text-sm' />
            </Button>
            <Button
              className='normal-case text-sm btn-outline btn-primary'
              onClick={handleResetFilterClick}
            >
              Reset Filter
            </Button>
          </div>
        </div>
        <div
          className={
            activeStatusButton !== DELIVERY_STATUS.ONGOING
              ? 'hidden'
              : 'hidden md:flex gap-2 overflow-x-auto overflow-y-hidden px-1'
          }
        >
          <Button
            className={
              'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
              (activeOngoingStatusButton === DELIVERY_STATUS.PENDING_SELLER
                ? 'btn-active'
                : '')
            }
            onClick={() =>
              handleOngoingStatusClick(DELIVERY_STATUS.PENDING_SELLER)
            }
          >
            Waiting for Confirmation
          </Button>
          <Button
            className={
              'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
              (activeOngoingStatusButton === DELIVERY_STATUS.ON_PROCESS
                ? 'btn-active'
                : '')
            }
            onClick={() => handleOngoingStatusClick(DELIVERY_STATUS.ON_PROCESS)}
          >
            On Process
          </Button>
          <Button
            className={
              'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
              (activeOngoingStatusButton === DELIVERY_STATUS.OUT_FOR_DELIVERY
                ? 'btn-active'
                : '')
            }
            onClick={() =>
              handleOngoingStatusClick(DELIVERY_STATUS.OUT_FOR_DELIVERY)
            }
          >
            Out for Delivery
          </Button>
          <Button
            className={
              'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
              (activeOngoingStatusButton === DELIVERY_STATUS.DELIVERED
                ? 'btn-active'
                : '')
            }
            onClick={() => handleOngoingStatusClick(DELIVERY_STATUS.DELIVERED)}
          >
            Delivered
          </Button>
          <Button
            className={
              'normal-case md:w-auto md:pl-7 md:pr-7 btn-outline ' +
              (activeOngoingStatusButton === DELIVERY_STATUS.COMPLAINED
                ? 'btn-active'
                : '')
            }
            onClick={() => handleOngoingStatusClick(DELIVERY_STATUS.COMPLAINED)}
          >
            Complained
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-4'>
        {getAllTransactionHistoryLoading && (
          <div className='grid col-span-12 gap-4'>
            <div className='grid grid-cols-12 gap-4'>
              <Card className='col-span-12 shadow animate-pulse h-48'>
                <div className='p-4'>
                  <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
                  <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-3/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-4/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
                </div>
              </Card>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <Card className='col-span-12 shadow animate-pulse h-48'>
                <div className='p-4'>
                  <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
                  <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-3/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-4/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
                </div>
              </Card>
            </div>
            <div className='grid grid-cols-12 gap-4'>
              <Card className='col-span-12 shadow animate-pulse h-48'>
                <div className='p-4'>
                  <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
                  <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-3/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-4/5 rounded-full mb-2.5'></div>
                  <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
                </div>
              </Card>
            </div>
          </div>
        )}
        {!getAllTransactionHistoryLoading &&
          (getAllTransactionHistoryData?.data &&
          getAllTransactionHistoryData?.data.length > 0 ? (
            getAllTransactionHistoryData?.data.map((transactionHistory, n) => {
              const productCount = transactionHistory.order_details.length;
              const firstProduct = transactionHistory.order_details.at(0);
              return (
                <Card
                  className='col-span-12 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                  key={n}
                >
                  <div className='p-4'>
                    <div className='flex items-center mb-2.5 gap-3 justify-between'>
                      <div className='flex items-center gap-3 justify-between md:justify-start'>
                        <div className='flex gap-3 items-center'>
                          <HiOutlineShoppingBag className='text-info text-xl' />
                          <span className='font-light text-sm'>
                            {toStringDate(
                              transactionHistory.transaction_datetime
                            )}
                          </span>
                        </div>
                        <Badge
                          color={getBadgeColor(transactionHistory.order_status)}
                          size='sm'
                          className='truncate p-2 font-bold hidden md:flex'
                        >
                          {transactionHistory.order_status}
                        </Badge>
                        <span className='font-light text-sm hidden md:block'>
                          {transactionHistory?.invoice_number}
                        </span>
                        {transactionHistory?.refund_id ? (
                          <Badge
                            color='error'
                            size='xs'
                            className='font-bold p-2 rounded-none text-white'
                          >
                            refund
                          </Badge>
                        ) : null}

                        {stringCompare(
                          transactionHistory?.order_status,
                          DELIVERY_STATUS.PENDING_SELLER
                        ) ? (
                          <Tooltip
                            message='auto cancel order'
                            className='hidden md:flex'
                          >
                            <DateCountdown
                              date={moment(
                                transactionHistory?.seller_confirmation_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}

                        {stringCompare(
                          transactionHistory?.order_status,
                          DELIVERY_STATUS.ON_PROCESS
                        ) ? (
                          <Tooltip
                            message='auto cancel order'
                            className='hidden md:flex'
                          >
                            <DateCountdown
                              date={moment(
                                transactionHistory?.on_process_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}

                        {stringCompare(
                          transactionHistory?.order_status,
                          DELIVERY_STATUS.DELIVERED
                        ) ? (
                          <Tooltip
                            message='auto complete order'
                            className='hidden md:flex'
                          >
                            <DateCountdown
                              date={moment(
                                transactionHistory?.delivered_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}

                        {stringCompare(
                          transactionHistory?.order_status,
                          DELIVERY_STATUS.COMPLAINED
                        ) &&
                        transactionHistory?.refund_seller_confirmation_expiration_datetime ? (
                          <Tooltip
                            message='auto approve refund'
                            className='hidden md:flex'
                          >
                            <DateCountdown
                              date={moment(
                                transactionHistory?.refund_seller_confirmation_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}

                        {stringCompare(
                          transactionHistory?.order_status,
                          DELIVERY_STATUS.COMPLAINED
                        ) &&
                        transactionHistory?.refund_rejected_auto_complete_order_expiration_datetime ? (
                          <Tooltip
                            message='auto complete order'
                            className='hidden md:flex'
                          >
                            <DateCountdown
                              date={moment(
                                transactionHistory?.refund_rejected_auto_complete_order_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
                        ) : null}
                      </div>
                      <div className='flex gap-1 items-center'>
                        <Badge
                          color={getBadgeColor(transactionHistory.order_status)}
                          size='sm'
                          className='truncate p-2 font-bold flex md:hidden'
                        >
                          {transactionHistory.order_status}
                        </Badge>
                        {stringCompare(
                          transactionHistory?.order_status,
                          DELIVERY_STATUS.DELIVERED
                        ) ||
                        (stringCompare(
                          transactionHistory?.order_status,
                          DELIVERY_STATUS.COMPLAINED
                        ) &&
                          transactionHistory?.refund_rejected_auto_complete_order_expiration_datetime) ? (
                          <div className='flex gap-1'>
                            <Dropdown horizontal='center' vertical='end'>
                              <Dropdown.Toggle color='ghost' size='sm'>
                                <HiOutlineDotsVertical></HiOutlineDotsVertical>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className='w-52'>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleRefundClick(
                                      transactionHistory?.order_id
                                    )
                                  }
                                >
                                  Refund
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className='mb-1'>
                      <span className='font-bold'>
                        {transactionHistory.shop_name}
                      </span>
                    </div>
                    <div
                      className='flex cursor-pointer'
                      onClick={() =>
                        handleViewDetailsClick(transactionHistory.order_id)
                      }
                    >
                      <div className='mr-5'>
                        <Image
                          src={firstProduct?.product_image || ''}
                          alt={firstProduct?.product_name || ''}
                          className='h-12 w-12 md:h-20 md:w-20 rounded-md'
                        />
                      </div>
                      <div className='flex flex-col w-[70%]'>
                        <span className='font-bold line-clamp-2 md:line-clamp-1 mt-0'>
                          {firstProduct?.product_name || ''}
                        </span>
                        <span className='font-light text-sm'>
                          {firstProduct?.quantity} item
                          {(firstProduct?.quantity || 0) > 1 ? 's' : null}{' '}
                          &times; {toRupiah(firstProduct?.price || 0)}
                        </span>
                        {productCount > 1 ? (
                          <span className='font-light text-sm'>
                            +{productCount - 1} other product
                            {productCount > 2 ? 's' : null}
                          </span>
                        ) : null}
                      </div>
                      <div className='hidden md:flex items-center'>
                        <div className='divider divider-horizontal'></div>
                        <div className='flex flex-col'>
                          <span className='font-light text-sm'>
                            Total Amount
                          </span>
                          <span className='font-bold'>
                            {toRupiah(
                              Math.round(transactionHistory?.total_price)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex mt-5 md:mt-3 gap-3 items-center justify-between md:justify-end'>
                      <span
                        className='hidden text-primary font-medium text-sm cursor-pointer md:block'
                        onClick={() =>
                          handleViewDetailsClick(transactionHistory.order_id)
                        }
                      >
                        View Transaction Details
                      </span>
                      <div className='flex flex-col md:hidden'>
                        <span className='font-light text-sm'>Total Amount</span>
                        <span className='font-bold'>
                          {toRupiah(
                            Math.round(transactionHistory?.total_price)
                          )}
                        </span>
                      </div>
                      {stringCompare(
                        transactionHistory?.order_status,
                        DELIVERY_STATUS.DELIVERED
                      ) ? (
                        <div className='flex gap-1'>
                          <Button
                            className='normal-case md:w-auto md:pl-7 md:pr-7 hidden md:flex'
                            color='primary'
                            loading={updateCompleteOrderIsLoading}
                            onClick={() => {
                              handleCompleteOrderClick(
                                transactionHistory?.order_id
                              );
                            }}
                          >
                            Complete
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className='normal-case md:w-auto md:pl-7 md:pr-7 hidden md:flex'
                          color='primary'
                          onClick={()=>{
                            handleNavigateProductPage(
                              firstProduct?.current_product_name || '',
                              transactionHistory?.merchant_id || 0,
                              firstProduct?.product_id || 0,
                            );
                          }}
                        >
                          Buy Again
                        </Button>
                      )}

                      <Button
                        className='normal-case md:w-auto md:pl-7 md:pr-7 flex md:hidden'
                        color='primary'
                        onClick={() =>
                          handleViewDetailsClick(transactionHistory.order_id)
                        }
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : stringCompare(activeStatusButton, DELIVERY_STATUS.ALL) &&
            transactionHistoryQuery.filterStartTransactionDate === '' &&
            transactionHistoryQuery.filterEndTransactionDate === '' &&
            transactionHistoryQuery.search === '' ? (
            <div className='col-span-12'>
              <NoData
                title='Oops, it seems that you have never made a purchase'
                message='Start shopping and fulfill your needs at Oceana'
                buttonMessage='Start Shopping'
                buttonHandleClick={handleStartShoppingClick}
              />
            </div>
          ) : (
            <div className='col-span-12'>
              <NoData
                title='Oops, there are no transactions that match the filter'
                message='Try to reset or change your filter'
                buttonMessage='Reset Filter'
                buttonHandleClick={handleResetFilterClick}
              ></NoData>
            </div>
          ))}
      </div>
      <div className='mt-6 flex justify-center'>
        <Pager
          page={transactionHistoryQuery.page}
          totalPage={
            getAllTransactionHistoryData?.metadata?.total_pages
              ? getAllTransactionHistoryData.metadata.total_pages
              : 0
          }
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmationModal
        open={openModal.completeOrder}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleCompleteOrder}
      ></ConfirmationModal>
      <Modal
        open={openStatusModal}
        responsive
        className='md:w-9/12 md:max-w-2xl px-0'
        onClickBackdrop={handleStatusModalClose}
      >
        <Button
          size='sm'
          shape='circle'
          color='ghost'
          className='absolute right-2 top-2'
          onClick={handleStatusModalClose}
        >
          <CgClose className='text-lg' />
        </Button>
        <Modal.Header className='text-center font-bold'>
          Filter Status
        </Modal.Header>
        <Modal.Body>
          <div className='flex flex-col px-4 text-sm'>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() => handleModalFilterStatusClick(DELIVERY_STATUS.ALL)}
            >
              <span className='font-bold'>All Transactions</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={
                  (activeOngoingStatusButton || activeStatusButton) ===
                  DELIVERY_STATUS.ALL
                }
                readOnly
              />
            </label>
            <Divider className='m-0'></Divider>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() =>
                handleModalFilterStatusClick(DELIVERY_STATUS.ONGOING)
              }
            >
              <span className='font-bold'>All Ongoing Transactions</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={
                  (activeOngoingStatusButton || activeStatusButton) ===
                  DELIVERY_STATUS.ONGOING
                }
                readOnly
              />
            </label>
            <Divider className='m-0'></Divider>
            <div className='flex flex-col'>
              <label
                className='flex flex-row justify-between label cursor-pointer ml-6'
                onClick={() =>
                  handleModalFilterOngoingStatusClick(
                    DELIVERY_STATUS.PENDING_SELLER
                  )
                }
              >
                <span className='font-light'>Waiting for Confirmation</span>
                <Radio
                  size='md'
                  color='primary'
                  name='filter-status'
                  checked={
                    (activeOngoingStatusButton || activeStatusButton) ===
                    DELIVERY_STATUS.PENDING_SELLER
                  }
                  readOnly
                />
              </label>
              <Divider className='m-0'></Divider>
              <label
                className='flex flex-row justify-between label cursor-pointer ml-6'
                onClick={() =>
                  handleModalFilterOngoingStatusClick(
                    DELIVERY_STATUS.ON_PROCESS
                  )
                }
              >
                <span className='font-light'>On Process</span>
                <Radio
                  size='md'
                  color='primary'
                  name='filter-status'
                  checked={
                    (activeOngoingStatusButton || activeStatusButton) ===
                    DELIVERY_STATUS.ON_PROCESS
                  }
                  readOnly
                />
              </label>
              <Divider className='m-0'></Divider>
              <label
                className='flex flex-row justify-between label cursor-pointer ml-6'
                onClick={() =>
                  handleModalFilterOngoingStatusClick(
                    DELIVERY_STATUS.OUT_FOR_DELIVERY
                  )
                }
              >
                <span className='font-light'>Out for Delivery</span>
                <Radio
                  size='md'
                  color='primary'
                  name='filter-status'
                  checked={
                    (activeOngoingStatusButton || activeStatusButton) ===
                    DELIVERY_STATUS.OUT_FOR_DELIVERY
                  }
                  readOnly
                />
              </label>
              <Divider className='m-0'></Divider>
              <label
                className='flex flex-row justify-between label cursor-pointer ml-6'
                onClick={() =>
                  handleModalFilterOngoingStatusClick(DELIVERY_STATUS.DELIVERED)
                }
              >
                <span className='font-light'>Delivered</span>
                <Radio
                  size='md'
                  color='primary'
                  name='filter-status'
                  checked={
                    (activeOngoingStatusButton || activeStatusButton) ===
                    DELIVERY_STATUS.DELIVERED
                  }
                  readOnly
                />
              </label>
              <Divider className='m-0'></Divider>
              <label
                className='flex flex-row justify-between label cursor-pointer ml-6'
                onClick={() =>
                  handleModalFilterOngoingStatusClick(
                    DELIVERY_STATUS.COMPLAINED
                  )
                }
              >
                <span className='font-light'>Complained</span>
                <Radio
                  size='md'
                  color='primary'
                  name='filter-status'
                  checked={
                    (activeOngoingStatusButton || activeStatusButton) ===
                    DELIVERY_STATUS.COMPLAINED
                  }
                  readOnly
                />
              </label>
            </div>
            <Divider className='m-0'></Divider>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() =>
                handleModalFilterOngoingStatusClick(DELIVERY_STATUS.COMPLETED)
              }
            >
              <span className='font-bold'>Completed</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={
                  (activeOngoingStatusButton || activeStatusButton) ===
                  DELIVERY_STATUS.COMPLETED
                }
                readOnly
              />
            </label>
            <Divider className='m-0'></Divider>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() =>
                handleModalFilterOngoingStatusClick(DELIVERY_STATUS.CANCELED)
              }
            >
              <span className='font-bold'>Canceled</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={
                  (activeOngoingStatusButton || activeStatusButton) ===
                  DELIVERY_STATUS.CANCELED
                }
                readOnly
              />
            </label>
          </div>
        </Modal.Body>
      </Modal>
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
        <Modal.Body className='max-h-[48rem] md:overflow-y-scroll'>
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
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
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

                {stringCompare(
                  getOrderDetailsData?.data.order_status,
                  DELIVERY_STATUS.PENDING_SELLER
                ) ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Cancel Order</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getOrderDetailsData?.data
                            .seller_confirmation_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}

                {stringCompare(
                  getOrderDetailsData?.data.order_status,
                  DELIVERY_STATUS.ON_PROCESS
                ) ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Cancel Order</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getOrderDetailsData?.data
                            .on_process_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}

                {stringCompare(
                  getOrderDetailsData?.data.order_status,
                  DELIVERY_STATUS.DELIVERED
                ) ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Complete Order</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getOrderDetailsData?.data
                            .delivered_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}

                {stringCompare(
                  getOrderDetailsData?.data.order_status,
                  DELIVERY_STATUS.COMPLAINED
                ) &&
                getOrderDetailsData?.data
                  ?.refund_seller_confirmation_expiration_datetime ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Approve Refund</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getOrderDetailsData?.data
                            .refund_seller_confirmation_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}

                {stringCompare(
                  getOrderDetailsData?.data.order_status,
                  DELIVERY_STATUS.COMPLAINED
                ) &&
                getOrderDetailsData?.data
                  ?.refund_rejected_auto_complete_order_expiration_datetime ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Complete Order</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getOrderDetailsData?.data
                            .refund_rejected_auto_complete_order_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}
              </div>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Product Details</span>
                  <div
                    className='flex items-center gap-1 cursor-pointer hover:text-primary'
                    onClick={() => {
                      handleNavigateShop(
                        getOrderDetailsData?.data?.merchant_id || 0
                      );
                    }}
                  >
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
                              <Image
                                src={orderDetail.product_image || ''}
                                alt={orderDetail.product_name || ''}
                                className='h-12 w-12 md:h-18 md:w-18 rounded-md'
                              />
                            </div>
                            <div className='flex flex-col col-span-4'>
                              <Link
                                to={`/product-snapshot/${orderDetail?.order_detail_id}`}
                                target={'_blank'}
                              >
                                <span className='font-bold line-clamp-2 md:line-clamp-1 cursor-pointer'>
                                  {orderDetail.product_name || ''}
                                </span>
                              </Link>
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
                                <Button
                                  className='normal-case md:w-auto'
                                  color='primary'
                                  onClick={() => {
                                    handleNavigateProductPage(
                                      orderDetail?.current_product_name,
                                      getOrderDetailsData?.data?.merchant_id || 0,
                                      orderDetail?.product_id,
                                    );
                                  }}
                                >
                                  Buy Again
                                </Button>
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
                              onClick={()=>{
                                handleNavigateProductPage(
                                  orderDetail?.current_product_name,
                                  getOrderDetailsData?.data?.merchant_id || 0,
                                  orderDetail?.product_id,
                                );
                              }}
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
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
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
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-light'>
                        Total Shipping Fee
                      </span>
                      <span className='text-sm'>
                        {toRupiah(
                          Math.round(getOrderDetailsData?.data.shipping_fee)
                        )}
                      </span>
                    </div>
                    {getOrderDetailsData?.data
                      .total_merchant_promotion_discount +
                      getOrderDetailsData?.data
                        .total_merchant_voucher_discount +
                      getOrderDetailsData?.data
                        .total_marketplace_voucher_discount >
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
                                  .total_merchant_voucher_discount +
                                getOrderDetailsData?.data
                                  .total_marketplace_voucher_discount
                            )
                          )}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <Divider className='m-0'></Divider>
                  <div className='flex justify-between items-center'>
                    <span className='font-bold'>Total Payment</span>
                    <span className='text-sm'>
                      {toRupiah(
                        Math.round(getOrderDetailsData?.data.total_payment)
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

export default PurchaseContent;
