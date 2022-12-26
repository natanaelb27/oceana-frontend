import { ChangeEvent } from 'react';
import { Checkbox, Collapse, Divider } from 'react-daisyui';
import { Courier } from '../../../types/component/shipment';
import { Image } from '../../common';

type CouriersConfigurationProps = {
  data: Courier[];
  updateData: (newData: Courier[]) => void;
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
    const newData = JSON.parse(JSON.stringify(data)) as typeof data;

    // if not exist then do nothing
    if (
      newData[indexCourier]?.is_selected === null ||
      newData[indexCourier]?.is_selected === undefined
    ) {
      return;
    }

    // set courier is selected
    newData[indexCourier].is_selected = e.target.checked;

    // also set its all courier services is selected to true
    for (const indexCourierService in newData[indexCourier].courier_services) {
      newData[indexCourier].courier_services[indexCourierService].is_selected =
        e.target.checked;
    }

    updateData(newData);
  };

  const handleCourierServiceOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    indexCourier: number,
    indexCourierService: number
  ) => {
    // deep copy using this method
    const newData = JSON.parse(JSON.stringify(data)) as typeof data;

    if (
      newData[indexCourier]?.courier_services[indexCourierService]
        .is_selected === null ||
      newData[indexCourier]?.courier_services[indexCourierService]
        .is_selected === undefined
    ) {
      return;
    }

    newData[indexCourier].courier_services[indexCourierService].is_selected =
      e.target.checked;

    // check if at least one courier service is selected then also set its courier is selected to true, else false
    let atLeastOneCourierServiceIsSelected = false;
    for (const indexCourierService in newData[indexCourier].courier_services) {
      if (
        newData[indexCourier].courier_services[indexCourierService]
          .is_selected === true
      ) {
        atLeastOneCourierServiceIsSelected = true;
      }
    }
    if (atLeastOneCourierServiceIsSelected === true) {
      newData[indexCourier].is_selected = true;
    } else {
      newData[indexCourier].is_selected = false;
    }

    updateData(newData);
  };

  return (
    // loop through courier
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
      {data.map((courier, indexCourier) => (
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
    </div>
  );
};

export default CouriersConfiguration;
