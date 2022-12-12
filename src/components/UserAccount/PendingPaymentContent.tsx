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
  Modal,
  Radio,
  Steps,
} from 'react-daisyui';
import { useOutsideAlerter } from '../../hooks';
import { Pager } from '../../components/common';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChevronRight,
  HiOutlineShoppingBag,
  HiSearch,
} from 'react-icons/hi';
import { LIMIT_TRANSACTION_HISTORY, DELIVERY_STATUS } from '../../constants';
import { TransactionHistoryQuery } from '../../types/query';
import {
  useGetAllTransactionHistoryQuery,
  useGetAllUserPendingPaymentQuery,
  useGetOrderDetailsQuery,
} from '../../store/services/orderService';
import { toTransactionHistoryQuery } from '../../utils/mapperDTO';
import {
  toRupiah,
  toLongStringDatetime,
  toStringDate,
  toStringDatetime,
} from '../../utils/convert';
import { CgClose } from 'react-icons/cg';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import moment from 'moment';
import NoData from '../common/NoData';
import { stringCompare } from '../../utils/validation';
import DateCountdown from '../common/DateCountdown';

const PendingPaymentContent = () => {
  const {
    data: getAllUserPendingPaymentData,
    isLoading: getAllUserPendingPaymentLoading,
  } = useGetAllUserPendingPaymentQuery();

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Pending Payment</h5>
      <Divider />
      <div className='grid grid-cols-12 gap-4'>
        {getAllUserPendingPaymentLoading && (
          <Card className='col-span-12 shadow animate-pulse'>
            <div className='p-4'>
              <div className='h-6 bg-base-200 w-1/5 rounded-full mb-4'></div>
              <div className='h-4 bg-base-200 w-2/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
            </div>
          </Card>
        )}
        {getAllUserPendingPaymentData?.data &&
        getAllUserPendingPaymentData?.data.length > 0 ? (
          getAllUserPendingPaymentData?.data.map((transaction, n) => {
            return (
              <Card
                className='col-span-12 shadow border-r-0 border-b-4 md:border-b-0 border-r-primary border-b-primary transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'
                key={n}
              >
                <div className='p-4'>
                  <div className='flex items-center mb-2.5 gap-3 justify-between md:justify-start'>
                    <div className='flex items-center justify-between w-full'>
                      <div className='flex gap-3 items-center'>
                        <HiOutlineShoppingBag className='text-info text-xl' />
                        <span className='font-light text-sm'>
                          {toStringDate(transaction.transaction_datetime)}
                        </span>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span className='font-light text-sm hidden md:flex'>
                          Payment expired at
                        </span>
                        <Badge
                          color='warning'
                          className='flex gap-1 bg-opacity-50'
                        >
                          <HiOutlineClock />
                          <DateCountdown
                            date={moment(
                              transaction?.payment_expiration_datetime
                            ).toDate()}
                          ></DateCountdown>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-5'>
                    <div className='flex flex-col md:flex-row md:items-center gap-5'>
                      <div className='flex items-center gap-5'>
                        <div className='mr-5'>
                          <img
                            src={transaction.payment_method_image || ''}
                            alt={transaction.payment_method_name || ''}
                            className='h-20 w-20 rounded-md'
                          />
                        </div>
                        <div className='flex items-center'>
                          <div className='flex flex-col'>
                            <span className='font-light text-sm'>
                              Payment Method
                            </span>
                            <span className='font-bold'>
                              {capitalizeFirstLetter(
                                transaction.payment_method_name
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <div className='hidden md:flex divider divider-horizontal'></div>
                        <div className='flex flex-col'>
                          <span className='font-light text-sm'>
                            Card Number
                          </span>
                          <span className='font-bold'>
                            {transaction.card_number}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className='hidden md:flex divider divider-horizontal'></div>
                      <div className='flex flex-col'>
                        <span className='font-light text-sm'>
                          Total Payment
                        </span>
                        <span className='font-bold'>
                          {toRupiah(Math.round(transaction.total_payment))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex mt-3 gap-3 items-center justify-between md:justify-end'>
                    <Button
                      className='normal-case md:w-auto md:pl-7 md:pr-7 hidden md:flex'
                      color='error'
                    >
                      Cancel Payment
                    </Button>
                    <Button
                      className='normal-case md:w-auto md:pl-7 md:pr-7 hidden md:flex'
                      color='primary'
                    >
                      Pay
                    </Button>
                  </div>
                  {/* <div className='flex mt-3 gap-3 items-center justify-between md:justify-end'>
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
                        {toRupiah(Math.round(transactionHistory?.total_price))}
                      </span>
                    </div>
                    <Button
                      className='normal-case md:w-auto md:pl-7 md:pr-7 hidden md:flex'
                      color='primary'
                    >
                      Buy Again
                    </Button>
                    <Button
                      className='normal-case md:w-auto md:pl-7 md:pr-7 flex md:hidden'
                      color='primary'
                      onClick={() =>
                        handleViewDetailsClick(transactionHistory.order_id)
                      }
                    >
                      View Details
                    </Button>
                  </div> */}
                </div>
              </Card>
            );
          })
        ) : (
          <div className='col-span-12'>
            <NoData
              title='There are no transactions'
              message='Start shopping and fulfill your needs at Oceana'
              buttonMessage='Start Shopping'
              // buttonHandleClick={handleResetFilterClick}
            ></NoData>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPaymentContent;
