import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BlogCard } from '../../components/blog-card/blog-card';
import { BlogHttp } from '../../services/blog-http';
import { BlogPost } from '../../models/blog-post';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BlogCard
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  featuredPosts = signal<BlogPost[]>([]);
  loading = signal(true);

  constructor(private blogService: BlogHttp) {}

  ngOnInit() {
    this.loadFeaturedPosts();
  }

  loadFeaturedPosts() {
    this.loading.set(true);
    this.blogService.getFeaturedPosts().subscribe({
      next: (posts) => {
        this.featuredPosts.set(posts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading featured posts:', error);
        this.loading.set(false);
      }
    });
  }
}
