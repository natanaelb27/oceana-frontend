import {
  ChangeEvent,
  createElement,
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  InputGroup,
  Radio,
} from 'react-daisyui';
import { HiOutlineCalendar } from 'react-icons/hi';
import { DISCOUNT_TYPE, VOUCHER_STATUS } from '../../constants';
import { roundTimeToNearest30 } from '../../utils/date';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import { useOutsideAlerter } from '../../hooks';
import { ConfirmationModal, Loading } from '../common';
import { handleNumberInvalidKey, stringCompare } from '../../utils/validation';
import {
  useLazyGetMarketplaceVoucherDetailsQuery,
  useCreateMarketplaceVoucherMutation,
  useUpdateMarketplaceVoucherMutation,
} from '../../store/services/marketplaceService';
import { SellerAccountVoucherFormContent } from '../../types/content';
import { toCreateMarketplaceVoucherRequest } from '../../utils/mapperDTO';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';
import {
  CreateMarketplaceVoucherResponse,
  GetMarketplaceVoucherResponse,
} from '../../types/response';
import { toRupiah } from '../../utils/convert';

type ContentProps = {
  content: SellerAccountVoucherFormContent;
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
  disabled?: boolean;
  onClick: () => void;
  value: string;
};

type OpenModal = {
  cancel: boolean;
};

type DateLimit = {
  min: Date;
  max: Date;
};

type DisableDatePickers = {
  start: boolean;
  end: boolean;
};

