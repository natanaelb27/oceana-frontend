import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router';

type ScrollToTopProps = {
  children: ReactNode;
};

const ScrollToTop = ({ children }: ScrollToTopProps) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
