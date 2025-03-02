import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Router } from './router';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { checkUserAuth, getBurgerIngredients } from '@slices';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBurgerIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Router />
    </div>
  );
};

export default App;