const AdminVoucherForm = ({ content }: ContentProps) => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<OpenModal>({
    cancel: false,
  });
  const [minimumMaximumQuota, setMinimumMaximumQuota] = useState<number>(0);
  const [startDateLimit, setStartDateLimit] = useState<DateLimit>({
    min: moment().add(1, 'd').toDate(),
    max: moment().add(1, 'M').toDate(),
  });
  const [endDateLimit, setEndDateLimit] = useState<DateLimit>({
    min: moment().add(1, 'd').toDate(),
    max: moment().add(4, 'M').toDate(),
  });
  const [disableDatePickers, setDisableDatePickers] =
    useState<DisableDatePickers>({
      start: false,
      end: false,
    });
  const [dateInput, setDateInput] = useState<InputDatePicker>({
    startDate: roundTimeToNearest30(moment().add(1, 'd').toDate()),
    endDate: roundTimeToNearest30(moment().add(7, 'd').toDate()),
  });
  const [isDateOpen, setIsDateOpen] = useState<OpenVoucherDatePicker>({
    startDate: false,
    endDate: false,
  });

  const [termsAndConditionsValue, setTermsAndConditionsValue] =
    useState<boolean>(false);
  const [
    createMarketplaceVoucher,
    { isLoading: createMarketplaceVoucherIsLoading },
  ] = useCreateMarketplaceVoucherMutation();
  const [
    updateMarketplaceVoucher,
    { isLoading: updateMarketplaceVoucherIsLoading },
  ] = useUpdateMarketplaceVoucherMutation();

  const voucherFormik = useFormik({
    initialValues: {
      name: '',
      startDatetime: roundTimeToNearest30(moment().add(1, 'd').toDate()),
      endDatetime: roundTimeToNearest30(moment().add(7, 'd').toDate()),
      discountType: DISCOUNT_TYPE.NOMINAL,
      discountNominal: 0,
      discountPercentage: 0,
      minimumSpendAmount: 0,
      maximumDiscountAmount: 0,
      maximumQuota: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please enter voucher name'),
      startDatetime: Yup.date().required('Please enter start period'),
      endDatetime: Yup.date()
        .required('Please enter end period')
        .when(
          'startDatetime',
          (startDatetime, schema) =>
            startDatetime &&
            schema.min(
              moment(startDatetime || '')
                .add(1, 'hour')
                .toDate(),
              'End date time should be 1 hour more than start date time'
            )
        ),
      discountType: Yup.string().required('Please enter discount type'),
      discountNominal: Yup.number().when(['discountType'], {
        is: (discountType: string) => discountType === DISCOUNT_TYPE.NOMINAL,
        then: Yup.number()
          .required('Please enter discount nominal')
          .min(1, 'Discount nominal should be more than 0'),
      }),
      discountPercentage: Yup.number().when(['discountType'], {
        is: (discountType: string) => discountType === DISCOUNT_TYPE.PERCENTAGE,
        then: Yup.number()
          .required('Please enter discount percentage')
          .min(1, 'Discount percentage should be more than 0')
          .max(100, 'Discount percentage should not be more than 100'),
      }),
      minimumSpendAmount: Yup.number()
        .required('Please enter minimum spend amount')
        .min(1, 'Minimum spend amount should be more than 0'),
      maximumDiscountAmount: Yup.number().when(['discountType'], {
        is: (discountType: string) => discountType === DISCOUNT_TYPE.PERCENTAGE,
        then: Yup.number()
          .required('Please enter maximum discount amount')
          .min(1, 'Maximum discount amount should be more than 0')
          .when(
            'minimumSpendAmount',
            (minimumSpendAmount, schema) =>
              minimumSpendAmount &&
              schema.max(
                minimumSpendAmount,
                'Maximum discount amount should not be more than minimum spend amount'
              )
          ),
      }),
      maximumQuota: Yup.number()
        .required('Please enter voucher quota')
        .min(
          minimumMaximumQuota > 0 ? minimumMaximumQuota : 1,
          minimumMaximumQuota > 0
            ? 'Maximum quota should be more than currently used quota'
            : 'Maximum quota should be more than 0'
        ),
    }),
    onSubmit: (values) => {
      if (content === SellerAccountVoucherFormContent.Add) {
        const {
          name,
          startDatetime,
          endDatetime,
          discountType,
          discountNominal,
          discountPercentage,
          minimumSpendAmount,
          maximumDiscountAmount,
          maximumQuota,
        } = values;
        createMarketplaceVoucher(
          toCreateMarketplaceVoucherRequest(
            name,
            startDatetime,
            endDatetime,
            discountType,
            discountType === DISCOUNT_TYPE.NOMINAL
              ? discountNominal
              : discountPercentage,
            minimumSpendAmount,
            maximumDiscountAmount,
            maximumQuota
          )
        )
          .unwrap()
          .then(() => {
            notifySuccessToast('Voucher has been added!');
            navigate('/seller/marketing/vouchers/list');
          })
          .catch((err) => {
            if (err && 'data' in err) {
              const response = err.data as CreateMarketplaceVoucherResponse;
              notifyErrorToast(response.message);
            }
          });
      }
      if (content === SellerAccountVoucherFormContent.Edit) {
        const {
          name,
          startDatetime,
          endDatetime,
          discountType,
          discountNominal,
          discountPercentage,
          minimumSpendAmount,
          maximumDiscountAmount,
          maximumQuota,
        } = values;
        updateMarketplaceVoucher({
          id: Number(voucherID),
          request: toCreateMarketplaceVoucherRequest(
            name,
            startDatetime,
            endDatetime,
            discountType,
            discountType === DISCOUNT_TYPE.NOMINAL
              ? discountNominal
              : discountPercentage,
            minimumSpendAmount,
            maximumDiscountAmount,
            maximumQuota
          ),
        })
          .unwrap()
          .then(() => {
            notifySuccessToast('Voucher has been updated!');
            navigate('/seller/marketing/vouchers/list');
          })
          .catch((err) => {
            if (err && 'data' in err) {
              const response = err.data as CreateMarketplaceVoucherResponse;
              notifyErrorToast(response.message);
            }
          });
      }
    },
  });

  const { voucherID } = useParams();
  const [
    getMarketplaceVoucherDetails,
    { isLoading: getMarketplaceVoucherDetailsIsLoading },
  ] = useLazyGetMarketplaceVoucherDetailsQuery();

  useEffect(() => {
    if (!voucherID || isNaN(Number(voucherID))) {
      if (content === SellerAccountVoucherFormContent.Add) {
        voucherFormik.setValues({
          name: '',
          startDatetime: roundTimeToNearest30(moment().add(1, 'd').toDate()),
          endDatetime: roundTimeToNearest30(moment().add(7, 'd').toDate()),
          discountType: DISCOUNT_TYPE.NOMINAL,
          discountNominal: 0,
          discountPercentage: 0,
          minimumSpendAmount: 0,
          maximumDiscountAmount: 0,
          maximumQuota: 0,
        });
      }
      setMinimumMaximumQuota(0);
      setDisableDatePickers({
        start: false,
        end: false,
      });

      return;
    }

    getMarketplaceVoucherDetails(Number(voucherID))
      .then((res) => {
        if (!res.data?.data) {
          return;
        }

        const {
          data: { data },
        } = res;

        if (content === SellerAccountVoucherFormContent.Add) {
          voucherFormik.setValues({
            name: '',
            startDatetime: roundTimeToNearest30(moment().add(1, 'd').toDate()),
            endDatetime: roundTimeToNearest30(moment().add(7, 'd').toDate()),
            discountType: stringCompare(
              data.discount_type,
              DISCOUNT_TYPE.NOMINAL
            )
              ? DISCOUNT_TYPE.NOMINAL
              : DISCOUNT_TYPE.PERCENTAGE,
            discountNominal: stringCompare(
              data.discount_type,
              DISCOUNT_TYPE.NOMINAL
            )
              ? data.discount
              : 0,
            discountPercentage: stringCompare(
              data.discount_type,
              DISCOUNT_TYPE.PERCENTAGE
            )
              ? data.discount
              : 0,
            minimumSpendAmount: data.minimum_spend_amount,
            maximumDiscountAmount: data.maximum_discount_amount,
            maximumQuota: data.maximum_quota,
          });
          setMinimumMaximumQuota(0);
          setDisableDatePickers({
            start: false,
            end: false,
          });
        } else if (content === SellerAccountVoucherFormContent.Edit) {
          voucherFormik.setValues({
            name: data.name,
            startDatetime: moment(data.start_datetime).toDate(),
            endDatetime: moment(data.end_datetime).toDate(),
            discountType: stringCompare(
              data.discount_type,
              DISCOUNT_TYPE.NOMINAL
            )
              ? DISCOUNT_TYPE.NOMINAL
              : DISCOUNT_TYPE.PERCENTAGE,
            discountNominal: stringCompare(
              data.discount_type,
              DISCOUNT_TYPE.NOMINAL
            )
              ? data.discount
              : 0,
            discountPercentage: stringCompare(
              data.discount_type,
              DISCOUNT_TYPE.PERCENTAGE
            )
              ? data.discount
              : 0,
            minimumSpendAmount: data.minimum_spend_amount,
            maximumDiscountAmount: data.maximum_discount_amount,
            maximumQuota: data.maximum_quota,
          });

          setMinimumMaximumQuota(data.current_quota);

          if (stringCompare(data.voucher_status, VOUCHER_STATUS.UPCOMING)) {
            setDisableDatePickers({
              start: false,
              end: false,
            });
          }

          if (stringCompare(data.voucher_status, VOUCHER_STATUS.ONGOING)) {
            setDisableDatePickers({
              start: true,
              end: false,
            });
          }

          if (stringCompare(data.voucher_status, VOUCHER_STATUS.ENDED)) {
            setDisableDatePickers({
              start: false,
              end: false,
            });
          }

          if (moment(data.start_datetime).isAfter(moment())) {
            setStartDateLimit({
              min: moment().add(1, 'd').toDate(),
              max: moment().add(1, 'M').toDate(),
            });

            setEndDateLimit({
              min: moment(data.start_datetime).add(1, 'h').toDate(),
              max: moment(data.start_datetime).add(3, 'M').toDate(),
            });
          } else {
            setStartDateLimit({
              min: moment().add(1, 'd').toDate(),
              max: moment().add(1, 'M').toDate(),
            });

            setEndDateLimit({
              min: moment().add(1, 'd').toDate(),
              max: moment().add(4, 'M').toDate(),
            });
          }
        }
      })
      .catch((err) => {
        if (err && 'data' in err) {
          const response = err.data as GetMarketplaceVoucherResponse;

          notifyErrorToast(response.message);
        }
      });
  }, [voucherID]);

  const handleGoBack = () => {
    navigate('/seller/marketing/vouchers/list');
  };

  const handleCancelClick = () => {
    setOpenModal({
      ...openModal,
      cancel: true,
    });
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    voucherFormik.handleChange(e);
  };

  const handleInputDiscountPercentageChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      voucherFormik.handleChange(e);
    }
  };

  const handleInputDiscountNominalChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      voucherFormik.handleChange(e);
    }
  };

  const handleInputMinimumPurchaseChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      voucherFormik.handleChange(e);
    }
  };

  const handleInputMaximumDiscountChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      voucherFormik.handleChange(e);
    }
  };

  const handleInputMaximumQuotaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checkSymbol = /[ `!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~]/;
    const isSymbol = checkSymbol.test(e.target.value);

    if (!isSymbol) {
      voucherFormik.handleChange(e);
    }
  };

  const handleRadioDiscountTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    voucherFormik.handleChange(e);
    voucherFormik.setFieldValue('discountNominal', 0);
    voucherFormik.setFieldValue('discountPercentage', 0);
    voucherFormik.setFieldValue('minimumSpendAmount', 0);
    voucherFormik.setFieldValue('maximumDiscountAmount', 0);
    voucherFormik.setFieldValue('maximumDiscountAmount', 0);
  };

  const handleCloseStartDate = () => {
    setIsDateOpen({
      ...isDateOpen,
      startDate: !isDateOpen.startDate,
    });

    setDateInput({
      ...dateInput,
      startDate: moment(
        voucherFormik.values.startDatetime,
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
        voucherFormik.values.endDatetime,
        'YYYY-MM-DD HH:mm'
      ).toDate(),
    });
  };

  const handleChooseStartDate = () => {
    setIsDateOpen({
      ...isDateOpen,
      startDate: !isDateOpen.startDate,
    });

    voucherFormik.setFieldValue('startDatetime', dateInput.startDate);
  };

  const handleChooseEndDate = () => {
    setIsDateOpen({
      ...isDateOpen,
      endDate: !isDateOpen.endDate,
    });

    voucherFormik.setFieldValue('endDatetime', dateInput.endDate);
  };

  const handleStartDateChange = (update: Date | null) => {
    const newDateInput = {
      startDate: update,
      endDate: dateInput.endDate,
    };

    if (!update) {
      setDateInput(newDateInput);
      setStartDateLimit({
        min: moment().add(1, 'd').toDate(),
        max: moment().add(1, 'M').toDate(),
      });
      setEndDateLimit({
        min: moment().add(1, 'd').toDate(),
        max: moment().add(4, 'M').toDate(),
      });

      return;
    }

    const newEndDateLimit = {
      min: moment(update).add(1, 'h').toDate(),
      max: moment(update).add(3, 'M').toDate(),
    };

    setEndDateLimit(newEndDateLimit);

    if (moment(newEndDateLimit.min).isAfter(moment(dateInput.endDate))) {
      newDateInput.endDate = newEndDateLimit.min;
    } else if (
      moment(newEndDateLimit.max).isBefore(moment(dateInput.endDate))
    ) {
      newDateInput.endDate = newEndDateLimit.max;
    }

    setDateInput(newDateInput);
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
        voucherFormik.values.startDatetime,
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
        voucherFormik.values.endDatetime,
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
    { disabled, onClick, value }: DateCustomInputProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        disabled={disabled}
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
      cancel: false,
    });
  };

  if (getMarketplaceVoucherDetailsIsLoading) {
    return <Loading isLoading={getMarketplaceVoucherDetailsIsLoading} />;
  }

  return (
    <div className='container mx-auto'>
      <div className='p-4 md:p-10'>
        <Card className='shadow-lg'>
          <Card.Body>
            <div className='p-4 md:p-10'>
              <Breadcrumbs className='mb-4'>
                <Breadcrumbs.Item
                  className='text-primary cursor-pointer'
                  onClick={handleGoBack}
                >
                  Voucher List
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                  {content === SellerAccountVoucherFormContent.Add &&
                    'Add Voucher'}
                  {content === SellerAccountVoucherFormContent.Edit &&
                    'Edit Voucher'}
                </Breadcrumbs.Item>
              </Breadcrumbs>
              <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
                <h5 className='font-bold text-2xl text-primary'>
                  {content === SellerAccountVoucherFormContent.Add &&
                    'Add Voucher'}
                  {content === SellerAccountVoucherFormContent.Edit &&
                    'Edit Voucher'}
                </h5>
              </div>
              <Divider />
              <Form
                className='flex flex-col gap-4'
                onSubmit={voucherFormik.handleSubmit}
              >
                <div className='flex flex-col gap-7'>
                  <h5 className='font-bold text-xl'>Basic Information</h5>
                  <div className='flex flex-col gap-4'>
                    <div className='grid grid-cols-7 items-start gap-4'>
                      <Form.Label
                        title='Voucher Name'
                        className='col-span-1 p-0'
                      />
                      <div className='flex flex-col gap-1 col-span-6'>
                        <Input
                          type='text'
                          name='name'
                          placeholder='Name'
                          className='w-full md:max-w-xs h-9'
                          value={voucherFormik.values.name}
                          onChange={handleNameChange}
                          disabled={
                            content === SellerAccountVoucherFormContent.Edit
                          }
                        />
                        {voucherFormik.touched.name &&
                          voucherFormik.errors.name && (
                            <label className='label-text-alt text-error'>
                              {voucherFormik.errors.name}
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
                            selected={
                              isDateOpen.startDate
                                ? dateInput.startDate
                                : voucherFormik.values.startDatetime
                            }
                            disabled={disableDatePickers.start}
                            showTimeSelect
                            dateFormat='dd MMM yyyy h:mm aa'
                            minDate={startDateLimit.min}
                            maxDate={startDateLimit.max}
                            calendarContainer={startDateContainer}
                            open={isDateOpen.startDate}
                            shouldCloseOnSelect={false}
                            className='border-2 rounded-lg p-2 text-center'
                            onChange={(update) => handleStartDateChange(update)}
                            customInput={createElement(
                              forwardRef(StartDateCustomInput)
                            )}
                          />
                          {voucherFormik.touched.startDatetime &&
                            voucherFormik.errors.startDatetime && (
                              <label className='label-text-alt text-error'>
                                {String(voucherFormik.errors.startDatetime)}
                              </label>
                            )}
                        </div>

                        <div className='flex flex-col gap-1'>
                          <span className='text-sm font-bold'>End Date</span>
                          <DatePicker
                            selected={
                              isDateOpen.endDate
                                ? dateInput.endDate
                                : voucherFormik.values.endDatetime
                            }
                            disabled={disableDatePickers.end}
                            showTimeSelect
                            dateFormat='dd MMM yyyy h:mm aa'
                            minDate={endDateLimit.min}
                            maxDate={endDateLimit.max}
                            minTime={
                              moment(dateInput.startDate)
                                .add(1, 'd')
                                .diff(moment(dateInput.endDate), 'd') >= 0 &&
                              moment(dateInput.startDate)
                                .add(1, 'd')
                                .diff(moment(dateInput.endDate), 'h') > 0
                                ? moment(dateInput.startDate)
                                    .add(1, 'h')
                                    .toDate()
                                : moment().startOf('d').toDate()
                            }
                            maxTime={moment().endOf('d').toDate()}
                            calendarContainer={endDateContainer}
                            open={isDateOpen.endDate}
                            shouldCloseOnSelect={false}
                            className='border-2 rounded-lg p-2 text-center'
                            onChange={(update) => handleEndDateChange(update)}
                            customInput={createElement(
                              forwardRef(EndDateCustomInput)
                            )}
                          />
                          {voucherFormik.touched.endDatetime &&
                            voucherFormik.errors.endDatetime && (
                              <label className='label-text-alt text-error'>
                                {String(voucherFormik.errors.endDatetime)}
                              </label>
                            )}
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
                      <Form.Label
                        title='Discount Type'
                        className='col-span-1 p-0'
                      />
                      <div className='flex flex-col gap-1 col-span-6'>
                        <div className='flex gap-5'>
                          <label className='flex flex-row gap-2 items-center cursor-pointer'>
                            <Radio
                              size='sm'
                              color='primary'
                              name='discountType'
                              value={DISCOUNT_TYPE.NOMINAL}
                              checked={
                                voucherFormik.values.discountType ===
                                DISCOUNT_TYPE.NOMINAL
                              }
                              onChange={handleRadioDiscountTypeChange}
                            />
                            <span className='text-sm'>
                              {DISCOUNT_TYPE.NOMINAL}
                            </span>
                          </label>
                          <label className='flex flex-row gap-2 items-center cursor-pointer'>
                            <Radio
                              size='sm'
                              color='primary'
                              name='discountType'
                              value={DISCOUNT_TYPE.PERCENTAGE}
                              checked={
                                voucherFormik.values.discountType ===
                                DISCOUNT_TYPE.PERCENTAGE
                              }
                              onChange={handleRadioDiscountTypeChange}
                            />
                            <span className='text-sm'>
                              {DISCOUNT_TYPE.PERCENTAGE}
                            </span>
                          </label>
                        </div>
                        {voucherFormik.touched.discountType &&
                          voucherFormik.errors.discountType && (
                            <label className='label-text-alt text-error'>
                              {voucherFormik.errors.discountType}
                            </label>
                          )}
                      </div>
                    </div>
                    {voucherFormik.values.discountType ===
                    DISCOUNT_TYPE.NOMINAL ? (
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
                                name='discountNominal'
                                placeholder='Discount nominal'
                                className='w-full md:max-w-xs h-9'
                                value={voucherFormik.values.discountNominal}
                                onChange={handleInputDiscountNominalChange}
                                onKeyDown={handleNumberInvalidKey}
                              />
                            </InputGroup>
                            {voucherFormik.touched.discountNominal &&
                              voucherFormik.errors.discountNominal && (
                                <label className='label-text-alt text-error'>
                                  {voucherFormik.errors.discountNominal}
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
                                placeholder='Minimum purchase'
                                className='w-full md:max-w-xs h-9'
                                value={voucherFormik.values.minimumSpendAmount}
                                onChange={handleInputMinimumPurchaseChange}
                                onKeyDown={handleNumberInvalidKey}
                              />
                            </InputGroup>
                            {voucherFormik.touched.minimumSpendAmount &&
                              voucherFormik.errors.minimumSpendAmount && (
                                <label className='label-text-alt text-error'>
                                  {voucherFormik.errors.minimumSpendAmount}
                                </label>
                              )}
                          </div>
                        </div>
                        <div className='grid grid-cols-7 items-center gap-4'>
                          <Form.Label
                            title='Quota'
                            className='col-span-1 p-0'
                          />
                          <div className='flex flex-col gap-1 col-span-6'>
                            <Input
                              type='number'
                              name='maximumQuota'
                              placeholder='Maximum quota'
                              className='w-full md:max-w-xs h-9'
                              value={voucherFormik.values.maximumQuota}
                              onChange={handleInputMaximumQuotaChange}
                              onKeyDown={handleNumberInvalidKey}
                            />
                            {voucherFormik.touched.maximumQuota &&
                              voucherFormik.errors.maximumQuota && (
                                <label className='label-text-alt text-error'>
                                  {voucherFormik.errors.maximumQuota}
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
                              voucherFormik.values.discountNominal *
                                voucherFormik.values.maximumQuota
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col gap-8'>
                        <div className='grid grid-cols-7 items-center gap-4'>
                          <Form.Label
                            title='Discount Percentage'
                            className='col-span-1 p-0'
                          />
                          <div className='flex flex-col gap-1 col-span-6'>
                            <InputGroup className='h-9'>
                              <Input
                                type='number'
                                name='discountPercentage'
                                placeholder='Discount percentage'
                                className='w-full md:max-w-xs h-9'
                                value={voucherFormik.values.discountPercentage}
                                onChange={handleInputDiscountPercentageChange}
                                onKeyDown={handleNumberInvalidKey}
                              />
                              <span className='text-sm font-bold'>%</span>
                            </InputGroup>
                            {voucherFormik.touched.discountPercentage &&
                              voucherFormik.errors.discountPercentage && (
                                <label className='label-text-alt text-error'>
                                  {voucherFormik.errors.discountPercentage}
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
                                placeholder='Minimum purchase'
                                className='w-full md:max-w-xs h-9'
                                value={voucherFormik.values.minimumSpendAmount}
                                onChange={handleInputMinimumPurchaseChange}
                                onKeyDown={handleNumberInvalidKey}
                              />
                            </InputGroup>
                            {voucherFormik.touched.minimumSpendAmount &&
                              voucherFormik.errors.minimumSpendAmount && (
                                <label className='label-text-alt text-error'>
                                  {voucherFormik.errors.minimumSpendAmount}
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
                                placeholder='Maximum discount'
                                className='w-full md:max-w-xs h-9'
                                value={
                                  voucherFormik.values.maximumDiscountAmount
                                }
                                onChange={handleInputMaximumDiscountChange}
                                onKeyDown={handleNumberInvalidKey}
                              />
                            </InputGroup>
                            {voucherFormik.touched.maximumDiscountAmount &&
                              voucherFormik.errors.maximumDiscountAmount && (
                                <label className='label-text-alt text-error'>
                                  {voucherFormik.errors.maximumDiscountAmount}
                                </label>
                              )}
                          </div>
                        </div>
                        <div className='grid grid-cols-7 items-center gap-4'>
                          <Form.Label
                            title='Quota'
                            className='col-span-1 p-0'
                          />
                          <div className='flex flex-col gap-1 col-span-6'>
                            <Input
                              type='number'
                              name='maximumQuota'
                              placeholder='Maximum quota'
                              className='w-full md:max-w-xs h-9'
                              value={voucherFormik.values.maximumQuota}
                              onChange={handleInputMaximumQuotaChange}
                              onKeyDown={handleNumberInvalidKey}
                            />
                            {voucherFormik.touched.maximumQuota &&
                              voucherFormik.errors.maximumQuota && (
                                <label className='label-text-alt text-error'>
                                  {voucherFormik.errors.maximumQuota}
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
                              voucherFormik.values.maximumDiscountAmount *
                                voucherFormik.values.maximumQuota
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
                    <Button
                      color='ghost'
                      variant='outline'
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </Button>
                    <Button
                      color='primary'
                      loading={
                        createMarketplaceVoucherIsLoading ||
                        updateMarketplaceVoucherIsLoading
                      }
                      disabled={!termsAndConditionsValue}
                      type='submit'
                    >
                      {content === SellerAccountVoucherFormContent.Add &&
                        'Create Voucher'}
                      {content === SellerAccountVoucherFormContent.Edit &&
                        'Edit Voucher'}
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
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminVoucherForm;
