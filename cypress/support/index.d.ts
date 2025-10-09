/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login with email and password
     * @example cy.login('admin@blog.com', 'admin123')
     */
    login(email: string, password: string): Chainable<void>;

    /**
     * Custom command to login as admin user
     * @example cy.loginAsAdmin()
     */
    loginAsAdmin(): Chainable<void>;

    /**
     * Custom command to login as author user
     * @example cy.loginAsAuthor()
     */
    loginAsAuthor(): Chainable<void>;

    /**
     * Custom command to logout current user
     * @example cy.logout()
     */
    logout(): Chainable<void>;
  }
}

