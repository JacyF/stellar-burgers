import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserDataSelector } from '@slices';

export const AppHeader: FC = () => {
  const userData = useSelector(getUserDataSelector);

  return <AppHeaderUI userName={userData ? userData.name : ''} />;
};
