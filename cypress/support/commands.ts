/// <reference types="cypress" />

// ***********************************************
// Custom commands for Cypress E2E tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('admin@blog.com', 'admin123')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to login as admin
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>;
      
      /**
       * Custom command to login as author
       * @example cy.loginAsAuthor()
       */
      loginAsAuthor(): Chainable<void>;
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').clear().type(email);
  cy.get('input[name="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login(Cypress.env('adminEmail'), Cypress.env('adminPassword'));
});

// Login as author
Cypress.Commands.add('loginAsAuthor', () => {
  cy.login(Cypress.env('authorEmail'), Cypress.env('authorPassword'));
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"]').click();
  cy.contains('Logout').click();
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

export {};

