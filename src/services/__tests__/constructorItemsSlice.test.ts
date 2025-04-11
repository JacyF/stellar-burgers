import {
  TConstructorItemsState,
  addConstructorItem,
  constructorItemsReducer,
  moveUpConstructorItem,
  removeConstructorItem
} from '@slices';

describe('Тестирование редьюсера слайса constructorItemSlice', () => {
  const testConstructorItems = {
    bun: {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      id: '593ed11e-affe-4fcb-b670-1191832be0f2'
    },
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        id: 'c8082b8a-6f35-45eb-869c-87aa222db4e9'
      },
      {
        _id: '643d69a5c3f7b9001cfa0949',
        name: 'Мини-салат Экзо-Плантаго',
        type: 'main',
        proteins: 1,
        fat: 2,
        carbohydrates: 3,
        calories: 6,
        price: 4400,
        image: 'https://code.s3.yandex.net/react/code/salad.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/salad-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/salad-large.png',
        id: '96cdbfb7-f61c-45d9-94e4-f6d72c02e33e'
      },
      {
        _id: '643d69a5c3f7b9001cfa0942',
        name: 'Соус Spicy-X',
        type: 'sauce',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        id: '876b8249-c189-46e2-be3a-50d23eb2edba'
      }
    ]
  };

  const newIngredient = {
    _id: '643d69a5c3f7b9001cfa094a',
    name: 'Сыр с астероидной плесенью',
    type: 'main',
    proteins: 84,
    fat: 48,
    carbohydrates: 420,
    calories: 3377,
    price: 4142,
    image: 'https://code.s3.yandex.net/react/code/cheese.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/cheese-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/cheese-large.png',
    id: 'ab0904a0-e1f3-4876-b800-71eb13afd4cb'
  };

  const initialState: TConstructorItemsState = {
    loading: true,
    error: null,
    constructorItems: testConstructorItems
  };

  it('добавить ингредиент', () => {
    const newState = constructorItemsReducer(
      initialState,
      addConstructorItem(newIngredient)
    );

    expect(newState.constructorItems.ingredients).toHaveLength(
      testConstructorItems.ingredients.length + 1
    );

    expect(newState.constructorItems.ingredients.at(-1)?._id).toBe(
      '643d69a5c3f7b9001cfa094a'
    );
  });

  it('удалить ингредиент', () => {
    const newState = constructorItemsReducer(
      initialState,
      removeConstructorItem(2)
    );
    expect(newState.constructorItems.ingredients).toEqual(
      testConstructorItems.ingredients.slice(0, 2)
    );
  });

  describe('изменить порядок ингредиентов в начинке', () => {
    it('переместить элемент вверх', () => {
      const movedItem = testConstructorItems.ingredients.slice(-1)[0];
      const newState = constructorItemsReducer(
        initialState,
        moveUpConstructorItem(movedItem)
      );
      const expectedState = [...testConstructorItems.ingredients];
      expectedState.splice(-1);
      expectedState.splice(1, 0, movedItem);
      expect(newState.constructorItems.ingredients).toEqual(expectedState);
    });

    it('переместить элемент вниз', () => {
      const movedItem = testConstructorItems.ingredients.slice(-3)[0];
      const newState = constructorItemsReducer(
        initialState,
        moveUpConstructorItem(movedItem)
      );
      const expectedState = [...testConstructorItems.ingredients];
      expectedState.splice(-3, 1);
      expectedState.splice(1, 0, movedItem);
      expect(newState.constructorItems.ingredients).toEqual(expectedState);
    });
  });
});
