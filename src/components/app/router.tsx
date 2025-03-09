import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { OrderInfo } from '../order-info';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { useEffect, useState } from 'react';

export const Router = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  const [hasNavigated, setHasNavigated] = useState(false);

  // Восстановление состояния после обновления страницы
  useEffect(() => {
    if (!hasNavigated) {
      const path = window.location.pathname;

      // Если URL указывает на детали заказа в ленте, открываем модальное окно
      if (path.startsWith('/feed/')) {
        const orderNumber = path.split('/').pop(); // Получаем номер заказа из URL
        navigate(`/feed/${orderNumber}`, { state: { background: location } });
        setHasNavigated(true); // Устанавливаем флаг после первого вызова
      }
    }
  }, [navigate, location, hasNavigated]);

  return (
    <>
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />

        {/* Маршруты, доступные только для неавторизованных пользователей */}
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        {/* Маршруты, доступные только для авторизованных пользователей */}
        <Route element={<ProtectedRoute />}>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders'>
              <Route index element={<ProfileOrders />} />
              <Route path=':number' element={<OrderInfo />} />
            </Route>
          </Route>

          {/* Лента заказов (доступна всем, но детали заказов только для авторизованных) */}
          <Route path='/feed'>
            <Route index element={<Feed />} />
            <Route path=':number' element={<OrderInfo />} />
          </Route>
        </Route>

        {/* Маршруты, доступные всем пользователям */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={() => navigate('/feed')}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => navigate('/profile/orders')}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
