import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BlogHttp } from '../../services/blog-http';
import { BlogPost, Author, Category } from '../../models/blog-post';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  posts = signal<BlogPost[]>([]);
  displayedColumns = ['title', 'category', 'date', 'stats', 'actions'];
  loading = signal(false);
  
  stats = signal({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    featuredPosts: 0
  });

  constructor(
    private blogService: BlogHttp,
    private snackBar: MatSnackBar,
    public authService: Auth
  ) {}

  get isAdmin() {
    return this.authService.isAdmin();
  }

  ngOnInit() {
    this.loadPosts();
    this.calculateStats();
  }

  loadPosts() {
    this.loading.set(true);
    // Load all posts (increase limit to get all posts)
    this.blogService.getAllPosts(1, 100).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.calculateStats();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.snackBar.open('Error loading posts', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading.set(false);
      }
    });
  }

  calculateStats() {
    const posts = this.posts();
    this.stats.set({
      totalPosts: posts.length,
      totalViews: posts.reduce((sum, p) => sum + p.views, 0),
      totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
      featuredPosts: posts.filter(p => p.featured).length
    });
  }

  getCategoryName(category: string | Category): string {
    return typeof category === 'string' ? category : category?.name || 'Unknown';
  }

  deletePost(id: number) {
    // Check if user is admin
    if (!this.isAdmin) {
      this.snackBar.open('Only administrators can delete posts', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      this.loading.set(true);
      this.blogService.deletePost(id).subscribe({
        next: () => {
          this.snackBar.open('Post deleted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.loadPosts();
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Delete error:', error);
          
          // Better error message handling
          let errorMessage = 'Error deleting post';
          if (error.status === 403) {
            errorMessage = 'You do not have permission to delete posts. Admin access required.';
          } else if (error.status === 404) {
            errorMessage = 'Post not found';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
