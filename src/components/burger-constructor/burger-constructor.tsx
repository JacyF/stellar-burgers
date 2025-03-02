import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  authCheckedSelector,
  getConstructorItemsSelector,
  getOrderRequestSelector,
  getOrderResponseSelector,
  orderBurger,
  resetConstructorItems,
  resetOrderResponse
} from '@slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthChecked = useSelector(authCheckedSelector);
  const constructorItems = useSelector(getConstructorItemsSelector);
  const orderRequest = useSelector(getOrderRequestSelector);
  const orderModalData = useSelector(getOrderResponseSelector);

  const onOrderClick = () => {
    if (!isAuthChecked) {
      navigate('/login');
      return;
    }
    dispatch(orderBurger(constructorItems));
    dispatch(resetConstructorItems());
  };

  const closeOrderModal = () => {
    dispatch(resetOrderResponse());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients.length > 0
        ? constructorItems.ingredients?.reduce(
            (accum, currentValue) => accum + currentValue.price,
            0
          )
        : 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
