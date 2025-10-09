import { Injectable, signal } from '@angular/core';
import { BlogPost } from '../models/blog-post';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Blog {
  private mockPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Getting Started with Angular 20',
      slug: 'getting-started-with-angular-20',
      excerpt: 'Learn about the latest features in Angular 20 including zoneless change detection and improved signals.',
      content: `
        <h2>Introduction</h2>
        <p>Angular 20 brings exciting new features that make development faster and more intuitive. In this post, we'll explore the key improvements.</p>
        
        <h3>Zoneless Change Detection</h3>
        <p>One of the biggest changes is the ability to create zoneless applications, which improves performance significantly.</p>
        
        <h3>Enhanced Signals</h3>
        <p>Signals have been further improved with better TypeScript support and new APIs for reactive programming.</p>
        
        <h3>Conclusion</h3>
        <p>Angular 20 is a major step forward in making Angular development more efficient and enjoyable.</p>
      `,
      author: 'Sarah Johnson',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      tags: ['Angular', 'Web Development', 'TypeScript'],
      category: 'Frontend',
      publishedDate: new Date('2024-01-15'),
      readTime: 5,
      likes: 124,
      views: 1520,
      featured: true
    },
    {
      id: 2,
      title: 'Building RESTful APIs with NestJS',
      slug: 'building-restful-apis-with-nestjs',
      excerpt: 'A comprehensive guide to building scalable and maintainable REST APIs using NestJS framework.',
      content: `
        <h2>Why NestJS?</h2>
        <p>NestJS is a progressive Node.js framework that provides a robust architecture for building server-side applications.</p>
        
        <h3>Getting Started</h3>
        <p>First, install NestJS CLI and create a new project...</p>
        
        <h3>Creating Controllers</h3>
        <p>Controllers handle incoming requests and return responses to the client.</p>
        
        <h3>Services and Dependency Injection</h3>
        <p>NestJS uses a powerful dependency injection system that makes code more maintainable.</p>
      `,
      author: 'Michael Chen',
      authorAvatar: 'https://i.pravatar.cc/150?img=12',
      coverImage: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800',
      tags: ['NestJS', 'Backend', 'Node.js', 'REST API'],
      category: 'Backend',
      publishedDate: new Date('2024-01-20'),
      readTime: 8,
      likes: 89,
      views: 980,
      featured: true
    },
    {
      id: 3,
      title: 'Angular Material Design Best Practices',
      slug: 'angular-material-design-best-practices',
      excerpt: 'Tips and tricks for using Angular Material components effectively in your applications.',
      content: `
        <h2>Material Design Principles</h2>
        <p>Material Design is Google's design system that helps create beautiful and consistent user interfaces.</p>
        
        <h3>Component Selection</h3>
        <p>Choose the right Material components for your use case...</p>
        
        <h3>Theming</h3>
        <p>Customize your Material theme to match your brand identity.</p>
        
        <h3>Performance Tips</h3>
        <p>Optimize Material components for better performance.</p>
      `,
      author: 'Emily Rodriguez',
      authorAvatar: 'https://i.pravatar.cc/150?img=5',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      tags: ['Angular Material', 'UI/UX', 'Design'],
      category: 'Frontend',
      publishedDate: new Date('2024-01-25'),
      readTime: 6,
      likes: 156,
      views: 2100,
      featured: false
    },
    {
      id: 4,
      title: 'TypeScript Advanced Types Tutorial',
      slug: 'typescript-advanced-types-tutorial',
      excerpt: 'Master advanced TypeScript types including generics, conditional types, and mapped types.',
      content: `
        <h2>Introduction to Advanced Types</h2>
        <p>TypeScript's type system is incredibly powerful. Let's explore advanced concepts.</p>
        
        <h3>Generics</h3>
        <p>Generics allow you to write reusable code that works with multiple types.</p>
        
        <h3>Conditional Types</h3>
        <p>Create types that depend on conditions.</p>
        
        <h3>Mapped Types</h3>
        <p>Transform existing types into new ones.</p>
      `,
      author: 'David Kim',
      authorAvatar: 'https://i.pravatar.cc/150?img=8',
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      tags: ['TypeScript', 'Programming', 'JavaScript'],
      category: 'Programming',
      publishedDate: new Date('2024-02-01'),
      readTime: 10,
      likes: 201,
      views: 3450,
      featured: true
    },
    {
      id: 5,
      title: 'State Management with Signals',
      slug: 'state-management-with-signals',
      excerpt: 'Learn how to manage application state using Angular Signals for reactive programming.',
      content: `
        <h2>What are Signals?</h2>
        <p>Signals are Angular's new reactive primitive for managing state.</p>
        
        <h3>Creating Signals</h3>
        <p>Use the signal() function to create reactive values.</p>
        
        <h3>Computed Values</h3>
        <p>Derive new values from existing signals.</p>
        
        <h3>Effects</h3>
        <p>Run side effects when signals change.</p>
      `,
      author: 'Jessica Lee',
      authorAvatar: 'https://i.pravatar.cc/150?img=9',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      tags: ['Angular', 'Signals', 'State Management'],
      category: 'Frontend',
      publishedDate: new Date('2024-02-05'),
      readTime: 7,
      likes: 178,
      views: 2340,
      featured: false
    },
    {
      id: 6,
      title: 'Database Design Fundamentals',
      slug: 'database-design-fundamentals',
      excerpt: 'Essential principles for designing efficient and scalable database schemas.',
      content: `
        <h2>Database Design Principles</h2>
        <p>Good database design is crucial for application performance and maintainability.</p>
        
        <h3>Normalization</h3>
        <p>Learn about normal forms and when to normalize your data.</p>
        
        <h3>Relationships</h3>
        <p>Understand one-to-one, one-to-many, and many-to-many relationships.</p>
        
        <h3>Indexing</h3>
        <p>Optimize query performance with proper indexing strategies.</p>
      `,
      author: 'Robert Martinez',
      authorAvatar: 'https://i.pravatar.cc/150?img=13',
      coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      tags: ['Database', 'SQL', 'Backend'],
      category: 'Backend',
      publishedDate: new Date('2024-02-10'),
      readTime: 12,
      likes: 143,
      views: 1890,
      featured: false
    }
  ];

  // Signal for reactive state
  posts = signal<BlogPost[]>(this.mockPosts);

  // Get all posts
  getAllPosts(): Observable<BlogPost[]> {
    return of(this.posts()).pipe(delay(300)); // Simulate API delay
  }

  // Get featured posts
  getFeaturedPosts(): Observable<BlogPost[]> {
    const featured = this.posts().filter(post => post.featured);
    return of(featured).pipe(delay(300));
  }

  // Get post by ID
  getPostById(id: number): Observable<BlogPost | undefined> {
    const post = this.posts().find(p => p.id === id);
    return of(post).pipe(delay(300));
  }

  // Get post by slug
  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    const post = this.posts().find(p => p.slug === slug);
    return of(post).pipe(delay(300));
  }

  // Get posts by category
  getPostsByCategory(category: string): Observable<BlogPost[]> {
    const filtered = this.posts().filter(p => p.category === category);
    return of(filtered).pipe(delay(300));
  }

  // Get posts by tag
  getPostsByTag(tag: string): Observable<BlogPost[]> {
    const filtered = this.posts().filter(p => p.tags.includes(tag));
    return of(filtered).pipe(delay(300));
  }

  // Search posts
  searchPosts(query: string): Observable<BlogPost[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.posts().filter(p => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.excerpt.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    return of(results).pipe(delay(300));
  }

  // Create new post
  createPost(post: Omit<BlogPost, 'id'>): Observable<BlogPost> {
    const newPost: BlogPost = {
      ...post,
      id: Math.max(...this.posts().map(p => p.id)) + 1,
      publishedDate: new Date()
    };
    this.posts.update(posts => [...posts, newPost]);
    return of(newPost).pipe(delay(300));
  }

  // Update post
  updatePost(id: number, updates: Partial<BlogPost>): Observable<BlogPost | undefined> {
    const index = this.posts().findIndex(p => p.id === id);
    if (index === -1) {
      return of(undefined).pipe(delay(300));
    }
    
    const updatedPost = { 
      ...this.posts()[index], 
      ...updates,
      updatedDate: new Date()
    };
    
    this.posts.update(posts => [
      ...posts.slice(0, index),
      updatedPost,
      ...posts.slice(index + 1)
    ]);
    
    return of(updatedPost).pipe(delay(300));
  }

  // Delete post
  deletePost(id: number): Observable<boolean> {
    const initialLength = this.posts().length;
    this.posts.update(posts => posts.filter(p => p.id !== id));
    return of(this.posts().length < initialLength).pipe(delay(300));
  }

  // Increment likes
  likePost(id: number): Observable<BlogPost | undefined> {
    const post = this.posts().find(p => p.id === id);
    if (post) {
      return this.updatePost(id, { likes: post.likes + 1 });
    }
    return of(undefined);
  }

  // Increment views
  viewPost(id: number): Observable<BlogPost | undefined> {
    const post = this.posts().find(p => p.id === id);
    if (post) {
      return this.updatePost(id, { views: post.views + 1 });
    }
    return of(undefined);
  }

  // Get all unique categories
  getCategories(): string[] {
    return [...new Set(this.posts().map(p => p.category))];
  }

  // Get all unique tags
  getAllTags(): string[] {
    const allTags = this.posts().flatMap(p => p.tags);
    return [...new Set(allTags)];
  }
}
