import { useRoutes } from 'react-router-dom';

import { SELLER_ROUTES } from './routes';

const Routes = () => {
  const routes = useRoutes(SELLER_ROUTES);

  return routes;
};

export default Routes;
