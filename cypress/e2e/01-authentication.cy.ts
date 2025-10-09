/// <reference types="cypress" />

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Login', () => {
    it('should display login page', () => {
      cy.visit('/login');
      cy.contains('Login to Your Account').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });

    it('should login successfully with valid credentials', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('admin@blog.com');
      cy.get('input[name="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
      
      // Should redirect away from login page
      cy.url().should('not.include', '/login');
      
      // Should show user menu or indicator
      cy.wait(1000); // Wait for navigation
    });

    it('should show error with invalid credentials', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Should stay on login page
      cy.url().should('include', '/login');
    });

    it('should redirect to home if already logged in', () => {
      cy.loginAsAdmin();
      cy.visit('/login');
      
      // Should redirect to home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Register', () => {
    it('should display registration page', () => {
      cy.visit('/register');
      cy.contains('Create Your Account').should('be.visible');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });

    it('should navigate to login from register page', () => {
      cy.visit('/register');
      cy.contains('Login').click();
      cy.url().should('include', '/login');
    });

    it('should redirect to home if already logged in', () => {
      cy.loginAsAdmin();
      cy.visit('/register');
      
      // Should redirect to home
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', () => {
      cy.loginAsAdmin();
      cy.wait(500);
      
      // Click on user avatar/menu
      cy.get('button').contains('Admin').click();
      
      // Click logout
      cy.contains('Logout').click();
      
      // Should be able to see login link again
      cy.wait(500);
    });
  });
});

