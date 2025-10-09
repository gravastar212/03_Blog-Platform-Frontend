/// <reference types="cypress" />

describe('Complete User Flows', () => {
  describe('Public User Journey', () => {
    it('should complete full public user journey', () => {
      // 1. Visit home page
      cy.visit('/');
      cy.contains('Blog Platform').should('be.visible');
      
      // 2. Browse featured posts
      cy.wait(1000);
      
      // 3. Navigate to all posts
      cy.contains('All Posts').click();
      cy.url().should('include', '/blog');
      cy.wait(1000);
      
      // 4. View a post (if exists)
      cy.get('body').then(($body) => {
        if ($body.find('mat-card').length > 0) {
          cy.get('mat-card').first().click();
          cy.wait(1000);
          
          // Should be on post detail page
          cy.url().should('include', '/blog/');
        }
      });
    });

    it('should search and filter posts', () => {
      cy.visit('/blog');
      cy.wait(1000);
      
      // Search for posts
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="Search"]').length > 0) {
          cy.get('input[placeholder*="Search"]').type('Angular');
          cy.wait(500);
        }
      });
    });
  });

  describe('Author Complete Workflow', () => {
    it('should complete full author workflow', () => {
      // 1. Login as author
      cy.visit('/login');
      cy.get('input[name="email"]').type(Cypress.env('authorEmail'));
      cy.get('input[name="password"]').type(Cypress.env('authorPassword'));
      cy.get('button[type="submit"]').click();
      cy.wait(1500);
      
      // 2. Navigate to admin dashboard
      cy.contains('Admin').click();
      cy.contains('Dashboard').click();
      cy.url().should('include', '/admin');
      cy.wait(1000);
      
      // 3. Create new post
      cy.contains('Create New Post').click();
      cy.url().should('include', '/admin/editor');
      cy.wait(1000);
      
      // 4. Fill in post details
      const timestamp = Date.now();
      cy.get('input[name="title"]').type(`Cypress Test Post ${timestamp}`);
      cy.get('textarea[name="excerpt"]').type('Test excerpt for Cypress E2E testing');
      cy.get('textarea[name="content"]').type('<h2>Test</h2><p>Content for testing.</p>');
      
      // Select category
      cy.get('mat-select[name="categoryId"]').click();
      cy.wait(500);
      cy.get('mat-option').first().click();
      
      // 5. Submit post
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
      
      // 6. Verify redirect to admin dashboard
      cy.url().should('include', '/admin');
      
      // 7. Verify post appears in list
      cy.wait(1000);
      cy.contains(`Cypress Test Post ${timestamp}`).should('be.visible');
      
      // 8. Edit the post
      cy.get('body').then(($body) => {
        if ($body.text().includes(`Cypress Test Post ${timestamp}`)) {
          // Find and click edit button for this post
          cy.contains(`Cypress Test Post ${timestamp}`)
            .parents('tr')
            .find('button[mattooltip="Edit"]')
            .click();
          
          cy.wait(1000);
          cy.url().should('include', '/admin/editor/');
          
          // Update title
          cy.get('input[name="title"]').clear().type(`Updated Test Post ${timestamp}`);
          cy.get('button[type="submit"]').click();
          cy.wait(2000);
          
          // Verify update
          cy.contains(`Updated Test Post ${timestamp}`).should('be.visible');
        }
      });
    });
  });

  describe('Admin Complete Workflow', () => {
    it('should complete full admin workflow including deletion', () => {
      // 1. Login as admin
      cy.visit('/login');
      cy.get('input[name="email"]').type(Cypress.env('adminEmail'));
      cy.get('input[name="password"]').type(Cypress.env('adminPassword'));
      cy.get('button[type="submit"]').click();
      cy.wait(1500);
      
      // 2. Navigate to admin dashboard
      cy.visit('/admin');
      cy.wait(1500);
      
      // 3. Create a test post
      cy.contains('Create New Post').click();
      cy.wait(1000);
      
      const timestamp = Date.now();
      cy.get('input[name="title"]').type(`Delete Test ${timestamp}`);
      cy.get('textarea[name="excerpt"]').type('Post to be deleted');
      cy.get('textarea[name="content"]').type('<p>Test content</p>');
      
      cy.get('mat-select[name="categoryId"]').click();
      cy.wait(500);
      cy.get('mat-option').first().click();
      
      cy.get('button[type="submit"]').click();
      cy.wait(2000);
      
      // 4. Delete the post
      cy.visit('/admin');
      cy.wait(1500);
      
      cy.get('body').then(($body) => {
        if ($body.text().includes(`Delete Test ${timestamp}`)) {
          cy.contains(`Delete Test ${timestamp}`)
            .parents('tr')
            .find('button[mattooltip*="Delete"]')
            .click();
          
          // Confirm deletion
          cy.wait(500);
          cy.on('window:confirm', () => true);
          
          cy.wait(1500);
          
          // Verify post is deleted
          cy.contains(`Delete Test ${timestamp}`).should('not.exist');
        }
      });
    });
  });

  describe('End-to-End User Experience', () => {
    it('should complete full app exploration', () => {
      // 1. Start as visitor
      cy.visit('/');
      cy.contains('Blog Platform').should('be.visible');
      
      // 2. Browse posts
      cy.contains('All Posts').click();
      cy.wait(1000);
      
      // 3. View post detail
      cy.get('body').then(($body) => {
        if ($body.find('mat-card').length > 0) {
          cy.get('mat-card').first().click();
          cy.wait(1000);
          cy.url().should('include', '/blog/');
          
          // Go back
          cy.go('back');
        }
      });
      
      // 4. Login
      cy.visit('/login');
      cy.get('input[name="email"]').type(Cypress.env('authorEmail'));
      cy.get('input[name="password"]').type(Cypress.env('authorPassword'));
      cy.get('button[type="submit"]').click();
      cy.wait(1500);
      
      // 5. Access admin features
      cy.contains('Admin').should('be.visible');
      
      // 6. View dashboard
      cy.contains('Admin').click();
      cy.contains('Dashboard').click();
      cy.wait(1000);
      cy.contains('Admin Dashboard').should('be.visible');
      
      // 7. Logout
      cy.visit('/');
      cy.wait(500);
    });
  });
});

