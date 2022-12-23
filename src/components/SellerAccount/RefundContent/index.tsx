import {
  createElement,
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
  Divider,
  Modal,
  Steps,
  Table,
  Tabs,
  Tooltip,
} from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import {
  HiOutlineClipboardList,
  HiOutlineXCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineReceiptRefund,
  HiOutlineTruck,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineX,
} from 'react-icons/hi';
import {
  DELIVERY_STATUS,
  LIMIT_REFUND,
  LIMIT_TRANSACTION_HISTORY,
  REFUND_GROUPED_STATUS,
  REFUND_STATUS,
  REVIEW_STATUS,
  VOUCHER_STATUS,
} from '../../../constants';
import { RefundQuery } from '../../../types/query';
import {
  useSellerCancelOrderMutation,
  useUpdateProcessDeliveryMutation,
  useUpdateProcessOrderMutation,
  useLazyGetMerchantOrderDetailsQuery,
  useSellerClaimFundsMutation,
  useGetAllMerchantRefundsQuery,
} from '../../../store/services/myShopService';
import { toRefundQuery } from '../../../utils/mapperDTO';
import { ConfirmationModal, Image, Pager } from '../../common';
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
import { UpdateOrderStatusResponse } from '../../../types/response';
import NoData from '../../common/NoData';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import moment from 'moment';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import { IoWalletOutline } from 'react-icons/io5';
import DateCountdown from '../../common/DateCountdown';
import { useLazyGetRefundDetailsQuery } from '../../../store/services/refundService';

type OpenModal = {
  approveRefund: boolean;
  rejectRefund: boolean;
  detailRefund: boolean;
};

