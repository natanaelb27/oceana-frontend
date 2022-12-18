import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  Input,
  Toggle,
} from 'react-daisyui';
import { BiPackage, BiSave } from 'react-icons/bi';
import { IoCalendarNumberOutline, IoDocumentsOutline } from 'react-icons/io5';
import * as Yup from 'yup';
import {
  useGetShipmentQuery,
  useUpdateShipmentMutation,
} from '../../../store/services/shipmentService';
import { Shipment } from '../../../types/component/shipment';
import { UpdateShipmentResponse } from '../../../types/response';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import Img from '../../common/Img';
import Skeleton from '../../common/Loading/Skeleton';
import SectionHeading from '../../common/SectionHeading/index';
import { formikProcessDayAnndPreorderDay } from '../../../utils/yupValidation';

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

  const deepCopyShipmentData = (data: Shipment | null | undefined) => {
    return data ? (JSON.parse(JSON.stringify(data)) as typeof data) : null;
  };

  const handleCourierOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    indexCourier: number
  ) => {
    // deep copy using this method
    const newData = data
      ? (JSON.parse(JSON.stringify(data)) as typeof data)
      : null;

    // if not exist then do nothing
    if (
      newData?.couriers?.[indexCourier]?.is_selected === null ||
      newData?.couriers?.[indexCourier]?.is_selected === undefined
    ) {
      return;
    }

    // set courier is selected
    newData.couriers[indexCourier].is_selected = e.target.checked;

    // also set its all courier services is selected to true
    for (const indexCourierService in newData.couriers[indexCourier]
      .courier_services) {
      newData.couriers[indexCourier].courier_services[
        indexCourierService
      ].is_selected = e.target.checked;
    }

    setData(newData);
  };

  const handleCourierServiceOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    indexCourier: number,
    indexCourierService: number
  ) => {
    // deep copy using this method
    const newData = data
      ? (JSON.parse(JSON.stringify(data)) as typeof data)
      : null;

    if (
      newData?.couriers?.[indexCourier]?.courier_services[indexCourierService]
        .is_selected === null ||
      newData?.couriers?.[indexCourier]?.courier_services[indexCourierService]
        .is_selected === undefined
    ) {
      return;
    }

    newData.couriers[indexCourier].courier_services[
      indexCourierService
    ].is_selected = e.target.checked;

    // check if at least one courier service is selected then also set its courier is selected to true, else false
    let atLeastOneCourierServiceIsSelected = false;
    for (const indexCourierService in newData.couriers[indexCourier]
      .courier_services) {
      if (
        newData.couriers[indexCourier].courier_services[indexCourierService]
          .is_selected === true
      ) {
        atLeastOneCourierServiceIsSelected = true;
      }
    }
    if (atLeastOneCourierServiceIsSelected === true) {
      newData.couriers[indexCourier].is_selected = true;
    } else {
      newData.couriers[indexCourier].is_selected = false;
    }

    setData(newData);
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

  const renderCourier = () => {
    return (
      // loop through courier
      data?.couriers.map((courier, indexCourier) => (
        <div
          className='hover:scale-[102%] transition-all'
          key={'courier-' + indexCourier}
        >
          <Collapse
            checkbox
            icon='arrow'
            className='shadow shadow-stone-300 rounded-lg'
            // collapse open is false if courier service length is 0
            open={courier.courier_services.length === 0 ? false : undefined}
          >
            <Collapse.Title>
              <div className='flex flex-row gap-4 items-center'>
                <Checkbox
                  className='z-10'
                  checked={courier.is_selected}
                  onChange={(e) => handleCourierOnChange(e, indexCourier)}
                />
                <Img src={courier.logo_url} className='h-12' />
                <div>
                  <p className='text-xl font-medium'>{courier.name}</p>
                  <p className='text-sm font-medium text-gray-500'>
                    Courier code: {courier.code}
                  </p>
                </div>
              </div>
            </Collapse.Title>
            <Collapse.Content>
              <Divider className='mt-1' />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {
                  // loop through courier service
                  courier.courier_services.map(
                    (courier_service, indexCourierService) => (
                      <div
                        className='flex w-full gap-4 font-sans'
                        key={
                          'courier-' +
                          indexCourier +
                          'courier-service-' +
                          indexCourierService
                        }
                      >
                        <Checkbox
                          checked={courier_service.is_selected}
                          onChange={(e) =>
                            handleCourierServiceOnChange(
                              e,
                              indexCourier,
                              indexCourierService
                            )
                          }
                        />
                        <span>{courier_service.code}</span>
                      </div>
                    )
                  )
                }
              </div>
            </Collapse.Content>
          </Collapse>
        </div>
      ))
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
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
            {renderCourier()}
          </div>
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
