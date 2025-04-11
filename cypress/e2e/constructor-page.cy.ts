import tokens from '../fixtures/tokens.json';
import { setCookie, deleteCookie } from '../../src/utils/cookie';
import order from '../fixtures/order.json';

describe('Тестирование главной страницы', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.wait('@getIngredients');
  });

  it('добавление ингредиентов в конструктор', () => {
    cy.get(`[data-cy=${'643d69a5c3f7b9001cfa093c'}]`).find('button').click();
    cy.get('[data-cy="constructorItemBun"]')
      .find('span')
      .contains('Краторная булка N-200i')
      .should('exist');

    cy.get(`[data-cy=${'643d69a5c3f7b9001cfa093e'}]`).find('button').click();
    cy.get('[data-cy="constructorItemFilling"]')
      .find('span')
      .contains('Филе Люминесцентного тетраодонтимформа')
      .should('exist');

    cy.get(`[data-cy=${'643d69a5c3f7b9001cfa0942'}]`).find('button').click();
    cy.get('[data-cy="constructorItemFilling"]')
      .find('span')
      .contains('Соус Spicy-X')
      .should('exist');
  });

  describe('тестирование модального окна ингрединта', () => {
    beforeEach(() => {
      cy.get(`[data-cy=${'643d69a5c3f7b9001cfa093c'}]`).find('a').click();
      cy.get('[data-cy="modal"]').as('modal');
    });

    it('открытие модального окна', () => {
      cy.get('@modal').should('exist');
    });

    it('закрытие по клику на крестик', () => {
      cy.get('@modal').find('button').click();
      cy.get('@modal').should('not.exist');
    });

    it('закрытие по клику на оверлей', () => {
      cy.get('[data-cy="modalOverlay"]').click({ force: true });
      cy.get('@modal').should('not.exist');
    });
  });

  describe('тестирование создания заказа', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.wait('@getUser');
      setCookie('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    });

    afterEach(() => {
      localStorage.clear();
      deleteCookie('accessToken');
    });

    it('отправка заказа', () => {
      cy.get(`[data-cy=${'643d69a5c3f7b9001cfa093c'}]`).find('button').click();
      cy.get(`[data-cy=${'643d69a5c3f7b9001cfa093e'}]`).find('button').click();

      cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
        'getOrder'
      );
      cy.wait('@getOrder');

      cy.get('[data-cy="modal"]').as('modal');
      cy.get('@modal').should('exist');
      cy.get('@modal').find('h2').contains(order.order.number);

      cy.get('@modal').find('button').click();
      cy.get('@modal').should('not.exist');

      cy.get('[data-cy="constructorItemNoBun"]').should('exist');
      cy.get('[data-cy="constructorItemNoFillings"]').should('exist');
    });
  });
});
