import { toast } from 'react-toastify';

export const notifySuccessToast = (
  message: string,
  hideProgressBar = false
) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  });
};

export const notifyErrorToast = (message: string, hideProgressBar = false) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  });
};

export const notifyInfoToast = (message: string, hideProgressBar = false) => {
  toast.info(message, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  });
};
