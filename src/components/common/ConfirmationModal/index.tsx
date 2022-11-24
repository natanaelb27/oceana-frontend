import { Button, Modal, Swap } from 'react-daisyui';
import { FaExclamationCircle } from 'react-icons/fa';

type ConfirmationModalProps = {
  open?: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onClose: () => void;
  onAccepted: () => void;
};

const ConfirmationModal = ({
  open,
  title,
  message,
  loading,
  onClose,
  onAccepted,
}: ConfirmationModalProps) => {
  return (
    <Modal
      open={open}
      responsive
      className='max-w-sm'
      onClickBackdrop={onClose}
    >
      <Modal.Body className='text-center'>
        <Swap
          offElement={
            <FaExclamationCircle className='mx-auto text-warning text-8xl mb-4 mt-4' />
          }
          onElement={
            <FaExclamationCircle className='mx-auto text-secondary text-8xl mb-4 mt-4 animate-bounce' />
          }
        />
        <h3 className='text-4xl mb-2.5 font-medium'>{title}</h3>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Actions className='justify-center'>
        <Button onClick={onClose}>Cancel</Button>
        <Button color='primary' onClick={onAccepted} loading={loading}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmationModal;
