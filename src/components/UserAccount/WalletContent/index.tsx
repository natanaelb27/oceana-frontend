import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, Card, Divider } from 'react-daisyui';
import DatePicker from 'react-datepicker';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';
import { HiLockOpen, HiOutlineCalendar } from 'react-icons/hi';
import { IoWalletOutline } from 'react-icons/io5';
import { WALLET_TRANSACTION_HISTORY_TYPE } from '../../../constants';
import { useLazyGetWalletDetailsQuery } from '../../../store/services/walletService';

import { toRupiah } from '../../../utils/convert';
import { Pager } from '../../common';
import NoData from '../../common/NoData';
import ActivateWalletModal from './ActivateWalletModal';

const WalletContent = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [type, setType] = useState<string | null>(null);

  const [getWalletDetails, { data: getWalletDetailsData }] =
    useLazyGetWalletDetailsQuery();

  useEffect(() => {
    getWalletDetails();
  }, []);

  const handleTypeChange = (type: string | null) => {
    setType(type);
  };

  const handlePageChange = () => {
    console.log('');
  };

  if (!getWalletDetailsData?.data) {
    return (
      <div className='p-4 md:p-10 animate-pulse'>
        <div className='h-6 bg-base-200 rounded-full w-36 max-w-3/5'></div>
        <Divider />
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12 md:col-span-4'>
            <Card className='shadow'>
              <div className='p-4'>
                <div className='h-12 w-full bg-base-200 rounded-full mb-2'></div>
                <div className='h-4 w-full bg-base-200 rounded-full'></div>
                <Divider />
                <div className='h-12 w-full bg-base-200 rounded-full mb-2'></div>
                <div className='h-12 w-full bg-base-200 rounded-full'></div>
              </div>
            </Card>
          </div>
          <div className='col-span-12 md:col-span-8'>
            <Card className='shadow'>
              <div className='p-4'>
                <div className='grid grid-col-12 mb-10'>
                  <div className='h-6 bg-base-200 rounded-full col-span-12 w-2/5'></div>
                  <Divider className='col-span-12' />
                  <div className='h-6 bg-base-200 rounded-full col-span-12 w-2/5 mb-4'></div>
                  <Card className='col-span-12 shadow mb-2.5'>
                    <div className='p-4'>
                      <div className='h-4 w-3/5 bg-base-200 rounded-full mb-2'></div>
                      <div className='h-4 w-2/5 bg-base-200 rounded-full'></div>
                    </div>
                  </Card>
                  <Card className='col-span-12 shadow mb-2.5'>
                    <div className='p-4'>
                      <div className='h-4 w-3/5 bg-base-200 rounded-full mb-2'></div>
                      <div className='h-4 w-2/5 bg-base-200 rounded-full'></div>
                    </div>
                  </Card>
                  <Card className='col-span-12 shadow mb-2.5'>
                    <div className='p-4'>
                      <div className='h-4 w-3/5 bg-base-200 rounded-full mb-2'></div>
                      <div className='h-4 w-2/5 bg-base-200 rounded-full'></div>
                    </div>
                  </Card>
                  <Card className='col-span-12 shadow mb-2.5'>
                    <div className='p-4'>
                      <div className='h-4 w-3/5 bg-base-200 rounded-full mb-2'></div>
                      <div className='h-4 w-2/5 bg-base-200 rounded-full'></div>
                    </div>
                  </Card>
                  <Card className='col-span-12 shadow'>
                    <div className='p-4'>
                      <div className='h-4 w-3/5 bg-base-200 rounded-full mb-2'></div>
                      <div className='h-4 w-2/5 bg-base-200 rounded-full'></div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Wallet</h5>
      <Divider />
      <div className='grid grid-cols-12 gap-4'>
        <div className='col-span-12 md:col-span-4'>
          <Card className='shadow'>
            <Card.Body>
              <div className='flex items-center gap-4 mb-2.5'>
                <IoWalletOutline className='text-4xl text-success' />
                <div className='flex flex-col'>
                  <span className='text-sm'>Balance</span>
                  <span className='font-bold text-2xl'>
                    {toRupiah(getWalletDetailsData.data.balance)}
                  </span>
                </div>
              </div>
              <span className='text-xs font-light text-center'>
                ID: {getWalletDetailsData.data.id}
              </span>
              <Divider />
              <Button
                className='font-medium normal-case'
                startIcon={<FaMoneyBillWaveAlt className='text-xl' />}
                color='primary'
              >
                Top Up
              </Button>
              <Button
                className='font-medium normal-case'
                startIcon={<HiLockOpen className='text-xl' />}
              >
                Change PIN
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className='col-span-12 md:col-span-8'>
          <Card className='shadow'>
            <Card.Body>
              <div className='flex flex-col md:flex-row items-center md:justify-between w-full gap-2'>
                <h5 className='text-2xl font-bold'>History</h5>
                <div className='w-full md:w-auto'>
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update);
                    }}
                    maxDate={moment().toDate()}
                    customInput={
                      <Button
                        startIcon={<HiOutlineCalendar className='text-xl' />}
                        className='normal-case font-medium w-full'
                        color={startDate && endDate ? 'secondary' : 'ghost'}
                      >
                        {startDate && endDate
                          ? `${moment(startDate).format(
                              'DD MMM YYYY'
                            )} - ${moment(endDate).format('DD MMM YYYY')}`
                          : 'Choose Date'}
                      </Button>
                    }
                  />
                </div>
              </div>
              <Divider />
              <div className='flex justify-center md:justify-start gap-1 mb-4'>
                <Button
                  size='sm'
                  className='font-normal normal-case'
                  variant={type === null ? undefined : 'outline'}
                  color={type === null ? 'secondary' : undefined}
                  onClick={() => handleTypeChange(null)}
                >
                  All
                </Button>
                <Button
                  size='sm'
                  className='font-normal normal-case'
                  variant={
                    type === WALLET_TRANSACTION_HISTORY_TYPE.DEBIT
                      ? undefined
                      : 'outline'
                  }
                  color={
                    type === WALLET_TRANSACTION_HISTORY_TYPE.DEBIT
                      ? 'secondary'
                      : undefined
                  }
                  onClick={() =>
                    handleTypeChange(WALLET_TRANSACTION_HISTORY_TYPE.DEBIT)
                  }
                >
                  Debit
                </Button>
                <Button
                  size='sm'
                  className='font-normal normal-case'
                  variant={
                    type === WALLET_TRANSACTION_HISTORY_TYPE.CREDIT
                      ? undefined
                      : 'outline'
                  }
                  color={
                    type === WALLET_TRANSACTION_HISTORY_TYPE.CREDIT
                      ? 'secondary'
                      : undefined
                  }
                  onClick={() =>
                    handleTypeChange(WALLET_TRANSACTION_HISTORY_TYPE.CREDIT)
                  }
                >
                  Credit
                </Button>
              </div>
              {getWalletDetailsData.data.wallet_transaction_history.length >
              0 ? (
                <>
                  <div className='grid grid-cols-12 gap-4 mb-4'>
                    {getWalletDetailsData.data.wallet_transaction_history
                      .filter((row) => (type ? row.type === type : true))
                      .map((row) =>
                        row.type === WALLET_TRANSACTION_HISTORY_TYPE.DEBIT ? (
                          <Card className='col-span-12 shadow border-r-0 border-b-4 md:border-r-8 md:border-b-0 border-r-error border-b-error transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'>
                            <div className='p-4'>
                              <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
                                <div className='flex flex-col'>
                                  <span className='font-medium mb-2'>
                                    {row.transaction_type}
                                  </span>
                                  <span className='text-sm'>
                                    {moment(row.transaction_date).format(
                                      'DD MMM YYYY HH:mm'
                                    )}
                                  </span>
                                </div>
                                <h5 className='font-bold text-xl text-error'>
                                  -{toRupiah(row.amount)}
                                </h5>
                              </div>
                            </div>
                          </Card>
                        ) : (
                          <Card className='col-span-12 shadow border-r-0 border-b-4 md:border-r-8 md:border-b-0 border-r-success border-b-success transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200'>
                            <div className='p-4'>
                              <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
                                <div className='flex flex-col'>
                                  <span className='font-medium mb-2'>
                                    {row.transaction_type}
                                  </span>
                                  <span className='text-sm'>
                                    {moment(row.transaction_date).format(
                                      'DD MMM YYYY HH:mm'
                                    )}
                                  </span>
                                </div>
                                <h5 className='font-bold text-xl text-success'>
                                  +{toRupiah(row.amount)}
                                </h5>
                              </div>
                            </div>
                          </Card>
                        )
                      )}
                  </div>
                  <div className='mx-auto'>
                    <Pager
                      page={1}
                      totalPage={1}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : (
                <NoData
                  title='No transactions?'
                  message='How about top up your wallet or buy some stuffs?'
                />
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
      <ActivateWalletModal data={getWalletDetailsData.data} />
    </div>
  );
};

export default WalletContent;
