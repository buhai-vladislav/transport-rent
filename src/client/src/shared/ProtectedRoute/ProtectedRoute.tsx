import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks/hooks';
import { IPrivateRouteProps } from './ProtectedRoute.props';

export const ProtectedRoute: FC<IPrivateRouteProps> = ({
  children,
  redirectPath = '/',
  roles,
}) => {
  const { user } = useAppSelector((state) => state.user);
  const { pathname } = useLocation();

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (user && roles?.length) {
    if (roles.includes(user.role)) {
      return children ?? <Outlet />;
    } else {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children ?? <Outlet />;
};
