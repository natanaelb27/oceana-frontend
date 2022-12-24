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
  Form,
  Input,
  InputGroup,
  Rating,
  Tabs,
} from 'react-daisyui';
import { useOutsideAlerter } from '../../../hooks';
import { Pager } from '../../common';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineShoppingBag,
  HiSearch,
} from 'react-icons/hi';
import {
  LIMIT_REVIEW_HISTORY,
  DELIVERY_STATUS,
  REVIEW_STATUS,
} from '../../../constants';
import { TransactionHistoryQuery } from '../../../types/query';
import { useGetAllTransactionHistoryQuery } from '../../../store/services/orderService';
import { toTransactionHistoryQuery } from '../../../utils/mapperDTO';
import { toStringDate } from '../../../utils/convert';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import moment from 'moment';
import NoData from '../../common/NoData';
import { useNavigate } from 'react-router-dom';

const ReviewContent = () => {
  const [filterReviewStatus, setFilterReviewStatus] = useState<string>(
    REVIEW_STATUS.NOT_REVIEWED
  );

  const handleFilterReviewStatusClick = (status: string) => {
    setFilterReviewStatus(status);
    setTransactionHistoryQuery({
      limit: LIMIT_REVIEW_HISTORY,
      page: 1,
      search: '',
      filterOrderStatus: DELIVERY_STATUS.COMPLETED,
      filterOngoingOrderStatus: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
      filterIsReviewed: status,
    });
  };

  const navigate = useNavigate();

  const [transactionHistoryQuery, setTransactionHistoryQuery] =
    useState<TransactionHistoryQuery>({
      limit: LIMIT_REVIEW_HISTORY,
      page: 1,
      search: '',
      filterOrderStatus: DELIVERY_STATUS.COMPLETED,
      filterOngoingOrderStatus: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
      filterIsReviewed: filterReviewStatus,
    });

  const {
    data: getAllTransactionHistoryData,
    isLoading: getAllTransactionHistoryLoading,
  } = useGetAllTransactionHistoryQuery(
    toTransactionHistoryQuery(transactionHistoryQuery)
  );

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

  const handleResetFilterClick = () => {
    setSearch('');
    setDateRange([null, null]);

    setTransactionHistoryQuery({
      limit: LIMIT_REVIEW_HISTORY,
      page: 1,
      search: '',
      filterOrderStatus: DELIVERY_STATUS.COMPLETED,
      filterOngoingOrderStatus: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
      filterIsReviewed: filterReviewStatus,
    });
  };

  const handlePageChange = (n: number) => {
    setTransactionHistoryQuery({
      ...transactionHistoryQuery,
      page: n,
    });
  };

  const handleNavigateShop = (merchantID: number) => {
    navigate(`/shops/${merchantID}`);
  };

  const handleNavigateReviewDetails = (orderID: string) => {
    navigate(`/user/review/detail/${orderID}`);
  };

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Review</h5>
      <Divider />
      <div className='flex flex-col gap-3 mb-5'>
        <div>
          <Tabs
            variant='bordered'
            value={filterReviewStatus}
            onChange={handleFilterReviewStatusClick}
            className='mb-3 border-b-2'
          >
            <Tabs.Tab value={REVIEW_STATUS.NOT_REVIEWED}>
              Waiting for Review
            </Tabs.Tab>
            <Tabs.Tab value={REVIEW_STATUS.REVIEWED}>Review History</Tabs.Tab>
          </Tabs>
        </div>
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
      </div>
      <div className='grid grid-cols-12 gap-4'>
        {getAllTransactionHistoryLoading && (
          <Card className='col-span-12 shadow animate-pulse'>
            <div className='p-4'>
              <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
              <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
            </div>
          </Card>
        )}
        {getAllTransactionHistoryData?.data &&
        getAllTransactionHistoryData?.data.length > 0 ? (
          getAllTransactionHistoryData?.data.map((transactionHistory, n) => {
            return (
              <Card
                className='col-span-12 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                key={n}
              >
                <div className='p-4'>
                  <div className='flex items-center mb-2.5 gap-3 justify-between md:justify-start'>
                    <div className='flex gap-3 items-center'>
                      <HiOutlineShoppingBag className='text-info text-xl' />
                      <span className='font-light text-sm'>
                        {toStringDate(transactionHistory.transaction_datetime)}
                      </span>
                    </div>
                    <span className='font-light text-sm hidden md:block'>
                      {transactionHistory?.invoice_number}
                    </span>
                  </div>
                  <div className='grid md:grid-cols-6 gap-5'>
                    <div className='flex gap-5 items-center col-span-2 md:border-r'>
                      <img
                        src={transactionHistory?.shop_photo || ''}
                        alt={transactionHistory?.shop_name || ''}
                        className='h-12 w-12 md:h-20 md:w-20 rounded-md'
                      />
                      <div className='flex flex-col gap-1'>
                        <span
                          className='font-light text-primary cursor-pointer'
                          onClick={() => {
                            handleNavigateShop(transactionHistory?.merchant_id);
                          }}
                        >
                          {transactionHistory.shop_name}
                        </span>
                        <Badge
                          color='secondary'
                          size='xs'
                          className='font-bold p-2 rounded-none text-white'
                        >
                          Merchant
                        </Badge>
                      </div>
                    </div>
                    <div className='flex  flex-col gap-3 col-span-4'>
                      <span className='font-bold text-sm'>Product List</span>
                      {transactionHistory?.order_details?.map(
                        (orderDetail, n) => {
                          if (n == 2) {
                            return null;
                          }
                          return (
                            <div
                              key={n}
                              className='grid grid-flow-col grid-cols-4 gap-5 items-center'
                            >
                              <div className='flex gap-5 items-center col-span-3'>
                                <img
                                  src={orderDetail?.product_image || ''}
                                  alt={orderDetail?.product_name || ''}
                                  className='h-12 w-12 md:h-20 md:w-20 rounded-md'
                                />
                                {/* desktop version */}
                                <div className='hidden md:flex flex-col gap-1 w-full'>
                                  <span className='font-bold text-sm line-clamp-2 md:line-clamp-1'>
                                    {orderDetail.product_name}
                                  </span>
                                  <span className='text-xs font-light'>
                                    {orderDetail.product_variations}
                                  </span>
                                  {orderDetail?.product_review_id ? (
                                    <Rating
                                      value={orderDetail?.rating || 0}
                                      size='sm'
                                    >
                                      {[1, 2, 3, 4, 5].map((rating, i) => {
                                        return (
                                          <Rating.Item
                                            key={i}
                                            name='rating-1'
                                            value={rating}
                                            className='mask mask-star-2 bg-orange-400'
                                          />
                                        );
                                      })}
                                    </Rating>
                                  ) : (
                                    <span className='text-xs font-light'>
                                      Not reviewed yet
                                    </span>
                                  )}
                                </div>
                                {/* mobile version */}
                                <div
                                  className='flex md:hidden flex-col gap-1 cursor-pointer w-full'
                                  onClick={() => {
                                    handleNavigateReviewDetails(
                                      transactionHistory?.order_id
                                    );
                                  }}
                                >
                                  <span className='font-bold text-sm line-clamp-2 md:line-clamp-1'>
                                    {orderDetail.product_name}
                                  </span>
                                  <span className='text-xs font-light'>
                                    {orderDetail.product_variations}
                                  </span>
                                  {orderDetail?.product_review_id ? (
                                    <Rating
                                      value={orderDetail?.rating || 0}
                                      size='sm'
                                    >
                                      {[1, 2, 3, 4, 5].map((rating, i) => {
                                        return (
                                          <Rating.Item
                                            key={i}
                                            name='rating-1'
                                            value={rating}
                                            className='mask mask-star-2 bg-orange-400'
                                          />
                                        );
                                      })}
                                    </Rating>
                                  ) : (
                                    <span className='text-xs font-light'>
                                      Not reviewed yet
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className='normal-case col-span-3 hidden md:flex justify-center '>
                                {orderDetail?.product_review_id ? (
                                  <Button
                                    className='normal-case text-xs text-base-100 w-32'
                                    color='primary'
                                    size='sm'
                                    onClick={() => {
                                      handleNavigateReviewDetails(
                                        transactionHistory?.order_id
                                      );
                                    }}
                                  >
                                    View Review
                                  </Button>
                                ) : (
                                  <Button
                                    className='normal-case text-xs text-base-100 w-32'
                                    color='primary'
                                    size='sm'
                                    onClick={() => {
                                      handleNavigateReviewDetails(
                                        transactionHistory?.order_id
                                      );
                                    }}
                                  >
                                    Create Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                      {transactionHistory?.order_details?.length > 2 ? (
                        <span
                          className='text-sm font-bold text-primary cursor-pointer'
                          onClick={() => {
                            handleNavigateReviewDetails(
                              transactionHistory?.order_id
                            );
                          }}
                        >
                          load more (+
                          {transactionHistory?.order_details?.length - 2})
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : transactionHistoryQuery.filterStartTransactionDate === '' &&
          transactionHistoryQuery.filterEndTransactionDate === '' &&
          transactionHistoryQuery.search === '' ? (
          <div className='col-span-12'>
            <NoData
              title={`${
                transactionHistoryQuery.filterIsReviewed === 'true'
                  ? 'Oops, it seems that you dont have any reviewed orders'
                  : 'Oops, it seems that you dont have any orders waiting to be reviewed'
              }`}
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
        )}
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
    </div>
  );
};

export default ReviewContent;
