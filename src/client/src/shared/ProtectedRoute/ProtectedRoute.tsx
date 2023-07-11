import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks/hooks';
import { IPrivateRouteProps } from './ProtectedRoute.props';

export const ProtectedRoute: FC<IPrivateRouteProps> = ({
  children,
  redirectPath = '/',
}) => {
  const { user } = useAppSelector((state) => state.user);

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ?? <Outlet />;
};
