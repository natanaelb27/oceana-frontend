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
  Table,
  Tabs,
  Textarea,
  Tooltip,
} from 'react-daisyui';
import { CgClose } from 'react-icons/cg';
import {
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineShoppingBag,
  HiOutlineReceiptRefund,
  HiOutlineChevronRight,
  HiSearch,
  HiOutlineDotsVertical,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import {
  DELIVERY_STATUS,
  LIMIT_REFUND,
  REFUND_GROUPED_STATUS,
  REFUND_STATUS,
} from '../../../constants';
import { RefundQuery } from '../../../types/query';
import { useGetAllProfileRefundsQuery } from '../../../store/services/profileService';
import { toRefundQuery } from '../../../utils/mapperDTO';
import { ConfirmationModal, Image, Pager } from '../../common';
import { stringCompare } from '../../../utils/validation';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import {
  toLongStringDatetime,
  toRupiah,
  toStringDate,
  toStringTime,
} from '../../../utils/convert';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { UpdateRefundResponse } from '../../../types/response';
import NoData from '../../common/NoData';
import useOutsideAlerter from '../../../hooks/OutsideAlerter';
import moment from 'moment';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import DateCountdown from '../../common/DateCountdown';
import { useLazyGetRefundDetailsQuery } from '../../../store/services/refundService';
import Zoom from 'react-medium-image-zoom';
import { useNavigate } from 'react-router-dom';

type OpenModal = {
  detailRefund: boolean;
  mobileStatus: boolean;
};

const RefundContent = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<OpenModal>({
    detailRefund: false,
    mobileStatus: false,
  });

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

  const [search, setSearch] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRefundQuery({
      ...refundQuery,
      page: 1,
      searchInvoice: search,
    });
  };

  const handleSearchClick = () => {
    setRefundQuery({
      ...refundQuery,
      page: 1,
      searchInvoice: search,
    });
  };

  const {
    data: getAllProfileRefundsData,
    isLoading: getAllProfileRefundsIsLoading,
  } = useGetAllProfileRefundsQuery(toRefundQuery(refundQuery));

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

    setOpenModal({
      detailRefund: false,
      mobileStatus: false,
    });

    setFilterStatus(status);
  };

  const getBadgeColor = (orderStatus: string) => {
    if (stringCompare(orderStatus, REFUND_STATUS.COMPLETED)) {
      return 'success';
    }

    if (
      stringCompare(orderStatus, REFUND_STATUS.APPROVED) ||
      stringCompare(orderStatus, REFUND_STATUS.APPROVED_BY_SYSTEM) ||
      stringCompare(orderStatus, REFUND_STATUS.REJECTED)
    ) {
      return 'info';
    }

    return 'warning';
  };

  const handleModalClose = () => {
    setOpenModal({
      detailRefund: false,
      mobileStatus: false,
    });

    setRefundID(null);
  };

  const handleRefundDetailClick = (id: string) => {
    setRefundID(id);
    getRefundDetails(id);

    setOpenModal({
      detailRefund: true,
      mobileStatus: false,
    });
  };

  const handleResetFilterClick = () => {
    setDateRange([null, null]);
    setSearch('');
    setFilterStatus(REFUND_STATUS.ALL);

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

  const handleNavigateShop = (merchantID: number) => {
    navigate(`/shops/${merchantID}`);
  };

  const handleMobileFilterStatusClick = () => {
    setOpenModal({
      ...openModal,
      mobileStatus: true,
    });
  };

  const getStatusDisplay = (refundStatus: string) => {
    switch (refundStatus) {
      case REFUND_STATUS.ALL:
        return 'All';
      case REFUND_STATUS.ONGOING:
        return 'In Process';
      case REFUND_GROUPED_STATUS.PROCESSED:
        return 'Processed';
      case REFUND_STATUS.COMPLETED:
        return 'Completed';
      default:
        return '';
    }
  };

  const handleRefundClick = (id: string) => {
    navigate(`/user/refund/create/${id}`);
  };

  return (
    <div className='p-4 md:p-10'>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Refund</h5>
      </div>
      <Divider />
      <Tabs
        variant='bordered'
        value={filterStatus}
        onChange={handleFilterStatusClick}
        className='mb-3 border-b-2 hidden md:flex'
      >
        <Tabs.Tab value={REFUND_GROUPED_STATUS.ALL}>All</Tabs.Tab>
        <Tabs.Tab value={REFUND_STATUS.ONGOING}>In Process</Tabs.Tab>
        <Tabs.Tab value={REFUND_GROUPED_STATUS.PROCESSED}>Processed</Tabs.Tab>
        <Tabs.Tab value={REFUND_STATUS.COMPLETED}>Completed</Tabs.Tab>
      </Tabs>
      <div className='flex flex-col md:flex-row gap-3 mb-4'>
        <Form onSubmit={handleFormSubmit} className='w-full md:w-auto'>
          <InputGroup>
            <Input
              type='text'
              placeholder='Search Invoice...'
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
        <div className='flex items-center gap-2 overflow-x-auto'>
          <Button
            className='normal-case flex flex-row gap-1 justify-between btn-outline min-w-[30%] md:hidden'
            onClick={handleMobileFilterStatusClick}
          >
            {getStatusDisplay(filterStatus)}{' '}
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
      <div className='grid grid-cols-12 gap-4'>
        {getAllProfileRefundsIsLoading && (
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
        {!getAllProfileRefundsIsLoading &&
          (getAllProfileRefundsData?.data &&
          getAllProfileRefundsData?.data?.length > 0 ? (
            getAllProfileRefundsData?.data?.map(
              ({
                refund_id,
                order_id,
                invoice_number,
                refund_request_datetime,
                refund_status,
                refund_items,
                total_user_refund_amount,
                shop_name,
                refund_seller_confirmation_expiration_datetime,
                refund_rejected_auto_complete_order_expiration_datetime,
              }) => {
                const productCount = refund_items.length;
                const firstProduct = refund_items.at(0);
                return (
                  <Card
                    className='col-span-12 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                    key={refund_id}
                  >
                    <div className='p-4'>
                      <div className='flex items-center mb-2.5 gap-3 justify-between'>
                        <div className='flex items-center gap-3 justify-between md:justify-start'>
                          <div className='flex gap-3 items-center'>
                            <HiOutlineReceiptRefund className='text-error text-xl' />
                            <span className='font-light text-sm'>
                              {toStringDate(refund_request_datetime)}
                            </span>
                          </div>
                          <Badge
                            color={getBadgeColor(refund_status)}
                            size='sm'
                            className='truncate p-2 font-bold hidden md:flex'
                          >
                            {refund_status}
                          </Badge>
                          <span className='font-light text-sm hidden md:block'>
                            {invoice_number}
                          </span>

                          {stringCompare(
                            refund_status,
                            REFUND_STATUS.ONGOING
                          ) &&
                          refund_seller_confirmation_expiration_datetime ? (
                            <Tooltip
                              message='auto approve refund'
                              className='hidden md:flex'
                            >
                              <DateCountdown
                                date={moment(
                                  refund_seller_confirmation_expiration_datetime
                                ).toDate()}
                              ></DateCountdown>
                            </Tooltip>
                          ) : null}

                          {stringCompare(
                            refund_status,
                            REFUND_STATUS.REJECTED
                          ) &&
                          refund_rejected_auto_complete_order_expiration_datetime ? (
                            <div className='w-fit'>
                              <Tooltip
                                message='auto complete order'
                                className='hidden md:flex'
                              >
                                <DateCountdown
                                  date={moment(
                                    refund_rejected_auto_complete_order_expiration_datetime
                                  ).toDate()}
                                ></DateCountdown>
                              </Tooltip>
                            </div>
                          ) : null}
                        </div>
                        <div className='flex gap-1 items-center'>
                          <Badge
                            color={getBadgeColor(refund_status)}
                            size='sm'
                            className='truncate p-2 font-bold flex md:hidden'
                          >
                            {refund_status}
                          </Badge>
                          {stringCompare(
                            refund_status,
                            REFUND_STATUS.REJECTED
                          ) &&
                          refund_rejected_auto_complete_order_expiration_datetime ? (
                            <div className='flex gap-1'>
                              <Dropdown horizontal='center' vertical='end'>
                                <Dropdown.Toggle color='ghost' size='sm'>
                                  <HiOutlineDotsVertical></HiOutlineDotsVertical>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='w-52'>
                                  <Dropdown.Item
                                    onClick={() => handleRefundClick(order_id)}
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
                        <span className='font-bold'>{shop_name}</span>
                      </div>
                      <div
                        className='flex cursor-pointer'
                        onClick={() => handleRefundDetailClick(refund_id)}
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
                            {firstProduct?.refund_quantity} item
                            {(firstProduct?.refund_quantity || 0) > 1
                              ? 's'
                              : null}{' '}
                            &times;{' '}
                            {toRupiah(
                              Math.round(
                                (firstProduct?.user_refund_amount || 1) /
                                  (firstProduct?.refund_quantity || 1)
                              )
                            )}
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
                              Total Refund Amount
                            </span>
                            <span className='font-bold'>
                              {toRupiah(Math.round(total_user_refund_amount))}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex mt-5 md:mt-3 gap-3 items-center justify-between md:justify-end'>
                        <Button
                          className='normal-case md:w-auto md:pl-7 md:pr-7'
                          color='primary'
                          onClick={() => handleRefundDetailClick(refund_id)}
                        >
                          View Details
                        </Button>
                        <div className='flex flex-col md:hidden'>
                          <span className='font-light text-sm'>
                            Total Amount
                          </span>
                          <span className='font-bold'>
                            {toRupiah(Math.round(total_user_refund_amount))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }
            )
          ) : refundQuery.searchInvoice === '' &&
            refundQuery.filterEndDate === '' &&
            refundQuery.filterEndDate === '' &&
            refundQuery.filterGroupedStatus === REFUND_GROUPED_STATUS.ALL &&
            refundQuery.filterStatus === REFUND_STATUS.ALL ? (
            <div className='col-span-12'>
              <NoData
                title='No complaints from buyers'
                message='You have not received a complaint from the buyer'
              ></NoData>
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
          page={refundQuery.page}
          totalPage={
            getAllProfileRefundsData?.metadata?.total_pages
              ? getAllProfileRefundsData.metadata.total_pages
              : 0
          }
          onPageChange={handlePageChange}
        />
      </div>
      <Modal
        open={openModal.mobileStatus}
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
          Filter Status
        </Modal.Header>
        <Modal.Body>
          <div className='flex flex-col px-4 text-sm'>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() => handleFilterStatusClick(REFUND_STATUS.ALL)}
            >
              <span className='font-bold'>All Refunds</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={filterStatus === REFUND_STATUS.ALL}
                readOnly
              />
            </label>
            <Divider className='m-0'></Divider>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() => handleFilterStatusClick(REFUND_STATUS.ONGOING)}
            >
              <span className='font-bold'>In Process</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={filterStatus === REFUND_STATUS.ONGOING}
                readOnly
              />
            </label>
            <Divider className='m-0'></Divider>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() =>
                handleFilterStatusClick(REFUND_GROUPED_STATUS.PROCESSED)
              }
            >
              <span className='font-bold'>Processed</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={filterStatus === REFUND_GROUPED_STATUS.PROCESSED}
                readOnly
              />
            </label>
            <Divider className='m-0'></Divider>
            <label
              className='flex flex-row justify-between label cursor-pointer'
              onClick={() => handleFilterStatusClick(REFUND_STATUS.COMPLETED)}
            >
              <span className='font-bold'>Completed</span>
              <Radio
                size='md'
                color='primary'
                name='filter-status'
                checked={filterStatus === REFUND_STATUS.COMPLETED}
                readOnly
              />
            </label>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        open={openModal.detailRefund}
        responsive
        className='md:w-12/12 px-0 md:max-w-2xl'
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
        <Modal.Body className='max-h-[48rem] md:grid md:grid-cols-3 md:gap-2 md:overflow-hidden'>
          {getRefundDetailsIsLoading && <div>Loading</div>}
          {!getRefundDetailsIsLoading && getRefundDetailsData?.data && (
            <div className='flex flex-col col-span-3 gap-2 md:max-h-[48rem] md:overflow-y-auto md:border-r-2 md:border-base-200'>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-2 items-center'>
                    <span className='font-bold'>
                      {capitalizeFirstLetter(
                        getRefundDetailsData?.data?.refund_status
                      )}
                    </span>
                  </div>
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
                {stringCompare(
                  getRefundDetailsData?.data?.refund_status,
                  REFUND_STATUS.REJECTED
                ) ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Refund Rejected Date</span>
                    <span className='text-sm'>
                      {toLongStringDatetime(
                        getRefundDetailsData?.data.rejected_datetime
                      )}
                    </span>
                  </div>
                ) : null}
                {stringCompare(
                  getRefundDetailsData?.data?.refund_status,
                  REFUND_STATUS.ONGOING
                ) &&
                getRefundDetailsData?.data
                  ?.refund_seller_confirmation_expiration_datetime ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Approve Refund</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getRefundDetailsData?.data
                            ?.refund_seller_confirmation_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}

                {stringCompare(
                  getRefundDetailsData?.data?.refund_status,
                  REFUND_STATUS.REJECTED
                ) &&
                getRefundDetailsData?.data
                  ?.refund_rejected_auto_complete_order_expiration_datetime ? (
                  <div className='flex justify-between items-center'>
                    <span className='text-sm'>Auto Complete Order</span>
                    <span className='text-sm'>
                      <DateCountdown
                        date={moment(
                          getRefundDetailsData?.data
                            ?.refund_rejected_auto_complete_order_expiration_datetime
                        ).toDate()}
                      ></DateCountdown>
                    </span>
                  </div>
                ) : null}
              </div>
              <div className='flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Refund Media</span>
                </div>
                {getRefundDetailsData?.data?.images?.length ||
                getRefundDetailsData?.data?.videos?.length ||
                0 > 0 ? (
                  <div className='flex flex-wrap gap-4'>
                    {getRefundDetailsData?.data?.videos?.map((video, n) => {
                      return (
                        <video
                          key={n}
                          src={video || ''}
                          controls
                          className='h-20 w-40 rounded-md'
                        />
                      );
                    })}
                    {getRefundDetailsData?.data?.images?.map((image, n) => {
                      return (
                        <Zoom key={n}>
                          <img
                            src={image}
                            className='border rounded-lg w-20 h-20'
                          ></img>
                        </Zoom>
                      );
                    })}
                  </div>
                ) : (
                  <NoData title='It seems that this refund has no media uploaded'></NoData>
                )}
              </div>
              <div className='w-full flex flex-col gap-2 p-5 border-b-8 border-base-200'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Refund Reason</span>
                </div>
                <Textarea
                  className='w-full resize-none min-h-[7rem] disabled:cursor-default'
                  value={
                    getRefundDetailsData?.data?.refund_reason
                      ? getRefundDetailsData?.data?.refund_reason
                      : ''
                  }
                  disabled
                ></Textarea>
              </div>
              <div className='flex flex-col gap-2 p-5'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>Refund Details</span>
                  <div
                    className='flex items-center gap-1 cursor-pointer hover:text-primary'
                    onClick={() => {
                      handleNavigateShop(
                        getRefundDetailsData?.data?.merchant_id || 0
                      );
                    }}
                  >
                    <span className='font-bold text-sm'>
                      {getRefundDetailsData?.data.shop_name}
                    </span>
                    <HiOutlineChevronRight className='text-sm' />
                  </div>
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
                              <span className='font-bold line-clamp-2 md:line-clamp-1 cursor-pointer'>
                                {refundItems.product_name || ''}
                              </span>
                              <span className='font-light text-sm line-clamp-2 md:line-clamp-1'>
                                {refundItems.product_variations}
                              </span>
                              <span className='font-light text-sm'>
                                {refundItems.refund_quantity} &times;{' '}
                                {toRupiah(
                                  Math.round(
                                    (refundItems.user_refund_amount || 1) /
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
                                      Math.round(refundItems.user_refund_amount)
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
                                  Math.round(refundItems.user_refund_amount)
                                )}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    }
                  )}
                  <div className='flex flex-col items-end'>
                    <span className='font-light'>Total Refund Amount</span>
                    <span className='font-bold'>
                      {toRupiah(
                        getRefundDetailsData?.data?.total_user_refund_amount
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

export default RefundContent;
