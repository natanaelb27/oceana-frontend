import { Outlet } from 'react-router-dom';

import { Footer, Header, Loading } from '../common';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Loading />
      <Footer />
    </>
  );
};

export default Layout;
