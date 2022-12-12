import { Button } from 'react-daisyui';
import { Outlet } from 'react-router-dom';
import { HiArrowSmUp } from 'react-icons/hi';

import { Footer, Header } from '../common';
import { useScrollPosition } from '../../hooks';

const Layout = () => {
  const scrollPosition = useScrollPosition();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='bg-base-300 min-h-screen'>
      <Header />
      <main className='bg-base-100'>
        <Outlet />
      </main>
      <Footer />
      <Button
        color='secondary'
        shape='circle'
        className={`${
          scrollPosition > 0 ? 'fixed' : 'hidden'
        } z-90 bottom-10 right-8 transition-all duration-100 shadow-xl hover:shadow-2xl`}
        onClick={handleScrollToTop}
      >
        <HiArrowSmUp className='text-2xl' />
      </Button>
    </div>
  );
};

export default Layout;
