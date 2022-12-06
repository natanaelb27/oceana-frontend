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
import { useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Countdown,
  Divider,
  Form,
  Input,
  InputGroup,
  Progress,
  Radio,
  Tooltip,
} from 'react-daisyui';
import { CgMathPercent } from 'react-icons/cg';
import {
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineInformationCircle,
  HiOutlinePencil,
  HiOutlineXCircle,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { DISCOUNT_TYPE, VOUCHER_STATUS } from '../../constants';
import { Merchant } from '../../types/component';
import { useGetMerchantVoucherDetailsQuery } from '../../store/services/shopService';
import { handleNumberInvalidKey, stringCompare } from '../../utils/validation';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { toRupiah, toStringDate, toStringTime } from '../../utils/convert';
import {
  computeDatetime,
  getDateDiffNow,
  roundTimeToNearest30,
} from '../../utils/date';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import { useOutsideAlerter } from '../../hooks';
import { ConfirmationModal } from '../common';

type ContentProps = {
  profile: Merchant;
};

type DateContainerProps = {
  className: string;
  children: ReactNode;
};

type OpenVoucherDatePicker = {
  startDate: boolean;
  endDate: boolean;
};

type InputDatePicker = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateCustomInputProps = {
  onClick: () => void;
  value: string;
};

type OpenModal = {
  create: boolean;
  cancel: boolean;
};

const VoucherAddContent = ({ profile }: ContentProps) => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<OpenModal>({
    create: false,
    cancel: false,
  });

  const handleGoBack = () => {
    navigate('/seller/marketing/vouchers/list', { replace: true });
  };

  const handleCancelClick = () => {
    setOpenModal({
      ...openModal,
      cancel: true,
    });
  };

  const [dateInput, setDateInput] = useState<InputDatePicker>({
    startDate: roundTimeToNearest30(moment().add(1, 'd').toDate()),
    endDate: roundTimeToNearest30(moment().add(7, 'd').toDate()),
  });

  const [termsAndConditionsValue, setTermsAndConditionsValue] =
    useState<boolean>(false);

  const addVoucherFormik = useFormik({
    initialValues: {
      code: '',
      startDatetime: roundTimeToNearest30(
        moment().add(1, 'd').toDate()
      ),
      endDatetime: roundTimeToNearest30(
        moment().add(7, 'd').toDate()
      ),
      discountType: DISCOUNT_TYPE.NOMINAL,
      discount: 20000,
      minimumSpendAmount: 100000,
      maximumDiscountAmount: 0,
      maximumQuota: 25,
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Please enter voucher code'),
      startDatetime: Yup.string().required('Please enter start period'),
      endDatetime: Yup.string().required('Please enter end period'),
      discountType: Yup.string().required('Please enter discount type'),
      discount: Yup.string().required('Please enter discount value'),
      minimumSpendAmount: Yup.string().required('Please enter minimum purchase'),
      maximumDiscountAmount: Yup.string().required(
        'Please enter maximum discount'
      ),
      maximumQuota: Yup.string().required('Please enter voucher quota'),
    }),
    onSubmit: (values) => {
      if (values.discountType === DISCOUNT_TYPE.PERCENTAGE) {
        if (values.discount > 100) {
          addVoucherFormik.setErrors({
            discount: 'Max percentage is 100%',
          });
        }
      }
      console.log({ values });
    },
  });

  const merchantPrefix = profile.name
    .replace(/ /g, '')
    .slice(0, 4)
    .toUpperCase();

  const voucherCodeLength = addVoucherFormik.values.code.length;

  const handleInputCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    e.target.value = e.target.value.toUpperCase();

    if (!isSymbol) {
      addVoucherFormik.handleChange(e);
    }
  };

  const handleInputDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      addVoucherFormik.handleChange(e);
    }
  };

  const handleInputMinimumPurchaseChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      addVoucherFormik.handleChange(e);
    }
  };

  const handleInputMaximumDiscountChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      addVoucherFormik.handleChange(e);
    }
  };

  const handleInputMaximumQuotaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      addVoucherFormik.handleChange(e);
    }
  };

  const handleRadioDiscountTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    addVoucherFormik.handleChange(e);

    // addVoucherFormik.setErrors({
    //   discount: '',
    //   minimumSpendAmount: '',
    //   maximumDiscountAmount: '',
    // });

    // addVoucherFormik.setFieldError('discount', '');

    if (e.target.value === DISCOUNT_TYPE.NOMINAL) {
      addVoucherFormik.setFieldValue('discount', 20000);
      addVoucherFormik.setFieldValue('minimumSpendAmount', 100000);
      addVoucherFormik.setFieldValue('maximumDiscountAmount', 0);
    }

    if (e.target.value === DISCOUNT_TYPE.PERCENTAGE) {
      addVoucherFormik.setFieldValue('discount', 10);
      addVoucherFormik.setFieldValue('minimumSpendAmount', 100000);
      addVoucherFormik.setFieldValue('maximumDiscountAmount', 10000);
    }
  };

  const [isDateOpen, setIsDateOpen] = useState<OpenVoucherDatePicker>({
    startDate: false,
    endDate: false,
  });

  const handleCloseStartDate = () => {
    setIsDateOpen({
      ...isDateOpen,
      startDate: !isDateOpen.startDate,
    });

    setDateInput({
      ...dateInput,
      startDate: moment(
        addVoucherFormik.values.startDatetime,
        'YYYY-MM-DD HH:mm'
      ).toDate(),
    });
  };

  const handleCloseEndDate = () => {
    setIsDateOpen({
      ...isDateOpen,
      endDate: !isDateOpen.endDate,
    });

    setDateInput({
      ...dateInput,
      endDate: moment(
        addVoucherFormik.values.endDatetime,
        'YYYY-MM-DD HH:mm'
      ).toDate(),
    });
  };

  const handleChooseStartDate = () => {
    setIsDateOpen({
      ...isDateOpen,
      startDate: !isDateOpen.startDate,
    });

    addVoucherFormik.setFieldValue('startDatetime', dateInput.startDate);
  };

  const handleChooseEndDate = () => {
    setIsDateOpen({
      ...isDateOpen,
      endDate: !isDateOpen.endDate,
    });

    addVoucherFormik.setFieldValue('endDatetime', dateInput.endDate);
  };

  const handleStartDateChange = (update: Date | null) => {
    setDateInput({
      ...dateInput,
      startDate: update,
    });
  };

  const handleEndDateChange = (update: Date | null) => {
    setDateInput({
      ...dateInput,
      endDate: update,
    });
  };

  const startDateContainer = ({ className, children }: DateContainerProps) => {
    return (
      <div className='p-3 bg-base-100 border-2 shadow-lg'>
        <div className='flex gap-3'>
          <CalendarContainer className={className}>
            <div className='relative'>{children}</div>
          </CalendarContainer>
        </div>
        <Divider className='m-0'></Divider>
        <div className='flex gap-3 justify-end'>
          <Button
            className='normal-case md:w-auto md:px-5 md:py-0'
            color='secondary'
            onClick={handleCloseStartDate}
          >
            Cancel
          </Button>
          <Button
            className='normal-case md:w-auto md:px-5 md:py-0'
            color='primary'
            onClick={handleChooseStartDate}
          >
            Choose
          </Button>
        </div>
      </div>
    );
  };

  const endDateContainer = ({ className, children }: DateContainerProps) => {
    return (
      <div className='p-3 bg-base-100 border-2 shadow-lg'>
        <div className='flex gap-3'>
          <CalendarContainer className={className}>
            <div className='relative'>{children}</div>
          </CalendarContainer>
        </div>
        <Divider className='m-0'></Divider>
        <div className='flex gap-3 justify-end'>
          <Button
            className='normal-case md:w-auto md:px-5 md:py-0'
            color='secondary'
            onClick={handleCloseEndDate}
          >
            Cancel
          </Button>
          <Button
            className='normal-case md:w-auto md:px-5 md:py-0'
            color='primary'
            onClick={handleChooseEndDate}
          >
            Choose
          </Button>
        </div>
      </div>
    );
  };

  const handleStartDateOutsideClick = () => {
    setDateInput({
      ...dateInput,
      startDate: moment(
        addVoucherFormik.values.startDatetime,
        'YYYY-MM-DD HH:mm'
      ).toDate(),
    });

    setIsDateOpen({
      ...isDateOpen,
      startDate: false,
    });
  };

  const handleEndDateOutsideClick = () => {
    setDateInput({
      ...dateInput,
      endDate: moment(
        addVoucherFormik.values.endDatetime,
        'YYYY-MM-DD HH:mm'
      ).toDate(),
    });

    setIsDateOpen({
      ...isDateOpen,
      endDate: false,
    });
  };

  const startDateWrapperRef = useRef<HTMLDivElement>(null);
  const endDateWrapperRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(startDateWrapperRef, handleStartDateOutsideClick);

  useOutsideAlerter(endDateWrapperRef, handleEndDateOutsideClick);

  const StartDateCustomInput = (
    { onClick, value }: DateCustomInputProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        className='normal-case flex gap-2 w-[100%] md:w-auto md:pl-7 md:pr-7 btn-outline no-animation'
        onClick={() => {
          onClick;
          setIsDateOpen({
            ...isDateOpen,
            startDate: !isDateOpen.startDate,
            endDate: false,
          });
        }}
        ref={ref}
      >
        <HiOutlineCalendar className='text-lg' />
        {value ? value : 'Choose Start Date'}
      </Button>
    );
  };

  const EndDateCustomInput = (
    { onClick, value }: DateCustomInputProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        className='normal-case flex gap-2 w-[100%] md:w-auto md:pl-7 md:pr-7 btn-outline no-animation'
        onClick={() => {
          onClick;
          setIsDateOpen({
            ...isDateOpen,
            startDate: false,
            endDate: !isDateOpen.endDate,
          });
        }}
        ref={ref}
      >
        <HiOutlineCalendar className='text-lg' />
        {value ? value : 'Choose End Date'}
      </Button>
    );
  };

  const handleTermsAndConditionsChange = () => {
    setTermsAndConditionsValue(!termsAndConditionsValue);
  };

  const handleModalClose = () => {
    setOpenModal({
      create: false,
      cancel: false,
    });
  };

  return (
    <div className='p-4 md:p-10'>
      <Breadcrumbs className='mb-4'>
        <Breadcrumbs.Item
          className='text-primary cursor-pointer'
          onClick={handleGoBack}
        >
          Voucher List
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Add Voucher</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>Add Voucher</h5>
      </div>
      <Divider />
      <Form
        className='flex flex-col gap-4'
        onSubmit={addVoucherFormik.handleSubmit}
      >
        <div className='flex flex-col gap-7'>
          <h5 className='font-bold text-xl'>Basic Information</h5>
          <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-7 items-start gap-4'>
              <Form.Label title='Voucher Code' className='col-span-1 p-0' />
              <div className='flex flex-col gap-1 col-span-6'>
                <InputGroup className='h-9'>
                  <span className='uppercase text-sm font-bold'>
                    {merchantPrefix}
                  </span>
                  <Input
                    type='text'
                    name='code'
                    placeholder='Input'
                    className='w-full md:max-w-xs h-9'
                    value={addVoucherFormik.values.code}
                    onChange={handleInputCodeChange}
                    maxLength={5}
                  />
                  <span className='text-sm font-bold'>
                    {voucherCodeLength}/5
                  </span>
                </InputGroup>
                <label className='label-text-alt flex flex-col'>
                  <span>Please enter A-Z, 0-9; 5 characters maximum. </span>
                  <span>
                    Your complete voucher code is: {merchantPrefix}
                    {addVoucherFormik.values.code}
                  </span>
                </label>
                {addVoucherFormik.touched.code &&
                  addVoucherFormik.errors.code && (
                    <label className='label-text-alt text-error'>
                      {addVoucherFormik.errors.code}
                    </label>
                  )}
              </div>
            </div>
            <div className='grid grid-cols-7 items-start gap-4'>
              <Form.Label
                title='Voucher Usage Period'
                className='col-span-1 p-0'
              />
              <div className='flex gap-5 col-span-6'>
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-bold'>Start Date</span>
                  <DatePicker
                    selected={dateInput.startDate}
                    showTimeSelect
                    dateFormat='dd MMM yyyy h:mm aa'
                    minDate={moment().add(1, 'd').toDate()}
                    maxDate={moment().add(1, 'M').toDate()}
                    calendarContainer={startDateContainer}
                    open={isDateOpen.startDate}
                    shouldCloseOnSelect={false}
                    className='border-2 rounded-lg p-2 text-center'
                    onChange={(update) => handleStartDateChange(update)}
                    customInput={createElement(
                      forwardRef(StartDateCustomInput)
                    )}
                  />
                  {/* {addVoucherFormik.touched.startDatetime &&
                    addVoucherFormik.errors.startDatetime && (
                      <label className='label-text-alt text-error'>
                        {addVoucherFormik.errors.startDatetime}
                      </label>
                    )} */}
                </div>

                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-bold'>End Date</span>
                  <DatePicker
                    selected={dateInput.endDate}
                    showTimeSelect
                    dateFormat='dd MMM yyyy h:mm aa'
                    minDate={moment().add(1, 'd').toDate()}
                    maxDate={moment().add(1, 'M').toDate()}
                    calendarContainer={endDateContainer}
                    open={isDateOpen.endDate}
                    shouldCloseOnSelect={false}
                    className='border-2 rounded-lg p-2 text-center'
                    onChange={(update) => handleEndDateChange(update)}
                    customInput={createElement(forwardRef(EndDateCustomInput))}
                  />
                  {/* {addVoucherFormik.touched.endDatetime &&
                    addVoucherFormik.errors.endDatetime && (
                      <label className='label-text-alt text-error'>
                        {addVoucherFormik.errors.endDatetime}
                      </label>
                    )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Divider></Divider>
        <div className='flex flex-col gap-7'>
          <h5 className='font-bold text-xl'>Voucher Settings</h5>
          <div className='flex flex-col gap-8'>
            <div className='grid grid-cols-7 items-start gap-4'>
              <Form.Label title='Discount Type' className='col-span-1 p-0' />
              <div className='flex flex-col gap-1 col-span-6'>
                <div className='flex gap-5'>
                  <label className='flex flex-row gap-2 items-center cursor-pointer'>
                    <Radio
                      size='sm'
                      color='primary'
                      name='discountType'
                      value={DISCOUNT_TYPE.NOMINAL}
                      checked={
                        addVoucherFormik.values.discountType ===
                        DISCOUNT_TYPE.NOMINAL
                      }
                      onChange={handleRadioDiscountTypeChange}
                    />
                    <span className='text-sm'>{DISCOUNT_TYPE.NOMINAL}</span>
                  </label>
                  <label className='flex flex-row gap-2 items-center cursor-pointer'>
                    <Radio
                      size='sm'
                      color='primary'
                      name='discountType'
                      value={DISCOUNT_TYPE.PERCENTAGE}
                      checked={
                        addVoucherFormik.values.discountType ===
                        DISCOUNT_TYPE.PERCENTAGE
                      }
                      onChange={handleRadioDiscountTypeChange}
                    />
                    <span className='text-sm'>{DISCOUNT_TYPE.PERCENTAGE}</span>
                  </label>
                </div>
                {addVoucherFormik.touched.discountType &&
                  addVoucherFormik.errors.discountType && (
                    <label className='label-text-alt text-error'>
                      {addVoucherFormik.errors.discountType}
                    </label>
                  )}
              </div>
            </div>
            {addVoucherFormik.values.discountType === DISCOUNT_TYPE.NOMINAL ? (
              <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-7 items-center gap-4'>
                  <Form.Label
                    title='Discount Nominal'
                    className='col-span-1 p-0'
                  />
                  <div className='flex flex-col gap-1 col-span-6'>
                    <InputGroup className='h-9'>
                      <span className='text-sm font-bold'>Rp</span>
                      <Input
                        type='number'
                        name='discount'
                        placeholder='Input'
                        className='w-full md:max-w-xs h-9'
                        value={addVoucherFormik.values.discount}
                        onChange={handleInputDiscountChange}
                        onKeyDown={handleNumberInvalidKey}
                      />
                    </InputGroup>
                    {addVoucherFormik.touched.discount &&
                      addVoucherFormik.errors.discount && (
                        <label className='label-text-alt text-error'>
                          {addVoucherFormik.errors.discount}
                        </label>
                      )}
                  </div>
                </div>
                <div className='grid grid-cols-7 items-center gap-4'>
                  <Form.Label
                    title='Minimum Purchase'
                    className='col-span-1 p-0'
                  />
                  <div className='flex flex-col gap-1 col-span-6'>
                    <InputGroup className='h-9'>
                      <span className='text-sm font-bold'>Rp</span>
                      <Input
                        type='number'
                        name='minimumSpendAmount'
                        placeholder='Input'
                        className='w-full md:max-w-xs h-9'
                        value={addVoucherFormik.values.minimumSpendAmount}
                        onChange={handleInputMinimumPurchaseChange}
                        onKeyDown={handleNumberInvalidKey}
                      />
                    </InputGroup>
                    {addVoucherFormik.touched.minimumSpendAmount &&
                      addVoucherFormik.errors.minimumSpendAmount && (
                        <label className='label-text-alt text-error'>
                          {addVoucherFormik.errors.minimumSpendAmount}
                        </label>
                      )}
                  </div>
                </div>
                <div className='grid grid-cols-7 items-center gap-4'>
                  <Form.Label title='Quota' className='col-span-1 p-0' />
                  <div className='flex flex-col gap-1 col-span-6'>
                    <InputGroup className='h-9'>
                      <Input
                        type='number'
                        name='maximumQuota'
                        placeholder='Input'
                        className='w-full md:max-w-xs h-9'
                        value={addVoucherFormik.values.maximumQuota}
                        onChange={handleInputMaximumQuotaChange}
                        onKeyDown={handleNumberInvalidKey}
                      />
                    </InputGroup>
                    {addVoucherFormik.touched.maximumQuota &&
                      addVoucherFormik.errors.maximumQuota && (
                        <label className='label-text-alt text-error'>
                          {addVoucherFormik.errors.maximumQuota}
                        </label>
                      )}
                  </div>
                </div>
                <div className='bg-accent bg-opacity-30 p-3 rounded flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-bold'>
                      Estimated Maximum Expenditure
                    </span>
                    <span className='text-sm'>
                      Deducted from completed transactions
                    </span>
                  </div>
                  <span className='font-bold'>
                    {toRupiah(
                      addVoucherFormik.values.discount *
                        addVoucherFormik.values.maximumQuota
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-8'>
                <div className='grid grid-cols-7 items-center gap-4'>
                  <Form.Label
                    title='Discount Nominal'
                    className='col-span-1 p-0'
                  />
                  <div className='flex flex-col gap-1 col-span-6'>
                    <InputGroup className='h-9'>
                      <Input
                        type='number'
                        name='discount'
                        placeholder='Input'
                        className='w-full md:max-w-xs h-9'
                        value={addVoucherFormik.values.discount}
                        onChange={handleInputDiscountChange}
                        onKeyDown={handleNumberInvalidKey}
                      />
                      <span className='text-sm font-bold'>%</span>
                    </InputGroup>
                    {addVoucherFormik.touched.discount &&
                      addVoucherFormik.errors.discount && (
                        <label className='label-text-alt text-error'>
                          {addVoucherFormik.errors.discount}
                        </label>
                      )}
                  </div>
                </div>
                <div className='grid grid-cols-7 items-center gap-4'>
                  <Form.Label
                    title='Minimum Purchase'
                    className='col-span-1 p-0'
                  />
                  <div className='flex flex-col gap-1 col-span-6'>
                    <InputGroup className='h-9'>
                      <span className='text-sm font-bold'>Rp</span>
                      <Input
                        type='number'
                        name='minimumSpendAmount'
                        placeholder='Input'
                        className='w-full md:max-w-xs h-9'
                        value={addVoucherFormik.values.minimumSpendAmount}
                        onChange={handleInputMinimumPurchaseChange}
                        onKeyDown={handleNumberInvalidKey}
                      />
                    </InputGroup>
                    {addVoucherFormik.touched.minimumSpendAmount &&
                      addVoucherFormik.errors.minimumSpendAmount && (
                        <label className='label-text-alt text-error'>
                          {addVoucherFormik.errors.minimumSpendAmount}
                        </label>
                      )}
                  </div>
                </div>
                <div className='grid grid-cols-7 items-center gap-4'>
                  <Form.Label
                    title='Maximum Discount'
                    className='col-span-1 p-0'
                  />
                  <div className='flex flex-col gap-1 col-span-6'>
                    <InputGroup className='h-9'>
                      <span className='text-sm font-bold'>Rp</span>
                      <Input
                        type='number'
                        name='maximumDiscountAmount'
                        placeholder='Input'
                        className='w-full md:max-w-xs h-9'
                        value={addVoucherFormik.values.maximumDiscountAmount}
                        onChange={handleInputMaximumDiscountChange}
                        onKeyDown={handleNumberInvalidKey}
                      />
                    </InputGroup>
                    {addVoucherFormik.touched.minimumSpendAmount &&
                      addVoucherFormik.errors.minimumSpendAmount && (
                        <label className='label-text-alt text-error'>
                          {addVoucherFormik.errors.minimumSpendAmount}
                        </label>
                      )}
                  </div>
                </div>
                <div className='grid grid-cols-7 items-center gap-4'>
                  <Form.Label title='Quota' className='col-span-1 p-0' />
                  <div className='flex flex-col gap-1 col-span-6'>
                    <InputGroup className='h-9'>
                      <Input
                        type='number'
                        name='maximumQuota'
                        placeholder='Input'
                        className='w-full md:max-w-xs h-9'
                        value={addVoucherFormik.values.maximumQuota}
                        onChange={handleInputMaximumQuotaChange}
                        onKeyDown={handleNumberInvalidKey}
                      />
                    </InputGroup>
                    {addVoucherFormik.touched.maximumQuota &&
                      addVoucherFormik.errors.maximumQuota && (
                        <label className='label-text-alt text-error'>
                          {addVoucherFormik.errors.maximumQuota}
                        </label>
                      )}
                  </div>
                </div>
                <div className='bg-accent bg-opacity-30 p-3 rounded flex justify-between items-center'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-bold'>
                      Estimated Maximum Expenditure
                    </span>
                    <span className='text-sm'>
                      Deducted from completed transactions
                    </span>
                  </div>
                  <span className='font-bold'>
                    {toRupiah(
                      addVoucherFormik.values.maximumDiscountAmount *
                        addVoucherFormik.values.maximumQuota
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Divider></Divider>
        <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <Checkbox
              color='primary'
              onChange={handleTermsAndConditionsChange}
            ></Checkbox>
            <div className='text-sm'>
              <span>I agree to the </span>
              <span className='text-primary cursor-pointer font-bold'>
                Terms &amp; Conditions
              </span>
            </div>
          </div>
          <div className='flex gap-5'>
            <Button color='ghost' variant='outline' onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button
              color='primary'
              disabled={!termsAndConditionsValue}
              type='submit'
            >
              Create Voucher
            </Button>
          </div>
        </div>
      </Form>
      <ConfirmationModal
        open={openModal.cancel}
        title='Are you sure?'
        message='This action cannot be undone.'
        onClose={handleModalClose}
        onAccepted={handleGoBack}
      />
    </div>
  );
};

export default VoucherAddContent;
