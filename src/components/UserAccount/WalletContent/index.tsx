import moment from 'moment';
import {
  createElement,
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button, Card, Divider } from 'react-daisyui';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';
import { HiLockOpen, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { IoWalletOutline } from 'react-icons/io5';
import {
  LIMIT_WALLET_HISTORY,
  WALLET_TRANSACTION_HISTORY_TYPE,
} from '../../../constants';
import {
  useGetWalletDetailsQuery,
  useLazyGetWalletDetailsQuery,
} from '../../../store/services/walletService';

import Cookies from 'js-cookie';
import { toRupiah } from '../../../utils/convert';
import { Pager } from '../../common';
import NoData from '../../common/NoData';
import ActivateWalletModal from './ActivateWalletModal';
import ChangeWalletPinModal from './ChangeWalletPinModal';
import StepUpPasswordModal from './StepUpPasswordModal';
import { WalletHistoryQuery } from '../../../types/query';
import { toWalletHistoryQuery } from '../../../utils/mapperDTO';
import { useOutsideAlerter } from '../../../hooks';
import SelectSealabsPayModal from './SelectSealabsPayModal';
import InputTopupAmountModal from './InputTopupAmountModal';

type DateContainerProps = {
  className: string;
  children: ReactNode;
};

type DateCustomInputProps = {
  onClick: () => void;
  value: string;
};

type SealabsPayDetails = {
  nameOnCard: string;
  cardNumber: string;
};

const WalletContent = () => {
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const [startDate, endDate] = dateRange;

  const handlePriorDateClick = (days: number) => {
    const today = new Date();
    const lastNDays = new Date(new Date().setDate(today.getDate() - days));
    setDateRange([lastNDays, today]);
  };

  const handleResetFilterDate = () => {
    setDateRange([null, null]);
    setWalletHistoryQuery({
      ...walletHistoryQuery,
      page: 1,
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
    });
    setIsDateOpen(false);
  };

  const handleApplyFilterDate = () => {
    if (startDate && endDate) {
      setWalletHistoryQuery({
        ...walletHistoryQuery,
        page: 1,
        filterStartTransactionDate: moment(startDate).format('YYYY-MM-DD'),
        filterEndTransactionDate: moment(endDate).format('YYYY-MM-DD'),
      });
      setIsDateOpen(false);
    }
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

  const dateWrapperRef = useRef<HTMLDivElement>(null);

  const handleDateOutsideClick = () => {
    if (
      walletHistoryQuery.filterStartTransactionDate === '' &&
      walletHistoryQuery.filterEndTransactionDate === ''
    ) {
      setDateRange([null, null]);
      setWalletHistoryQuery({
        ...walletHistoryQuery,
        filterStartTransactionDate: '',
        filterEndTransactionDate: '',
      });
    } else {
      setDateRange([
        moment(
          walletHistoryQuery.filterStartTransactionDate,
          'YYYY-MM-DD'
        ).toDate(),
        moment(
          walletHistoryQuery.filterEndTransactionDate,
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
        {value ? value : 'Choose Date'}
      </Button>
    );
  };

  const handleFilterDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
  };

  const [type, setType] = useState<string>('');

  // step up password
  const [openStepUpPasswordModal, setOpenStepUpPasswordModal] =
    useState<boolean>(false);

  // change wallet pin
  const [openChangeWalletPinModal, setOpenChangeWalletPinModal] =
    useState<boolean>(false);
  // select sealabs pay account to top up wallet
  const [openSelectSealabsPayModal, setOpenSelectSealabsPayModal] =
    useState<boolean>(false);
  // input amount for wallet topup
  const [openInputTopupAmountModal, setOpenInputTopupAmountModal] =
    useState<boolean>(false);
  const [sealabsPayDetails, setSealabsPayDetails] = useState<SealabsPayDetails>(
    {
      nameOnCard: '',
      cardNumber: '',
    }
  );

  const handlehangePINClick = () => {
    const upgradeTokenPasswordVerifier: string | undefined = Cookies.get(
      'upgrade_token_password_verifier'
    );

    if (upgradeTokenPasswordVerifier !== undefined) {
      setOpenChangeWalletPinModal(true);
      return;
    }
    setOpenStepUpPasswordModal(true);
  };

  const [walletHistoryQuery, setWalletHistoryQuery] =
    useState<WalletHistoryQuery>({
      limit: LIMIT_WALLET_HISTORY,
      page: 1,
      filterType: '',
      filterStartTransactionDate: '',
      filterEndTransactionDate: '',
    });

  const handleTopUpWalletClick = () => {
    setOpenSelectSealabsPayModal(true);
  };

  const handleTopUpWalletClose = () => {
    setOpenSelectSealabsPayModal(false);
  };

  const { data: getWalletDetailsData } = useGetWalletDetailsQuery(
    toWalletHistoryQuery(walletHistoryQuery)
  );

  const handleTypeChange = (type: string) => {
    setType(type);
    setWalletHistoryQuery({
      ...walletHistoryQuery,
      filterType: type,
    });
  };

  const handlePageChange = (n: number) => {
    setWalletHistoryQuery({
      ...walletHistoryQuery,
      page: n,
    });
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
                onClick={handleTopUpWalletClick}
              >
                Top Up
              </Button>
              <Button
                className='font-medium normal-case'
                startIcon={<HiLockOpen className='text-xl' />}
                onClick={handlehangePINClick}
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
                <div ref={dateWrapperRef} className='w-full md:w-auto'>
                  <DatePicker
                    selectsRange={true}
                    startDate={
                      isDateOpen
                        ? startDate
                        : walletHistoryQuery.filterStartTransactionDate === ''
                        ? null
                        : moment(
                            walletHistoryQuery.filterStartTransactionDate
                          ).toDate()
                    }
                    endDate={
                      isDateOpen
                        ? endDate
                        : walletHistoryQuery.filterEndTransactionDate === ''
                        ? null
                        : moment(
                            walletHistoryQuery.filterEndTransactionDate
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
              <div className='flex justify-center md:justify-start gap-1 mb-4'>
                <Button
                  size='sm'
                  className='font-normal normal-case'
                  variant={type === '' ? undefined : 'outline'}
                  color={type === '' ? 'secondary' : undefined}
                  onClick={() => handleTypeChange('')}
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
                    {getWalletDetailsData.data.wallet_transaction_history.map(
                      (row) => (
                        <Card
                          key={row.id}
                          className={`col-span-12 shadow border-r-0 border-b-4 md:border-r-8 md:border-b-0 transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-base-200 ${
                            row.type === WALLET_TRANSACTION_HISTORY_TYPE.DEBIT
                              ? 'border-r-error border-b-error'
                              : 'border-r-success border-b-success'
                          }`}
                        >
                          <div className='p-4'>
                            <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
                              <div className='flex flex-col'>
                                <span className='font-medium mb-2'>
                                  {row.transaction_type}
                                </span>
                                <span className='text-sm'>
                                  {moment(row.transaction_datetime).format(
                                    'DD MMM YYYY HH:mm'
                                  )}
                                </span>
                              </div>
                              {row.type ===
                              WALLET_TRANSACTION_HISTORY_TYPE.DEBIT ? (
                                <h5 className='font-bold text-xl text-error'>
                                  -{toRupiah(row.amount)}
                                </h5>
                              ) : (
                                <h5 className='font-bold text-xl text-success'>
                                  +{toRupiah(row.amount)}
                                </h5>
                              )}
                            </div>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                  <div className='mx-auto'>
                    <Pager
                      page={walletHistoryQuery.page}
                      totalPage={
                        getWalletDetailsData?.metadata?.total_pages
                          ? getWalletDetailsData.metadata.total_pages
                          : 0
                      }
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              ) : walletHistoryQuery.filterEndTransactionDate !== '' ||
                walletHistoryQuery.filterStartTransactionDate !== '' ? (
                <NoData
                  title='Oops, there are no transactions that match the filter'
                  message='Try to reset or change your filter'
                  buttonMessage='Reset Filter'
                  buttonHandleClick={handleResetFilterDate}
                />
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
      {/* Modal - Step Up Password */}
      <StepUpPasswordModal
        open={openStepUpPasswordModal}
        setOpen={setOpenStepUpPasswordModal}
        nextSetOpen={setOpenChangeWalletPinModal}
      />
      {/* Modal - Change Wallet PIN */}
      <ChangeWalletPinModal
        open={openChangeWalletPinModal}
        setOpen={setOpenChangeWalletPinModal}
      />
      <SelectSealabsPayModal
        open={openSelectSealabsPayModal}
        handleClose={handleTopUpWalletClose}
        nextSetOpen={setOpenInputTopupAmountModal}
        setSealabsPayDetails={setSealabsPayDetails}
      />
      <InputTopupAmountModal
        open={openInputTopupAmountModal}
        setOpen={setOpenInputTopupAmountModal}
        sealabsPayDetails={sealabsPayDetails}
      />
    </div>
  );
};

export default WalletContent;
