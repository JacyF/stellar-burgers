import { authCheckedSelector, getUserDataSelector } from '@slices';
import { useSelector } from '../../services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(authCheckedSelector);
  const user = useSelector(getUserDataSelector);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if (!onlyUnAuth && !user)
    return <Navigate replace to='/login' state={{ from: location }} />;

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return <Outlet />;
};
