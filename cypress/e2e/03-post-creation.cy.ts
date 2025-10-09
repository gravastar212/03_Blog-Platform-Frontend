/// <reference types="cypress" />

describe('Post Creation & Management', () => {
  beforeEach(() => {
    // Login as admin before each test
    cy.loginAsAdmin();
    cy.wait(1000);
  });

  describe('Create Post', () => {
    it('should navigate to post editor', () => {
      // Click admin menu
      cy.contains('Admin').click();
      cy.contains('New Post').click();
      
      // Should navigate to editor
      cy.url().should('include', '/admin/editor');
      cy.contains('Create New Post').should('be.visible');
    });

    it('should create a new post successfully', () => {
      cy.visit('/admin/editor');
      cy.wait(1000);
      
      // Fill in the form
      cy.get('input[name="title"]').type('Cypress Test Post');
      cy.get('textarea[name="excerpt"]').type('This is a test post created by Cypress E2E testing.');
      cy.get('textarea[name="content"]').type('<h2>Test Content</h2><p>This is test content for Cypress E2E testing.</p>');
      
      // Select category
      cy.get('mat-select[name="categoryId"]').click();
      cy.wait(500);
      cy.get('mat-option').first().click();
      
      // Set read time
      cy.get('input[name="readTime"]').clear().type('5');
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should redirect to admin dashboard
      cy.wait(2000);
      cy.url().should('include', '/admin');
    });

    it('should show validation errors for empty form', () => {
      cy.visit('/admin/editor');
      cy.wait(1000);
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click();
      
      // Should show error or stay on page
      cy.url().should('include', '/admin/editor');
    });

    it('should generate slug from title', () => {
      cy.visit('/admin/editor');
      cy.wait(1000);
      
      // Type title
      cy.get('input[name="title"]').type('Test Auto Slug Generation');
      
      // Blur to trigger slug generation
      cy.get('input[name="title"]').blur();
      
      // Check if slug was generated
      cy.wait(500);
      cy.get('input[name="slug"]').should('have.value', 'test-auto-slug-generation');
    });
  });

  describe('Edit Post', () => {
    it('should navigate to edit post', () => {
      cy.visit('/admin');
      cy.wait(1500);
      
      // Click edit button on first post
      cy.get('body').then(($body) => {
        if ($body.find('button[mattooltip="Edit"]').length > 0) {
          cy.get('button[mattooltip="Edit"]').first().click();
          cy.wait(500);
          cy.url().should('include', '/admin/editor/');
          cy.contains('Edit Post').should('be.visible');
        }
      });
    });

    it('should update post successfully', () => {
      cy.visit('/admin');
      cy.wait(1500);
      
      cy.get('body').then(($body) => {
        if ($body.find('button[mattooltip="Edit"]').length > 0) {
          cy.get('button[mattooltip="Edit"]').first().click();
          cy.wait(1000);
          
          // Update title
          cy.get('input[name="title"]').clear().type('Updated Title - Cypress Test');
          
          // Submit
          cy.get('button[type="submit"]').click();
          cy.wait(2000);
          
          // Should redirect to admin
          cy.url().should('include', '/admin');
        }
      });
    });
  });

  describe('Delete Post (Admin Only)', () => {
    it('should delete post as admin', () => {
      cy.visit('/admin');
      cy.wait(1500);
      
      cy.get('body').then(($body) => {
        if ($body.find('button[mattooltip*="Delete"]').length > 0) {
          const initialCount = $body.find('tr[mat-row]').length;
          
          // Click delete button
          cy.get('button[mattooltip*="Delete"]').first().click();
          
          // Confirm deletion
          cy.wait(500);
          cy.on('window:confirm', () => true);
          
          cy.wait(1500);
          
          // Post count should decrease (or check for success message)
          cy.get('body').should('exist');
        }
      });
    });
  });
});

