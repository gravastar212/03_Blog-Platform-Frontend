import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogCard } from '../../components/blog-card/blog-card';
import { Blog } from '../../services/blog';
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

  constructor(private blogService: Blog) {}

  ngOnInit() {
    this.loadPosts();
    this.loadCategories();
  }

  loadPosts() {
    this.loading.set(true);
    this.blogService.getAllPosts().subscribe({
      next: (posts) => {
        this.allPosts.set(posts);
        this.filteredPosts.set(posts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading.set(false);
      }
    });
  }

  loadCategories() {
    this.categories.set(['all', ...this.blogService.getCategories()]);
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
      filtered = filtered.filter(post => post.category === this.selectedCategory());
    }

    // Filter by search query
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    this.filteredPosts.set(filtered);
  }
}
