import { useState, useEffect, ChangeEvent } from 'react';
import { Collapse, Divider, Checkbox, Button } from 'react-daisyui';
import { AiFillSave } from 'react-icons/ai';
import { BiSave } from 'react-icons/bi';
import { BsSave2Fill, BsSaveFill } from 'react-icons/bs';
import { HiPlus, HiSave } from 'react-icons/hi';
import { useGetShipmentQuery } from '../../../store/services/shipmentService';
import { Shipment } from '../../../types/component/shipment';

const ShipmentContent = () => {
  const { data: getShipmentData, isLoading: getShipmentIsLoading } =
    useGetShipmentQuery();
  const [data, setData] = useState<Shipment | null | undefined>(null);

  const handleCourierOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    // deep copy using this method
    const newData = data
      ? (JSON.parse(JSON.stringify(data)) as typeof data)
      : null;

    if (
      newData?.couriers?.[i]?.is_selected === null ||
      newData?.couriers?.[i]?.is_selected === undefined
    ) {
      return;
    }
    console.log(e.target.checked);

    newData.couriers[i].is_selected = e.target.checked;

    setData(newData);
  };

  useEffect(() => {
    if (getShipmentData?.data === null || getShipmentData?.data === undefined) {
      return;
    }

    setData({ ...getShipmentData?.data });
  }, [getShipmentData]);

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Shipment</h5>
      <Divider />
      <div className='grid grid-cols-2 gap-4'>
        {!getShipmentIsLoading &&
          data?.couriers.map((courier, i) => (
            <div key={'courier-' + i}>
              <Collapse
                checkbox
                icon='arrow'
                className='shadow shadow-stone-300 rounded-lg'
                open={courier.courier_services.length === 0 ? false : undefined}
              >
                <Collapse.Title>
                  <div className='flex flex-row gap-4 items-center'>
                    <Checkbox
                      onChange={(e) => handleCourierOnChange(e, i)}
                      checked={courier.is_selected}
                      className='z-10'
                    />
                    <img src={courier.logo_url} className='h-12' />
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
                  {courier.courier_services.map((courier_service, i) => (
                    <div
                      className='flex w-full gap-4 font-sans'
                      key={'courier-service-' + i}
                    >
                      <Checkbox />
                      <span>{courier_service.code}</span>
                    </div>
                  ))}
                </Collapse.Content>
              </Collapse>
            </div>
          ))}
      </div>
      <Divider />
      <div className='flex justify-end'>
        <Button
          className='w-full md:w-auto'
          startIcon={<BiSave className='text-xl' />}
          color='primary'
          // onClick={handleAddAddressClick}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ShipmentContent;
