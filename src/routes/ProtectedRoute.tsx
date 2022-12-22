import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loading } from '../components/common';
import { Role } from '../types/role';
import { validateUserRole } from '../utils/auth';
import ScrollToTop from './ScrollToTop';

type ProtectedRouteProps = {
  roleCode: string | null;
  allowedRoles: Role[];
  isTokenExist: boolean;
  redirectTo?: string;
  children: JSX.Element;
};

const ProtectedRoute = ({
  roleCode,
  allowedRoles,
  isTokenExist,
  redirectTo,
  children,
}: ProtectedRouteProps) => {
  if (
    allowedRoles.length === 0 ||
    (allowedRoles.includes(Role.Guest) && !isTokenExist)
  ) {
    return children;
  }

  if (!roleCode && isTokenExist) {
    return <Loading isLoading />;
  }

  const role = validateUserRole(roleCode);

  if (!allowedRoles.includes(role)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} />;
    }

    return null;
  }

  return (
    <ScrollToTop>
      <React.Suspense fallback={<Loading isLoading />}>
        {children}
      </React.Suspense>
    </ScrollToTop>
  );
};

export default ProtectedRoute;
