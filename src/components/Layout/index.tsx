import { Outlet } from 'react-router-dom';

import { Footer, Header } from '../common';

const Layout = () => {
  return (
    <div className='bg-base-300 min-h-screen'>
      <Header />
      <main className='bg-base-100'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
