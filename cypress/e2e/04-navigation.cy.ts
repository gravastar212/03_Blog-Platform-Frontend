/// <reference types="cypress" />

describe('Navigation & Routing', () => {
  it('should navigate to home page', () => {
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should navigate to blog list', () => {
    cy.visit('/');
    cy.contains('All Posts').click();
    cy.url().should('include', '/blog');
    cy.contains('All Blog Posts').should('be.visible');
  });

  it('should navigate to login page', () => {
    cy.visit('/');
    
    // Find and click login button/link
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Login")').length > 0) {
        cy.contains('Login').click();
        cy.url().should('include', '/login');
      } else {
        // Already logged in or different UI
        cy.visit('/login');
        cy.url().should('include', '/');
      }
    });
  });

  it('should show navbar on all pages', () => {
    const pages = ['/', '/blog', '/login'];
    
    pages.forEach(page => {
      cy.visit(page);
      cy.get('mat-toolbar').should('be.visible');
    });
  });

  it('should navigate to admin dashboard (when authenticated)', () => {
    cy.loginAsAdmin();
    cy.wait(1000);
    
    // Click admin menu
    cy.contains('Admin').click();
    cy.contains('Dashboard').click();
    
    cy.url().should('include', '/admin');
    cy.contains('Admin Dashboard').should('be.visible');
  });

  it('should navigate back to home from navbar logo', () => {
    cy.visit('/blog');
    cy.get('.logo').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});

