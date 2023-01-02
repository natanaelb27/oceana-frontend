import moment from 'moment';
import { Button, Card, Divider, Tooltip } from 'react-daisyui';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useGetAllUserPendingPaymentQuery } from '../../../store/services/orderService';
import { useSealabsPayPaymentOTPMutation } from '../../../store/services/sealabsPayService';
import { setTransactionID } from '../../../store/slices/checkoutSlice';
import { useAppDispatch } from '../../../store/store';
import { PendingPayment } from '../../../types/component';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toRupiah, toStringDate } from '../../../utils/convert';
import { toSealabsPayPaymentRequest } from '../../../utils/mapperDTO';
import DateCountdown from '../../common/DateCountdown';
import NoData from '../../common/NoData';

const PendingPaymentContent = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    data: getAllUserPendingPaymentData,
    isLoading: getAllUserPendingPaymentLoading,
  } = useGetAllUserPendingPaymentQuery();
  const [sealabsPayPaymentOTP] = useSealabsPayPaymentOTPMutation();

  const handleStartShoppingClick = () => {
    navigate('/');
  };

  const handlePayClick = (transaction: PendingPayment) => {
    dispatch(
      setTransactionID({
        transactionID: transaction.transaction_id,
      })
    );

    sealabsPayPaymentOTP(
      toSealabsPayPaymentRequest(
        null,
        transaction.card_number,
        String(transaction.total_payment)
      )
    )
      .unwrap()
      .then((res) => {
        if (!res?.data) return;
        const { data: otpURLData } = res;
        window.location.replace(otpURLData);
      })
      .catch((err) => console.error(err));
  };

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
              <div className='h-4 bg-base-200 w-3/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-4/5 rounded-full mb-2.5'></div>
              <div className='h-4 bg-base-200 w-full rounded-full mb-2.5'></div>
            </div>
          </Card>
        )}
        {!getAllUserPendingPaymentLoading &&
          (getAllUserPendingPaymentData?.data &&
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
                          <Tooltip message='auto cancel countdown'>
                            <DateCountdown
                              date={moment(
                                transaction?.payment_expiration_datetime
                              ).toDate()}
                            ></DateCountdown>
                          </Tooltip>
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
                              <span className='font-light text-sm hidden md:flex'>
                                Payment Method
                              </span>
                              <span className='font-bold'>
                                {capitalizeFirstLetter(
                                  transaction.payment_method_name
                                )}
                              </span>
                              <span className='font-light flex md:hidden'>
                                {transaction.card_number}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className='hidden md:flex items-center'>
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
                      <div className='flex items-center justify-between'>
                        <div className='hidden md:flex divider divider-horizontal'></div>
                        <div className='flex flex-col'>
                          <span className='font-light text-sm'>
                            Total Payment
                          </span>
                          <span className='font-bold'>
                            {toRupiah(Math.round(transaction.total_payment))}
                          </span>
                        </div>
                        <Button
                          className='normal-case md:w-auto md:pl-7 md:pr-7 flex md:hidden'
                          color='primary'
                          onClick={() => handlePayClick(transaction)}
                        >
                          Pay
                        </Button>
                      </div>
                    </div>
                    <div className='flex mt-3 gap-3 items-center justify-between md:justify-end'>
                      <Button
                        className='normal-case md:w-auto md:pl-7 md:pr-7 hidden md:flex'
                        color='primary'
                        onClick={() => handlePayClick(transaction)}
                      >
                        Pay
                      </Button>
                    </div>
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
                buttonHandleClick={handleStartShoppingClick}
              ></NoData>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PendingPaymentContent;
