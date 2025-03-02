import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPassword,
  isErrorSelector,
  isLoadingSelector,
  resetErrorMessage
} from '@slices';
import { Preloader } from '@ui';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const isError = useSelector(isErrorSelector);
  const isLoading = useSelector(isLoadingSelector);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((data) => {
      if (data.payload) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      }
    });
  };

  if (isLoading) return <Preloader />;

  return (
    <ForgotPasswordUI
      errorText={isError ? 'Электронный адрес не существует или не найден' : ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
