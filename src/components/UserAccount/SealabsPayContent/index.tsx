import { useState } from 'react';
import { Button, Card, Divider, Tooltip } from 'react-daisyui';
import { HiOutlineClipboardList, HiOutlineTrash } from 'react-icons/hi';
import {
  useDeleteSealabsPayMutation,
  useGetAllSealabsPayQuery,
  useSetDefaultSealabsPayMutation,
} from '../../../store/services/sealabsPayService';
import { capitalizeFirstLetter } from '../../../utils/capitalizeFirstLetter';
import { toCardNumber, toStringDate } from '../../../utils/convert';
import { notifyErrorToast, notifySuccessToast } from '../../../utils/toast';
import {
  ConfirmationModal,
  SealabsPayCardImg,
  SealabsPayImg,
} from '../../common';
import SealabsPayRegisterModal from './SealabsPayRegisterModal';

type OpenSealabsPayModal = {
  add: boolean;
  delete: boolean;
  default: boolean;
};

const SealabsPayContent = () => {
  const [openModal, setOpenModal] = useState<OpenSealabsPayModal>({
    add: false,
    delete: false,
    default: false,
  });
  const [sealabsPayID, setSealabsPayID] = useState<string | null>(null);
  const { data: getAllSealabsPayData } = useGetAllSealabsPayQuery();
  const [deleteSealabsPay, { isLoading: deleteSealabsPayIsLoading }] =
    useDeleteSealabsPayMutation();
  const [setDefaultSealabsPay, { isLoading: setDefaultSealabsPayIsLoading }] =
    useSetDefaultSealabsPayMutation();

  const handleAddSealabsPayClick = () => {
    setOpenModal({
      add: true,
      delete: false,
      default: false,
    });
    setSealabsPayID(null);
  };

  const handleDeleteSealabsPayClick = (id: string) => {
    setOpenModal({
      add: false,
      delete: true,
      default: false,
    });
    setSealabsPayID(id);
  };

  const handleDefaultSealabsPayClick = (id: string) => {
    setOpenModal({
      add: false,
      delete: false,
      default: true,
    });
    setSealabsPayID(id);
  };

  const handleModalClose = () => {
    setOpenModal({
      add: false,
      delete: false,
      default: false,
    });
    setSealabsPayID(null);
  };

  const handleDeleteSealabsPay = () => {
    setOpenModal({
      add: false,
      delete: false,
      default: false,
    });
    if (!sealabsPayID) {
      return;
    }
    deleteSealabsPay(sealabsPayID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Card has been deleted!');
      })
      .catch((err) => {
        const { data } = err;
        const { message } = data;
        const messageCapitalized = capitalizeFirstLetter(message);
        notifyErrorToast(messageCapitalized, true);
      })
      .finally(() => {
        setSealabsPayID(null);
      });
  };

  const handleSetDefaultSealabsPay = () => {
    setOpenModal({
      add: false,
      delete: false,
      default: false,
    });
    if (!sealabsPayID) {
      return;
    }
    setDefaultSealabsPay(sealabsPayID)
      .unwrap()
      .then(() => {
        notifySuccessToast('Card has been set as default!');
      })
      .catch((err) => {
        const { data } = err;
        const { message } = data;
        const messageCapitalized = capitalizeFirstLetter(message);
        notifyErrorToast(messageCapitalized, true);
      })
      .finally(() => {
        setSealabsPayID(null);
      });
  };

  return (
    <div className='p-4 md:p-10'>
      <h5 className='font-bold text-2xl text-primary'>Sealabs Pay</h5>
      <Divider />
      <div className='flex justify-end'>
        <Button
          className='w-full mb-4 md:w-auto'
          startIcon={<SealabsPayImg className='w-6' />}
          color='primary'
          onClick={handleAddSealabsPayClick}
        >
          Account
        </Button>
      </div>
      <div className='flex flex-col gap-4 md:flex-row'>
        {getAllSealabsPayData?.data?.map(
          ({ id, card_number, name_on_card, is_default, active_date }) => (
            <Card
              key={id}
              className={`p-6 w-[320px] h-[200px] glass text-base-100 rounded-3xl md:w-[420px] md:h-[240px] hover:shadow-2xl ${
                is_default
                  ? 'bg-secondary hover:bg-secondary'
                  : 'bg-primary/80 hover:bg-primary/80 cursor-pointer'
              }`}
              onDoubleClick={() =>
                is_default ? null : handleDefaultSealabsPayClick(id)
              }
            >
              <Card.Title className='flex justify-between text-4xl'>
                <h1 className='text-2xl md:text-3xl'>{name_on_card}</h1>
                <SealabsPayCardImg className='w-14' />
              </Card.Title>
              <Card.Body className='p-0 pt-6 md:pt-10'>
                <h2 className='text-xl font-mono md:text-3xl'>
                  {toCardNumber(card_number, false)}
                </h2>
                <div className='mt-4 md:mt-8 flex justify-between'>
                  <p>Since: {toStringDate(active_date)}</p>
                  <div className='flex gap-1'>
                    {!is_default && (
                      <Tooltip message='Set as default'>
                        <Button
                          color='primary'
                          shape='circle'
                          size='sm'
                          onClick={() => handleDefaultSealabsPayClick(id)}
                        >
                          <HiOutlineClipboardList className='text-xl' />
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip message='Delete'>
                      <Button
                        color={is_default ? 'secondary' : 'primary'}
                        shape='circle'
                        size='sm'
                        onClick={() => handleDeleteSealabsPayClick(id)}
                      >
                        <HiOutlineTrash className='text-xl' />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )
        )}
      </div>
      <SealabsPayRegisterModal
        open={openModal.add}
        onClose={handleModalClose}
      />
      <ConfirmationModal
        open={openModal.delete}
        title='Are you sure?'
        message='This action cannot be undone'
        loading={deleteSealabsPayIsLoading}
        onClose={handleModalClose}
        onAccepted={handleDeleteSealabsPay}
      />
      <ConfirmationModal
        open={openModal.default}
        title='Are you sure?'
        message='Your default Sealabs Pay account will be changed'
        loading={setDefaultSealabsPayIsLoading}
        onClose={handleModalClose}
        onAccepted={handleSetDefaultSealabsPay}
      />
    </div>
  );
};

export default SealabsPayContent;
