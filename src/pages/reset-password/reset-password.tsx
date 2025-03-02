import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  isErrorSelector,
  isLoadingSelector,
  resetErrorMessage,
  resetPassword
} from '@slices';
import { Preloader } from '@ui';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const isError = useSelector(isErrorSelector);
  const isLoading = useSelector(isLoadingSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ password, token }))
      .then((data) => {
        if (data.payload) {
          localStorage.removeItem('resetPassword');
          navigate('/login');
        }
      })
      .catch(() => console.log('Ошибка сброса пароля'));
  };

  useEffect(() => {
    dispatch(resetErrorMessage());
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate, dispatch]);

  if (isLoading) return <Preloader />;

  return (
    <ResetPasswordUI
      errorText={isError ? 'Указан неверный код подтверждения' : ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
