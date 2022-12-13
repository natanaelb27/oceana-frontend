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
  Divider,
  Form,
  Input,
  InputGroup,
  Table,
  Tabs,
  Tooltip,
} from 'react-daisyui';
import { CgMathPercent } from 'react-icons/cg';
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
} from '../../../store/services/myShopService';
import {
  toMerchantVoucherQuery,
  toTransactionHistoryQuery,
} from '../../../utils/mapperDTO';
import { ConfirmationModal, Pager } from '../../common';
import { stringCompare } from '../../../utils/validation';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toRupiah, toStringDate, toStringTime } from '../../../utils/convert';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { DeleteMerchantVoucherResponse } from '../../../types/response';
import NoData from '../../common/NoData';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import moment from 'moment';
import DatePicker, { CalendarContainer } from 'react-datepicker';

const OrderContent = () => {
  const navigate = useNavigate();
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

  const [merchantVoucherID, setMerchantVoucherID] = useState<number | null>(
    null
  );

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
                  order_details,
                  transaction_datetime,
                  order_status,
                  total_price,
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
                            <span className='font-bold line-clamp-2 md:line-clamp-1 mt-0'>
                              {firstProduct?.product_name || ''}
                            </span>
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
                        {toRupiah(Math.round(total_price))}
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
                      </div>
                      <div className='flex text-sm'>
                        <div className='flex gap-1'>
                          <Tooltip message='Process Order'>
                            <Button
                              color='success'
                              size='sm'
                              // onClick={() => handleCancelVoucherClick(id)}
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
                              // onClick={() => handleCancelVoucherClick(id)}
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
                          <Tooltip message='Process Refund'>
                            <Button
                              color='info'
                              size='sm'
                              // onClick={() => handleDetailVoucherClick(id)}
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
                          <Tooltip message='Detail'>
                            <Button
                              color='info'
                              size='sm'
                              // onClick={() => handleDetailVoucherClick(id)}
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
        ) : (
          <NoData
            title='No orders'
            message='Hang in there, fortune will not go away as long as you never give up.'
          />
        )}
      </div>

      {/* <div className='overflow-x-auto'>
        {getAllMerchantVoucherData?.data &&
        getAllMerchantVoucherData?.data.merchant_voucher.length > 0 ? (
          <Table className='w-[100%]'>
            <Table.Head>
              <span>Voucher Information</span>
              <span>Quota</span>
              <span>Period &#38; Status</span>
              <span></span>
            </Table.Head>
            <Table.Body>
              {getAllMerchantVoucherData?.data.merchant_voucher.map(
                ({
                  id,
                  code,
                  start_datetime,
                  end_datetime,
                  discount_type,
                  discount,
                  maximum_discount_amount,
                  maximum_quota,
                  current_quota,
                  voucher_status,
                }) => {
                  const getBadgeColor = (voucherStatus: string) => {
                    if (stringCompare(voucherStatus, VOUCHER_STATUS.UPCOMING)) {
                      return undefined;
                    } else if (
                      stringCompare(voucherStatus, VOUCHER_STATUS.ONGOING)
                    ) {
                      return 'warning';
                    }
                    return 'success';
                  };

                  return (
                    <Table.Row key={id}>
                      <div className='flex items-center space-x-3'>
                        {stringCompare(discount_type, DISCOUNT_TYPE.NOMINAL) ? (
                          <HiOutlineCurrencyDollar className='text-white bg-accent h-12 w-12 md:h-15 md:w-15 rounded-md' />
                        ) : (
                          <CgMathPercent className='text-white bg-secondary h-12 w-12 md:h-15 md:w-15 rounded-md' />
                        )}
                        <div>
                          <div className='font-bold text-sm'>{code}</div>
                          {stringCompare(
                            discount_type,
                            DISCOUNT_TYPE.NOMINAL
                          ) ? (
                            <div className='text-sm opacity-50'>
                              Discount {toRupiah(discount)}
                            </div>
                          ) : (
                            <div className='text-sm opacity-50'>
                              Discount {discount}% till{' '}
                              {toRupiah(maximum_discount_amount)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className='flex gap-1'>
                        <span className='text-sm'>Quota Used:</span>
                        <span className='text-sm font-bold'>
                          {current_quota}/{maximum_quota}
                        </span>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <div className='flex gap-3 items-center text-sm'>
                          <div className='flex flex-col'>
                            <span className='font-bold'>
                              {toStringDate(start_datetime)}
                            </span>
                            <span className='text-sm opacity-50'>
                              {toStringTime(start_datetime)}
                            </span>
                          </div>
                          <div className='w-2 border-t border-black'></div>
                          <div className='flex flex-col'>
                            <span className='font-bold'>
                              {toStringDate(end_datetime)}
                            </span>
                            <span className='text-sm opacity-50'>
                              {toStringTime(end_datetime)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          size='xs'
                          className='font-bold p-2'
                          color={getBadgeColor(voucher_status)}
                        >
                          {capitalizeFirstLetter(voucher_status)}
                        </Badge>
                      </div>
                      <div className='flex gap-1 justify-left'>
                        <div className='flex gap-1'>
                          <Tooltip message='Edit'>
                            <Button
                              color='warning'
                              size='sm'
                              onClick={() => handleEditVoucherClick(id)}
                              disabled={stringCompare(
                                voucher_status,
                                VOUCHER_STATUS.ENDED
                              )}
                            >
                              <HiOutlinePencil className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Cancel'>
                            <Button
                              color='error'
                              size='sm'
                              onClick={() => handleCancelVoucherClick(id)}
                              disabled={
                                !stringCompare(
                                  voucher_status,
                                  VOUCHER_STATUS.UPCOMING
                                )
                              }
                            >
                              <HiOutlineXCircle className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Detail'>
                            <Button
                              color='info'
                              size='sm'
                              onClick={() => handleDetailVoucherClick(id)}
                            >
                              <HiOutlineClipboardList className='text-lg' />
                            </Button>
                          </Tooltip>
                          <Tooltip message='Duplicate'>
                            <Button
                              color='accent'
                              size='sm'
                              onClick={() => handleDuplicateVoucherClick(id)}
                            >
                              <HiOutlineClipboardCopy className='text-lg' />
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
        ) : (
          <NoData
            title='No vouchers?'
            message='Try add new voucher to see some secrets!'
          />
        )}
      </div> */}
      {/* <div className='mt-6 flex justify-center'>
        <Pager
          page={voucherQuery.page}
          totalPage={
            getAllMerchantVoucherData?.metadata?.total_pages
              ? getAllMerchantVoucherData.metadata.total_pages
              : 0
          }
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleDeleteMerchantVoucher}
      /> */}
    </div>
  );
};

export default OrderContent;
