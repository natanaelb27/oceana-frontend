import { useRoutes } from 'react-router-dom';

import { selectRole } from '../store/slices/authSlice';
import { useAppSelector } from '../store/store';
import { Role } from '../types/role';
import { validateUserRole } from '../utils/auth';
import {
  ADMIN_ROUTES,
  BUYER_ROUTES,
  GUEST_ROUTES,
  SELLER_ROUTES,
} from './routes';

const Routes = () => {
  const roleCode = useAppSelector(selectRole);
  const role = validateUserRole(roleCode);

  if (role === Role.Buyer) {
    return useRoutes(BUYER_ROUTES);
  } else if (role === Role.Seller) {
    return useRoutes(SELLER_ROUTES);
  } else if (role === Role.Admin) {
    return useRoutes(ADMIN_ROUTES);
  }

  return useRoutes(GUEST_ROUTES);
};

export default Routes;
