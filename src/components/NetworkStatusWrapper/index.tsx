import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import ClassNames from '../../utils/classnames';
import { notifyErrorToast, notifySuccessToast } from '../../utils/toast';

type NetworkStatusWrapperProps = {
  children: React.ReactNode;
};

const NetworkStatusWrapper = ({ children }: NetworkStatusWrapperProps) => {
  const [online, setOnline] = useState(true);
  const [lostConnection, setLostConnection] = useState(false);

  useEffect(() => {
    function changeStatus() {
      setOnline(navigator.onLine);
    }
    window.addEventListener('online', changeStatus);
    window.addEventListener('offline', changeStatus);
  }, []);

  useEffect(() => {
    if (online == true) {
      if (lostConnection == true) {
        notifySuccessToast('Yippikiyay you are back online!');
        setLostConnection(false);
      }
      return;
    }
    notifyErrorToast('Oops we lost you:( Please check your connection!');
    setLostConnection(true);
  }, [online]);

  return (
    <div
      className={ClassNames([
        online ? '' : 'sticky z-20 h-screen w-screen grayscale ',
      ])}
    >
      {children}
    </div>
  );
};

export default NetworkStatusWrapper;
