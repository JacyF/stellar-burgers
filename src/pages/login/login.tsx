import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  authCheckedSelector,
  isErrorSelector,
  isLoadingSelector,
  loginUser,
  resetErrorMessage
} from '@slices';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthenticated = useSelector(authCheckedSelector);
  const isError = useSelector(isErrorSelector);
  const isLoading = useSelector(isLoadingSelector);

  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText={isError ? 'Электронный адрес или пароль введены неверно' : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
