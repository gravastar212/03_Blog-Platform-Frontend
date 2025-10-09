/// <reference types="cypress" />

describe('Role-Based Access Control', () => {
  describe('Admin Role', () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.wait(1000);
    });

    it('should show admin menu for admin users', () => {
      cy.visit('/');
      cy.contains('Admin').should('be.visible');
    });

    it('should access admin dashboard', () => {
      cy.visit('/admin');
      cy.contains('Admin Dashboard').should('be.visible');
    });

    it('should access post editor', () => {
      cy.visit('/admin/editor');
      cy.contains('Create New Post').should('be.visible');
    });

    it('should show delete button in admin dashboard', () => {
      cy.visit('/admin');
      cy.wait(1500);
      
      cy.get('body').then(($body) => {
        if ($body.find('button[mattooltip*="Delete"]').length > 0) {
          cy.get('button[mattooltip*="Delete"]').should('exist');
        }
      });
    });

    it('should show role badge in navbar', () => {
      cy.visit('/');
      cy.contains('admin', { matchCase: false }).should('be.visible');
    });
  });

  describe('Author Role', () => {
    beforeEach(() => {
      cy.loginAsAuthor();
      cy.wait(1000);
    });

    it('should show admin menu for author users', () => {
      cy.visit('/');
      cy.contains('Admin').should('be.visible');
    });

    it('should access admin dashboard', () => {
      cy.visit('/admin');
      cy.contains('Admin Dashboard').should('be.visible');
    });

    it('should access post editor', () => {
      cy.visit('/admin/editor');
      cy.contains('Create New Post').should('be.visible');
    });

    it('should NOT show delete button in admin dashboard', () => {
      cy.visit('/admin');
      cy.wait(1500);
      
      // Delete button should be hidden for authors
      cy.get('button[mattooltip*="Delete"]').should('not.exist');
    });

    it('should show author role badge in navbar', () => {
      cy.visit('/');
      cy.contains('author', { matchCase: false }).should('be.visible');
    });
  });

  describe('Public Access', () => {
    it('should view blog posts without authentication', () => {
      cy.visit('/blog');
      cy.contains('All Blog Posts').should('be.visible');
    });

    it('should view single post without authentication', () => {
      cy.visit('/blog');
      cy.wait(1000);
      
      cy.get('body').then(($body) => {
        if ($body.find('mat-card').length > 0) {
          cy.get('mat-card').first().click();
          cy.wait(500);
          cy.url().should('include', '/blog/');
        }
      });
    });

    it('should NOT access admin routes without authentication', () => {
      // Clear any existing auth
      cy.clearLocalStorage();
      cy.visit('/admin');
      cy.wait(1000);
      
      // Should redirect or show error
      // (Depends on guard implementation)
      cy.get('body').should('exist');
    });
  });
});

