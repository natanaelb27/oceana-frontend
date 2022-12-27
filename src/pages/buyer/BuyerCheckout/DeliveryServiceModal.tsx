import React, { useEffect, useState } from 'react';
import { Modal } from 'react-daisyui';
import { Image, Skeleton } from '../../../components/common';
import {
  useCheckProductCourierServicesMutation,
  useLazyGetProductsLogisticsQuery,
} from '../../../store/services/productService';
import { useGetRajaOngkirShippingCostMutation } from '../../../store/services/rajaOngkir';
import {
  AvailableProductsForDelivery,
  Courier,
  DeliveryService,
  RajaOngkirShippingService,
} from '../../../types/component';
import { GetRajaOngkirShippingCostRequest } from '../../../types/request';
import { toETD, toRupiah } from '../../../utils/convert';
import { toProductCheckCourierService } from '../../../utils/mapperDTO';
import { notifyErrorToast } from '../../../utils/toast';

type DeliveryServiceModalProps = {
  deliveryService: DeliveryService | null;
  currentMerchantID: number;
  currentMerchantProductIDs: number[];
  getShippingCostRequest: GetRajaOngkirShippingCostRequest | null;
  open: boolean;
  onClose: () => void;
  setDeliveryService: React.Dispatch<
    React.SetStateAction<DeliveryService | null>
  >;
  setAvailableProductsForDelivery: React.Dispatch<
    React.SetStateAction<AvailableProductsForDelivery>
  >;
};

const DeliveryServiceModal = ({
  deliveryService,
  currentMerchantID,
  currentMerchantProductIDs,
  getShippingCostRequest,
  open,
  onClose,
  setDeliveryService,
  setAvailableProductsForDelivery,
}: DeliveryServiceModalProps) => {
  const [getProductsLogistics, { data: getProductsLogisticsData }] =
    useLazyGetProductsLogisticsQuery();
  const [getRajaOngkirShippingCost] = useGetRajaOngkirShippingCostMutation();
  const [checkProductCourierServices] =
    useCheckProductCourierServicesMutation();
  const [openCourierServicesModal, setOpenCourierServicesModal] =
    useState<boolean>(false);
  const [courierServices, setCourierServices] = useState<
    RajaOngkirShippingService[] | null
  >(null);
  const [courier, setCourier] = useState<Courier | null>(null);

  const handleCourierClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    selectedCourier: Courier
  ) => {
    if (!getShippingCostRequest) {
      onClose();
      return;
    }
    const courierCode = e.currentTarget.id;
    getShippingCostRequest.courier = courierCode;
    setOpenCourierServicesModal(true);
    getRajaOngkirShippingCost(getShippingCostRequest)
      .unwrap()
      .then((response) => {
        const courierServicesData = response.data?.costs
          ? response.data.costs
          : [];
        if (courierServicesData.length === 0) {
          notifyErrorToast(
            'Courier service unavailable, please pick a different courier'
          );
          handleCourierServiceModalClose();
          return;
        }
        setCourierServices(courierServicesData);
        setCourier({
          ...selectedCourier,
          courier_services: [],
        });
      })
      .catch(() => {
        notifyErrorToast(
          `Services unavailable for ${selectedCourier.name}, please try another courier`
        );
        handleCourierServiceModalClose();
      });
  };

  const handleCourierServiceClick = (
    courierService: RajaOngkirShippingService
  ) => {
    if (!courier) {
      return;
    }
    setDeliveryService((prev) => ({
      ...prev,
      [currentMerchantID]: {
        ...courier,
        courier_services: [
          {
            code: courierService.service,
            description: courierService.description,
            id: courierService.courier_service_id,
            is_selected: true,
            shipping_fee: courierService.cost[0].value,
            etd: courierService.cost[0].etd,
            courier: [courier],
          },
        ],
      },
    }));
    checkProductCourierServices(
      toProductCheckCourierService(
        courier.code,
        courierService.service,
        currentMerchantProductIDs
      )
    )
      .unwrap()
      .then((res) => {
        const { data } = res;
        if (!data) return;
        setAvailableProductsForDelivery((prev) => ({
          ...prev,
          [currentMerchantID]: data.available_products,
        }));
      });
    handleCourierServiceModalClose();
  };

  const handleCourierServiceModalClose = () => {
    setCourier(null);
    setCourierServices(null);
    setOpenCourierServicesModal(false);
    onClose();
  };

  useEffect(() => {
    if (open) getProductsLogistics(currentMerchantID);
  }, [open]);

  if (!getProductsLogisticsData?.data) {
    return (
      <Modal
        open={open}
        responsive
        className='max-w-sm'
        onClickBackdrop={handleCourierServiceModalClose}
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
    <>
      <Modal
        open={open}
        responsive
        className='max-w-sm'
        onClickBackdrop={handleCourierServiceModalClose}
      >
        <Modal.Header className='mb-4 text-xl text-primary font-bold'>
          Delivery Service
        </Modal.Header>
        <Modal.Body className='h-80 overflow-y-auto hide-scrollbar md:h-96'>
          <div className='grid grid-cols-2 gap-4'>
            {getProductsLogisticsData.data.couriers.map((courier) => (
              <div
                key={courier.id}
                id={courier.code}
                className={`p-4 flex flex-col items-center rounded-3xl cursor-pointer ${
                  deliveryService &&
                  deliveryService[currentMerchantID]?.id === courier.id
                    ? 'bg-primary/10 border border-primary active:bg-primary/20'
                    : 'hover:bg-primary/20 active:bg-primary/10'
                }`}
                onClick={(e) => handleCourierClick(e, courier)}
              >
                <Image src={courier.logo_url} />
                <div className='text-sm'>{courier.name}</div>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
      {openCourierServicesModal && !courierServices ? (
        <Modal
          open={openCourierServicesModal}
          responsive
          className='max-w-sm'
          onClickBackdrop={handleCourierServiceModalClose}
        >
          <Modal.Header>
            <Skeleton className='w-44 h-5' />
          </Modal.Header>
          <Modal.Body className='h-80 overflow-y-auto'>
            <div className='grid grid-cols-1 gap-6'>
              {Array(4)
                .fill(0)
                .map((_, n) => (
                  <div key={n} className='w-full flex justify-between'>
                    <Skeleton className='w-32 h-4' />
                    <Skeleton className='w-20 h-4' />
                  </div>
                ))}
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        <Modal
          open={openCourierServicesModal}
          responsive
          className='max-w-sm'
          onClickBackdrop={handleCourierServiceModalClose}
        >
          <Modal.Header className='mb-4 text-xl text-primary font-bold'>
            Delivery Service
          </Modal.Header>
          <Modal.Body className='h-80 overflow-y-auto'>
            <div className='grid grid-cols-1 gap-4'>
              {courierServices &&
                courierServices.map((courierService) => (
                  <div
                    key={courierService.service}
                    className={`p-4 flex flex-col rounded-3xl cursor-pointer ${
                      deliveryService &&
                      deliveryService[currentMerchantID]?.courier_services[0]
                        .code === courierService.service
                        ? 'bg-primary/10 border border-primary active:bg-primary/20'
                        : 'hover:bg-primary/20 active:bg-primary/10'
                    }`}
                    onClick={() => handleCourierServiceClick(courierService)}
                  >
                    <div className='flex justify-between'>
                      <div>{courierService.description}</div>
                      <div>{toRupiah(courierService.cost[0].value)}</div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-sm font-light'>{`Estimated delivery: ${toETD(
                        courierService.cost[0].etd
                      )}`}</div>
                      <div className='text-sm font-light'>
                        {courierService.service}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default DeliveryServiceModal;
