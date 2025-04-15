import { authCheckedSelector } from '@slices';
import { useSelector } from '../../services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children?: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(authCheckedSelector);
  const location = useLocation();

  if (!onlyUnAuth && !isAuthChecked)
    return <Navigate replace to='/login' state={{ from: location }} />;

  if (onlyUnAuth && isAuthChecked) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children ? <>{children}</> : <Outlet />;
};
