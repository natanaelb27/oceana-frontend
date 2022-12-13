import { Button, Modal, Swap } from 'react-daisyui';
import { FaCheckCircle } from 'react-icons/fa';

type SuccessModalProps = {
  open?: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onClose: () => void;
  onAccepted: () => void;
};

const SuccessModal = ({
  open,
  title,
  message,
  loading,
  onClose,
  onAccepted,
}: SuccessModalProps) => {
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
            <FaCheckCircle className='mx-auto text-success text-8xl mb-4 mt-4' />
          }
          onElement={
            <FaCheckCircle className='mx-auto text-secondary text-8xl mb-4 mt-4 animate-bounce' />
          }
        />
        <h3 className='text-4xl mb-2.5 font-medium'>{title}</h3>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Actions className='justify-center'>
        <Button color='primary' onClick={onAccepted} loading={loading}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default SuccessModal;
