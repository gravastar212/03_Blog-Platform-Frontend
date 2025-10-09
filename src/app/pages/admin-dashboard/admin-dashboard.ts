import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Blog } from '../../services/blog';
import { BlogPost } from '../../models/blog-post';

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
    MatTooltipModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  posts = signal<BlogPost[]>([]);
  displayedColumns = ['title', 'category', 'date', 'stats', 'actions'];
  
  stats = signal({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    featuredPosts: 0
  });

  constructor(private blogService: Blog) {}

  ngOnInit() {
    this.loadPosts();
    this.calculateStats();
  }

  loadPosts() {
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.calculateStats();
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

  deletePost(id: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(id).subscribe({
        next: () => {
          this.loadPosts();
        }
      });
    }
  }
}
