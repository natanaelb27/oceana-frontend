import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Divider, Input, Toggle } from 'react-daisyui';
import { BiPackage, BiSave } from 'react-icons/bi';
import { IoCalendarNumberOutline, IoDocumentsOutline } from 'react-icons/io5';
import * as Yup from 'yup';
import {
  useGetShipmentQuery,
  useUpdateShipmentMutation,
} from '../../../store/services/shipmentService';
import { Courier, Shipment } from '../../../types/component/shipment';
import { UpdateShipmentResponse } from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import { formikProcessDayAnndPreorderDay } from '../../../utils/yupValidation';
import { SectionHeading, Skeleton } from '../../common';
import CouriersConfiguration from './CouriersConfiguration';

const ShipmentContent = () => {
  const [data, setData] = useState<Shipment | null | undefined>(null);

  const { data: getShipmentData, isLoading: getShipmentIsLoading } =
    useGetShipmentQuery();
  const [updateShipment, { isLoading: updateShipmentIsLoading }] =
    useUpdateShipmentMutation();
  const shipmentFormik = useFormik({
    initialValues: {
      preorderDay: 0,
    },
    validationSchema: Yup.object({
      preorderDay: Yup.number().test({
        name: 'preorderDay',
        test(value, ctx) {
          return formikProcessDayAnndPreorderDay(ctx, value);
        },
      }),
    }),
    onSubmit: () => {
      handleShipmentSubmit();
      return;
    },
  });

  const updateData = (newCouriers: Courier[]) => {
    const newData =
      data !== undefined
        ? (JSON.parse(JSON.stringify(data)) as typeof data)
        : null;

    if (newData === null) {
      return;
    }

    newData.couriers = newCouriers;

    setData(newData);
  };

  const deepCopyShipmentData = (data: Shipment | null | undefined) => {
    return data ? (JSON.parse(JSON.stringify(data)) as typeof data) : null;
  };

  const handleProcessDayOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newData = deepCopyShipmentData(data);

    let value = parseInt(e.target.value);
    if (!value) {
      value = 0;
    }

    // if not exist then do nothing
    if (newData?.preorder_day === null || newData?.preorder_day === undefined) {
      return;
    }

    newData.preorder_day = value;

    setData(newData);

    shipmentFormik.touched.preorderDay = true;
    shipmentFormik.setFieldValue('preorderDay', e.target.value);
    shipmentFormik.handleChange(e);
  };

  const handlePrintLabelOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newData = deepCopyShipmentData(data);

    if (
      newData?.is_print_label === null ||
      newData?.is_print_label === undefined
    ) {
      return;
    }

    newData.is_print_label = e.target.checked;

    setData(newData);
  };

  const handleShipmentSubmit = () => {
    updateShipment({
      request: data as Shipment,
    })
      .unwrap()
      .then(() => {
        notifySuccessToast('Shipment has been updated!');
      })
      .catch((err) => {
        if ('data' in err) {
          const response = err.data as UpdateShipmentResponse;

          notifyErrorToast(response.message);
        }
      })
      .finally();
  };

  const renderLoading = () => {
    return (
      <div className='p-4 md:p-10'>
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-20' />
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
            <Skeleton className='h-14' />
            <Skeleton className='h-14' />
            <Skeleton className='h-14' />
            <Skeleton className='h-14' />
          </div>
          <Skeleton className='h-20' />
          <Skeleton className='h-20' />
          <div className='flex justify-end'>
            <Skeleton className='h-[3rem] w-[8rem]' />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (getShipmentData?.data === null || getShipmentData?.data === undefined) {
      return;
    }

    shipmentFormik.setFieldValue(
      'preorderDay',
      getShipmentData?.data.preorder_day || 0
    );
    console.log('use');
    setData({ ...getShipmentData?.data });
  }, [getShipmentData]);

  const getShipmentLoadingIsFinished =
    !getShipmentIsLoading && data !== undefined && data !== null;

  if (!getShipmentLoadingIsFinished) {
    return renderLoading();
  }

  return (
    <div className='p-4 md:p-10'>
      {getShipmentLoadingIsFinished && (
        <>
          <SectionHeading
            title='Shipment'
            description='Configure your preferred shipment method.'
            icon={<BiPackage />}
          />
          <Divider />
          {data !== undefined && (
            <CouriersConfiguration
              data={data.couriers}
              updateData={updateData}
            />
          )}
          <Divider />
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-start lg:justify-between'>
            <SectionHeading
              title='Process Day'
              description='Change process day for all product in your shop.'
              icon={<IoCalendarNumberOutline />}
            />
            <Divider />
            <div className='flex flex-col gap-2 w-full lg:w-[50%]'>
              <div className='flex items-center gap-5'>
                <Input
                  type='number'
                  name='preorderDay'
                  className='w-full'
                  value={shipmentFormik.values.preorderDay}
                  onChange={handleProcessDayOnChange}
                  onFocus={() => (shipmentFormik.touched.preorderDay = true)}
                />
                <span>days</span>
              </div>
              {shipmentFormik.touched.preorderDay &&
                shipmentFormik.errors.preorderDay && (
                  <label className='label-text-alt text-error'>
                    {shipmentFormik.errors.preorderDay}
                  </label>
                )}
            </div>
          </div>
          <Divider />
          {/* Print Label */}
          <div className='flex items-center justify-between'>
            <SectionHeading
              title='Print Label'
              description='Print label delivery service or all orders.'
              icon={<IoDocumentsOutline />}
            />
            <Toggle
              checked={data.is_print_label}
              onChange={handlePrintLabelOnChange}
              className='w-20 h-10'
            />
          </div>
          <Divider />
          <div className='flex justify-end'>
            <Button
              className='w-full md:w-auto'
              startIcon={<BiSave className='text-xl' />}
              color='primary'
              onClick={shipmentFormik.submitForm}
              loading={updateShipmentIsLoading}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShipmentContent;
