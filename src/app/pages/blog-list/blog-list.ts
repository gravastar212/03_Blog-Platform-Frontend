import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogCard } from '../../components/blog-card/blog-card';
import { BlogHttp } from '../../services/blog-http';
import { BlogPost } from '../../models/blog-post';

@Component({
  selector: 'app-blog-list',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    BlogCard
  ],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss'
})
export class BlogList implements OnInit {
  allPosts = signal<BlogPost[]>([]);
  filteredPosts = signal<BlogPost[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  selectedCategory = signal('all');
  categories = signal<string[]>([]);

  constructor(private blogService: BlogHttp) {}

  ngOnInit() {
    this.loadPosts();
    this.loadCategories();
  }

  loadPosts() {
    this.loading.set(true);
    this.blogService.getAllPosts(1, 100).subscribe({
      next: (posts) => {
        console.log('Posts loaded from backend:', posts);
        this.allPosts.set(posts);
        this.filteredPosts.set(posts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading.set(false);
        // Set empty arrays on error
        this.allPosts.set([]);
        this.filteredPosts.set([]);
      }
    });
  }

  loadCategories() {
    this.blogService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(['all', ...cats]);
      }
    });
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.filterPosts();
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.filterPosts();
  }

  filterPosts() {
    let filtered = this.allPosts();

    // Filter by category
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(post => {
        // Check if category is an object or string
        const categoryName = typeof post.category === 'string' 
          ? post.category 
          : post.category?.name || '';
        return categoryName === this.selectedCategory();
      });
    }

    // Filter by search query
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    this.filteredPosts.set(filtered);
  }
}