const RefundContent = () => {
  const navigate = useNavigate();

  const [openOrderTracking, setOpenOrderTracking] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<OpenModal>({
    approveRefund: false,
    rejectRefund: false,
    detailRefund: false,
  });

  const [filterGroupedStatus, setFilterGroupedStatus] = useState<string>(
    REFUND_GROUPED_STATUS.ALL
  );
  const [filterStatus, setFilterStatus] = useState<string>(REFUND_STATUS.ALL);

  const [refundQuery, setRefundQuery] = useState<RefundQuery>({
    sort: '',
    sortBy: '',
    limit: LIMIT_REFUND,
    page: 1,
    searchInvoice: '',
    filterGroupedStatus: REFUND_GROUPED_STATUS.ALL,
    filterStatus: REFUND_STATUS.ALL,
    filterStartDate: '',
    filterEndDate: '',
  });

  const {
    data: getAllMerchantRefundsData,
    isLoading: getAllMerchantRefundsIsLoading,
  } = useGetAllMerchantRefundsQuery(toRefundQuery(refundQuery));

  const handlePageChange = (n: number) => {
    setRefundQuery({
      ...refundQuery,
      page: n,
    });
  };

  const [refundID, setRefundID] = useState<string | null>(null);

  const [
    getRefundDetails,
    { data: getRefundDetailsData, isLoading: getRefundDetailsIsLoading },
  ] = useLazyGetRefundDetailsQuery();

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
    setRefundQuery({
      ...refundQuery,
      page: 1,
      filterStartDate: '',
      filterEndDate: '',
    });
    setIsDateOpen(false);
  };

  const handleApplyFilterDate = () => {
    if (startDate && endDate) {
      setRefundQuery({
        ...refundQuery,
        page: 1,
        filterStartDate: moment(startDate).format('YYYY-MM-DD'),
        filterEndDate: moment(endDate).format('YYYY-MM-DD'),
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
      refundQuery.filterStartDate === '' &&
      refundQuery.filterEndDate === ''
    ) {
      setDateRange([null, null]);
      setRefundQuery({
        ...refundQuery,
        page: 1,
        filterStartDate: '',
        filterEndDate: '',
      });
    } else {
      setDateRange([
        moment(refundQuery.filterStartDate, 'YYYY-MM-DD').toDate(),
        moment(refundQuery.filterEndDate, 'YYYY-MM-DD').toDate(),
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
        {value ? value : 'Choose Refund Request Date'}
      </Button>
    );
  };

  const handleFilterStatusClick = (status: string) => {
    if ([REFUND_GROUPED_STATUS.PROCESSED].indexOf(status) >= 0) {
      setRefundQuery({
        ...refundQuery,
        page: 1,
        filterGroupedStatus: status,
        filterStatus: REFUND_STATUS.ALL,
      });
    } else {
      setRefundQuery({
        ...refundQuery,
        page: 1,
        filterGroupedStatus: REFUND_GROUPED_STATUS.ALL,
        filterStatus: status,
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
      stringCompare(orderStatus, DELIVERY_STATUS.CANCELED_SYSTEM) ||
      stringCompare(orderStatus, DELIVERY_STATUS.COMPLAINED)
    ) {
      return 'error';
    }

    return 'warning';
  };

  const [updateProcessOrder, { isLoading: updateProcessOrderIsLoading }] =
    useUpdateProcessOrderMutation();

  const [updateProcessDelivery, { isLoading: updateProcessDeliveryIsLoading }] =
    useUpdateProcessDeliveryMutation();

  const [sellerCancelOrder, { isLoading: sellerCancelOrderIsLoading }] =
    useSellerCancelOrderMutation();

  const [sellerClaimFunds, { isLoading: sellerClaimFundsIsLoading }] =
    useSellerClaimFundsMutation();

  const handleModalClose = () => {
    setOpenModal({
      detailRefund: false,
      approveRefund: false,
      rejectRefund: false,
    });

    setRefundID(null);
  };

  const handleRefundDetailClick = (id: string) => {
    setRefundID(id);
    getRefundDetails(id);

    setOpenModal({
      detailRefund: true,
      approveRefund: false,
      rejectRefund: false,
    });
  };

  const handleResetFilterClick = () => {
    setDateRange([null, null]);
    setFilterStatus(DELIVERY_STATUS.ALL);

    setRefundQuery({
      sort: '',
      sortBy: '',
      limit: LIMIT_REFUND,
      page: 1,
      searchInvoice: '',
      filterGroupedStatus: REFUND_GROUPED_STATUS.ALL,
      filterStatus: REFUND_STATUS.ALL,
      filterStartDate: '',
      filterEndDate: '',
    });
  };

  return (
    <div className='p-4 md:p-10'>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Refund List</h5>
        <div ref={dateWrapperRef} className='w-[100%] md:w-auto'>
          <DatePicker
            selectsRange={true}
            startDate={
              isDateOpen
                ? startDate
                : refundQuery.filterStartDate === ''
                ? null
                : moment(refundQuery.filterStartDate).toDate()
            }
            endDate={
              isDateOpen
                ? endDate
                : refundQuery.filterEndDate === ''
                ? null
                : moment(refundQuery.filterEndDate).toDate()
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
        <Tabs.Tab value={REFUND_GROUPED_STATUS.ALL}>All</Tabs.Tab>
        <Tabs.Tab value={REFUND_STATUS.ONGOING}>To Process</Tabs.Tab>
        <Tabs.Tab value={REFUND_GROUPED_STATUS.PROCESSED}>Processed</Tabs.Tab>
      </Tabs>

      <div className='overflow-x-auto'>
        <Table className='w-[100%] z-0'>
          <Table.Head>
            <span>Invoice Number</span>
            <span>Products</span>
            <span>Refund Total</span>
            <span>Refund Request Date</span>
            <span></span>
          </Table.Head>
          <Table.Body>
            {getAllMerchantRefundsData?.data?.map(
              ({
                refund_id,
                order_id,
                invoice_number,
                merchant_id,
                shop_name,
                user_id,
                user_full_name,
                refund_request_datetime,
                rejected_datetime,
                refund_status,
                images,
                videos,
                refund_items,
                total_user_refund_amount,
                total_merchant_lost_amount,
              }) => {
                const productCount = refund_items.length;
                const firstProduct = refund_items.at(0);
                return (
                  <Table.Row key={refund_id}>
                    <div className='flex text-sm'>{invoice_number}</div>
                    <div className='flex flex-col max-w-md'>
                      <div className='flex'>
                        <div className='flex mr-5'>
                          <Image
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
                          </div>
                          <span className='font-light text-sm'>
                            {firstProduct?.refund_quantity} item
                            {firstProduct?.refund_quantity || 0 > 1
                              ? 's'
                              : null}
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
                      <span>
                        {toRupiah(Math.round(total_merchant_lost_amount))}
                      </span>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-col text-sm'>
                        <span className='font-bold'>
                          {toStringDate(refund_request_datetime)}
                        </span>
                        <span className='opacity-50'>
                          {toStringTime(refund_request_datetime)}
                        </span>
                      </div>
                      <Badge
                        size='xs'
                        className='font-bold p-2'
                        color={getBadgeColor(refund_status)}
                      >
                        {refund_status}
                      </Badge>
                    </div>
                    <div className='flex'>
                      <Tooltip message='Detail'>
                        <Button
                          color='info'
                          size='sm'
                          onClick={() => handleRefundDetailClick(refund_id)}
                        >
                          <HiOutlineClipboardList className='text-lg' />
                        </Button>
                      </Tooltip>
                    </div>
                  </Table.Row>
                );
              }
            )}
          </Table.Body>
        </Table>
      </div>
      <div className='mt-6 flex justify-center'>
        <Pager
          page={refundQuery.page}
          totalPage={
            getAllMerchantRefundsData?.metadata?.total_pages
              ? getAllMerchantRefundsData.metadata.total_pages
              : 0
          }
          onPageChange={handlePageChange}
        />
      </div>
      <Modal
        open={openModal.detailRefund}
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
          Refund Detail
        </Modal.Header>
        <Modal.Body className='max-h-[48rem] overflow-y-scroll'>
          {getRefundDetailsData?.data && (
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-[#f3f4f5]'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>
                    {capitalizeFirstLetter(
                      getRefundDetailsData?.data?.refund_status
                    )}
                  </span>
                </div>
                <Divider className='m-0'></Divider>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>No. Invoice</span>
                  <span className='text-sm text-primary cursor-pointer'>
                    {getRefundDetailsData?.data.invoice_number}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Issuer Name</span>
                  <span className='text-sm'>
                    {getRefundDetailsData?.data.user_full_name}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Refund Request Date</span>
                  <span className='text-sm'>
                    {toLongStringDatetime(
                      getRefundDetailsData?.data.refund_request_datetime
                    )}
                  </span>
                </div>
              </div>
              <div className='flex flex-col gap-2 p-5'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Refund Details</span>
                </div>
                <div className='flex flex-col gap-4'>
                  {getRefundDetailsData?.data.refund_items.map(
                    (refundItems, n) => {
                      return (
                        <Card
                          className='flex gap-3 p-4 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                          key={n}
                        >
                          <div className='grid grid-cols-5 md:grid-cols-8'>
                            <div className='mr-5 col-span-1'>
                              <Image
                                src={refundItems.product_image || ''}
                                alt={refundItems.product_name || ''}
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
                                {refundItems.product_name || ''}
                              </span>
                              <span className='font-light text-sm line-clamp-2 md:line-clamp-1'>
                                {refundItems.product_variations}
                              </span>
                              <span className='font-light text-sm'>
                                {refundItems.refund_quantity} &times;{' '}
                                {toRupiah(
                                  Math.round(
                                    (refundItems.merchant_lost_amount || 1) /
                                      (refundItems.refund_quantity || 1)
                                  )
                                )}
                              </span>
                            </div>
                            <div className='hidden md:flex items-center justify-end md:col-span-3'>
                              <div className='divider divider-horizontal'></div>
                              <div className='flex flex-col gap-2'>
                                <div className='flex flex-col text-right'>
                                  <span className='font-light text-sm'>
                                    Refund Amount
                                  </span>
                                  <span className='font-bold'>
                                    {toRupiah(
                                      Math.round(
                                        refundItems.merchant_lost_amount
                                      )
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='flex md:hidden items-center justify-between'>
                            <div className='flex flex-col text-right'>
                              <span className='font-light text-sm'>
                                Refund Amount
                              </span>
                              <span className='font-bold'>
                                {toRupiah(
                                  Math.round(refundItems.merchant_lost_amount)
                                )}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                  )}
                  <div className='flex justify-end gap-1'>
                    <span className='font-light'>Total Refund Amount: </span>
                    <span className='font-bold'>
                      {toRupiah(
                        getRefundDetailsData?.data?.total_merchant_lost_amount
                      )}
                    </span>
                  </div>
                  <div className='flex justify-end gap-2'>
                    <Button
                      className='normal-case btn-primary'
                      startIcon={<HiOutlineCheck />}
                    >
                      Approve
                    </Button>
                    <Button
                      className='normal-case btn-error'
                      startIcon={<HiOutlineX />}
                    >
                      Reject
                    </Button>
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

export default RefundContent;
