import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  isErrorSelector,
  isLoadingSelector,
  registerUser,
  resetErrorMessage
} from '@slices';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isError = useSelector(isErrorSelector);
  const isLoading = useSelector(isLoadingSelector);

  useEffect(() => {
    dispatch(resetErrorMessage());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  if (isLoading) return <Preloader />;

  return (
    <RegisterUI
      errorText={isError ? 'Пользователь с таким адресом уже существует' : ''}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setName}
      handleSubmit={handleSubmit}
    />
  );
};
