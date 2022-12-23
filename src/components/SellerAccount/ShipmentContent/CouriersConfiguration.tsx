import React, { ChangeEvent } from 'react';
import { Collapse, Checkbox, Divider } from 'react-daisyui';
import { Shipment } from '../../../types/component/shipment';
import { Image } from '../../common';

type CouriersConfigurationProps = {
  data: Shipment;
  updateData: (newData: Shipment) => void;
};

const CouriersConfiguration = ({
  data,
  updateData,
}: CouriersConfigurationProps) => {
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

    updateData(newData);
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

    updateData(newData);
  };

  return (
    // loop through courier
    <>
      {data?.couriers.map((courier, indexCourier) => (
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
                <Image src={courier.logo_url} className='h-12' />
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
      ))}
    </>
  );
};

export default CouriersConfiguration;
