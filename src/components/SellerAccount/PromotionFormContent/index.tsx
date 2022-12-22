import { useFormik } from 'formik';
import moment, { Moment } from 'moment';
import { useState } from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Divider,
  Form,
  Input,
  Table,
} from 'react-daisyui';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import { HiOutlineCalendar, HiPlus } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import { Merchant } from '../../../types/component';
import { SellerAccountPromotionFormContent } from '../../../types/content';
import ProductModal from './ProductModal';
import { roundTimeToNearest30 } from '../../../utils/date';

type PromotionFormContentProps = {
  profile: Merchant;
  content: SellerAccountPromotionFormContent;
};

type DateLimit = {
  min: Moment;
  max: Moment;
};

const PromotionFormContent = ({
  profile,
  content,
}: PromotionFormContentProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(
    roundTimeToNearest30(moment().add(1, 'd').toDate())
  );
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startDateLimit] = useState<DateLimit>({
    min: moment().add(1, 'd'),
    max: moment().add(1, 'M'),
  });
  const [endDateLimit, setEndDateLimit] = useState<DateLimit>({
    min: moment().add(1, 'd').add('1', 'h'),
    max: moment().add(6, 'M'),
  });

  const filterStartDate = (date: Date) =>
    moment(date).isBetween(startDateLimit.min, startDateLimit.max, 'D', '[]');
  const filterEndDate = (date: Date) =>
    moment(date).isBetween(endDateLimit.min, endDateLimit.max, 'D', '[]');
  const filterStartTime = (date: Date) =>
    moment(date).isBetween(
      startDateLimit.min,
      startDateLimit.max,
      undefined,
      '[]'
    );
  const filterEndTime = (date: Date) =>
    moment(date).isBetween(endDateLimit.min, endDateLimit.max, undefined, '[]');

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please enter promotion name'),
    }),
    onSubmit: ({ name }) => {
      console.log({ name });
    },
  });

  const handleStartDateChange = (date: Date | null) => {
    const newEndDateLimit = {
      min: moment(date).add('1', 'h'),
      max: moment(date).add(6, 'M'),
    };

    setStartDate(date);
    setEndDate(null);
    setEndDateLimit(newEndDateLimit);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleGoBack = () => {
    navigate('/seller/marketing/promotions/list');
  };

  const title =
    content === SellerAccountPromotionFormContent.Add
      ? 'Add Promotion'
      : 'Edit Promotion';

  return (
    <div className='p-4 md:p-10'>
      <Breadcrumbs className='mb-4'>
        <Breadcrumbs.Item
          className='text-primary cursor-pointer'
          onClick={handleGoBack}
        >
          Promotion List
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{title}</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className='flex flex-col md:flex-row gap-y-3 justify-between items-center'>
        <h5 className='font-bold text-2xl text-primary'>{title}</h5>
      </div>
      <Divider />
      <Form onSubmit={(e) => e.preventDefault()}>
        <div className='flex flex-col gap-2 items-center md:items-start'>
          <Badge
            size='lg'
            color='secondary'
            className='text-lg font-medium mb-4'
          >
            Basic Information
          </Badge>
          <div className='grid grid-cols-12 gap-4 w-full'>
            <div className='col-span-12 md:col-span-6'>
              <Form.Label title='Promotion Name' />
              <Input
                className='w-full'
                name='name'
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name && (
                <label className='label-text-alt text-error'>
                  {formik.errors.name}
                </label>
              )}
            </div>
            <div className='col-span-12 md:col-span-3'>
              <Form.Label title='Start Date' />
              <DatePicker
                showTimeSelect
                selected={startDate}
                onChange={handleStartDateChange}
                filterDate={filterStartDate}
                filterTime={filterStartTime}
                customInput={
                  <Button
                    type='button'
                    startIcon={<HiOutlineCalendar className='text-xl' />}
                    className='normal-case font-medium w-full'
                    color={startDate ? 'info' : undefined}
                    variant={startDate ? undefined : 'outline'}
                  >
                    {startDate
                      ? moment(startDate).format('DD MMM YYYY - HH:mm')
                      : 'Choose Date'}
                  </Button>
                }
              />
            </div>
            <div className='col-span-12 md:col-span-3'>
              <Form.Label title='End Date' />
              <DatePicker
                showTimeSelect
                selected={endDate}
                onChange={handleEndDateChange}
                filterDate={filterEndDate}
                filterTime={filterEndTime}
                customInput={
                  <Button
                    type='button'
                    startIcon={<HiOutlineCalendar className='text-xl' />}
                    className='normal-case font-medium w-full'
                    color={endDate ? 'info' : undefined}
                    variant={endDate ? undefined : 'outline'}
                  >
                    {endDate
                      ? moment(endDate).format('DD MMM YYYY - HH:mm')
                      : 'Choose Date'}
                  </Button>
                }
              />
            </div>
          </div>
          <Divider />
          <div className='flex flex-col gap-4 md:flex-row items-center justify-between mb-4 w-full'>
            <Badge size='lg' color='secondary' className='text-lg font-medium '>
              Product List
            </Badge>
            <Button
              type='button'
              color='primary'
              disabled={!startDate || !endDate}
              startIcon={<HiPlus className='text-xl' />}
              onClick={handleOpenModal}
            >
              Product
            </Button>
          </div>
          <div className='overflow-x-auto w-full'>
            <Table className='w-[100%]'>
              <Table.Head>
                <span className='w-96'>Product</span>
                <span>Discount</span>
                <span>Quota</span>
              </Table.Head>
            </Table>
          </div>
        </div>
      </Form>
      <ProductModal
        open={openModal}
        onClose={handleCloseModal}
        merchantID={String(profile.id)}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default PromotionFormContent;
