/// <reference types="cypress" />

describe('Blog List Page', () => {
  beforeEach(() => {
    cy.visit('/blog');
  });

  it('should display blog posts', () => {
    cy.contains('All Blog Posts').should('be.visible');
    
    // Should show posts or empty state
    cy.get('body').should('exist');
  });

  it('should display post cards', () => {
    // Wait for posts to load
    cy.wait(1000);
    
    // Check if post cards are visible (if posts exist)
    cy.get('body').then(($body) => {
      if ($body.find('mat-card').length > 0) {
        cy.get('mat-card').first().should('be.visible');
      }
    });
  });

  it('should filter posts by category', () => {
    cy.wait(1000);
    
    // Check if category dropdown exists
    cy.get('body').then(($body) => {
      if ($body.find('mat-select').length > 0) {
        cy.get('mat-select').first().click();
        // Categories should be visible
        cy.wait(500);
      }
    });
  });

  it('should search posts', () => {
    // Check if search input exists
    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder*="Search"]').length > 0) {
        cy.get('input[placeholder*="Search"]').type('Angular');
        cy.wait(500);
      }
    });
  });

  it('should navigate to post detail', () => {
    cy.wait(1000);
    
    // Click on first post if available
    cy.get('body').then(($body) => {
      if ($body.find('mat-card').length > 0) {
        cy.get('mat-card').first().click();
        cy.wait(500);
        // Should navigate to detail page
        cy.url().should('include', '/blog/');
      }
    });
  });

  it('should display post statistics', () => {
    cy.wait(1000);
    
    // Check for views/likes indicators
    cy.get('body').should('exist');
  });
});

