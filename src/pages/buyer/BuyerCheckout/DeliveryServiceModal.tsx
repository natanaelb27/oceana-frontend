import { Button, Modal } from 'react-daisyui';
import { ArraySchema } from 'yup';
import { Img, Skeleton } from '../../../components/common';
import { useGetShipmentQuery } from '../../../store/services/shipmentService';
import { Courier, CourierService } from '../../../types/component/shipment';

type DeliveryServiceModalProps = {
  currentDeliveryService: Courier | null;
  open: boolean;
  onClose: () => void;
  setDeliveryService: (deliveryService: Courier) => void;
};

const DeliveryServiceModal = ({
  currentDeliveryService,
  open,
  onClose,
  setDeliveryService,
}: DeliveryServiceModalProps) => {
  const { data: getShipmentData } = useGetShipmentQuery();

  if (!getShipmentData?.data) {
    return (
      <Modal
        open={open}
        responsive
        className='max-w-sm'
        onClickBackdrop={onClose}
      >
        <Modal.Header className='mb-4 text-xl text-primary font-bold'>
          <Skeleton className='w-44 h-5' />
        </Modal.Header>
        <Modal.Body className='h-96 overflow-y-auto'>
          <div className='grid grid-cols-2 gap-4'>
            {Array(4)
              .fill(0)
              .map((_, n) => (
                <Skeleton key={n} className='w-40 h-40' />
              ))}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
  return (
    <Modal
      open={open}
      responsive
      className='max-w-sm'
      onClickBackdrop={onClose}
    >
      <Modal.Header className='mb-4 text-xl text-primary font-bold'>
        Delivery Service
      </Modal.Header>
      <Modal.Body className='h-80 overflow-y-auto hide-scrollbar md:h-96'>
        <div className='grid grid-cols-2 gap-4'>
          {getShipmentData.data.couriers.map((courier) => (
            <div
              key={courier.id}
              id={courier.code}
              className={`p-4 flex flex-col items-center rounded-3xl cursor-pointer ${
                currentDeliveryService &&
                currentDeliveryService.id === courier.id
                  ? 'bg-primary/10 border border-primary active:bg-primary/20'
                  : 'hover:bg-primary/20 active:bg-primary/10'
              }`}
            >
              <Img src={courier.logo_url} />
              <div className='text-sm'>{courier.name}</div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeliveryServiceModal;
