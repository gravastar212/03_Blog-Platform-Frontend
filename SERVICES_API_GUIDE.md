# Services & API Integration Guide

## 🎯 Overview

This guide explains how to use the Angular services for API communication, including authentication, blog management, and error handling.

---

## 📁 Service Structure

```
src/app/
├── services/
│   ├── auth.ts           # Authentication service
│   ├── blog.ts           # Blog service (mock data)
│   ├── blog-http.ts      # Blog service (HTTP API)
│   └── loading.ts        # Global loading state
├── interceptors/
│   ├── auth-interceptor.ts   # Attach auth tokens
│   └── error-interceptor.ts  # Handle HTTP errors
├── guards/
│   └── auth-guard.ts     # Route protection
└── models/
    ├── user.ts           # User & Auth models
    └── blog-post.ts      # BlogPost model
```

---

## 🔐 Authentication Service

### **AuthService (`services/auth.ts`)**

Handles user authentication, registration, and token management.

### **Methods:**

```typescript
// Login
login(credentials: LoginRequest): Observable<AuthResponse>

// Register
register(userData: RegisterRequest): Observable<AuthResponse>

// Logout
logout(): Observable<void>

// Refresh token
refreshToken(): Observable<AuthResponse>

// Get current user
getCurrentUser(): Observable<User>

// Update profile
updateProfile(updates: Partial<User>): Observable<User>

// Role checks
hasRole(role: string): boolean
isAdmin(): boolean
isAuthenticated(): boolean

// Token management
getToken(): string | null
getRefreshToken(): string | null
```

### **Usage Example:**

```typescript
import { Component, inject } from '@angular/core';
import { Auth } from './services/auth';
import { LoginRequest } from './models/user';

export class LoginComponent {
  private authService = inject(Auth);
  
  login() {
    const credentials: LoginRequest = {
      email: 'user@example.com',
      password: 'password123'
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful!', response.user);
        // Navigate to dashboard
      },
      error: (error) => {
        console.error('Login failed:', error.message);
      }
    });
  }
}
```

### **Reactive State:**

```typescript
// Subscribe to current user
this.authService.currentUser$.subscribe(user => {
  console.log('Current user:', user);
});

// Or use signals (recommended)
const user = this.authService.currentUser();
const isAuth = this.authService.isAuthenticated();
```

---

## 📝 Blog Service (HTTP)

### **BlogHttpService (`services/blog-http.ts`)**

Handles all blog post operations with HTTP API calls.

### **Methods:**

```typescript
// Get all posts (with pagination)
getAllPosts(page?: number, limit?: number, filters?: any): Observable<BlogPost[]>

// Get featured posts
getFeaturedPosts(): Observable<BlogPost[]>

// Get single post
getPostById(id: number): Observable<BlogPost | undefined>
getPostBySlug(slug: string): Observable<BlogPost | undefined>

// Filter posts
getPostsByCategory(category: string): Observable<BlogPost[]>
getPostsByTag(tag: string): Observable<BlogPost[]>
searchPosts(query: string): Observable<BlogPost[]>

// CRUD operations (require auth)
createPost(post: Omit<BlogPost, 'id'>): Observable<BlogPost>
updatePost(id: number, updates: Partial<BlogPost>): Observable<BlogPost>
deletePost(id: number): Observable<boolean>

// Interactions
likePost(id: number): Observable<BlogPost>
viewPost(id: number): Observable<BlogPost>

// Metadata
getCategories(): Observable<string[]>
getAllTags(): Observable<string[]>
getPostStats(id: number): Observable<{views: number, likes: number}>
```

### **Usage Example:**

```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { BlogHttp } from './services/blog-http';
import { BlogPost } from './models/blog-post';

export class BlogListComponent implements OnInit {
  private blogService = inject(BlogHttp);
  posts = signal<BlogPost[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    
    this.blogService.getAllPosts(1, 10).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading.set(false);
      }
    });
  }

  searchPosts(query: string) {
    this.blogService.searchPosts(query).subscribe({
      next: (posts) => this.posts.set(posts),
      error: (error) => console.error('Search failed:', error)
    });
  }
}
```

---

## 🔄 Loading Service

### **LoadingService (`services/loading.ts`)**

Manages global loading state for the entire application.

### **Methods:**

```typescript
show(): void           // Show loading indicator
hide(): void           // Hide loading indicator
forceHide(): void      // Force hide (clears all)
isCurrentlyLoading(): boolean  // Check state
loading: Signal<boolean>       // Reactive signal
```

### **Usage Example:**

```typescript
import { Component, inject } from '@angular/core';
import { Loading } from './services/loading';

export class MyComponent {
  private loadingService = inject(Loading);
  
  // Access loading state
  isLoading = this.loadingService.loading;

  async loadData() {
    this.loadingService.show();
    
    try {
      // Fetch data...
      await this.fetchData();
    } finally {
      this.loadingService.hide();
    }
  }
}
```

### **Template Usage:**

```html
@if (loadingService.loading()) {
  <mat-spinner></mat-spinner>
  <p>Loading...</p>
}
```

---

## 🛡️ HTTP Interceptors

### **Auth Interceptor (`interceptors/auth-interceptor.ts`)**

Automatically attaches JWT tokens to API requests.

**Features:**
- Adds `Authorization: Bearer <token>` header
- Skips auth endpoints and mock data mode
- Reads token from AuthService

**No manual configuration needed!** - It's registered in `app.config.ts`

---

### **Error Interceptor (`interceptors/error-interceptor.ts`)**

Centralized error handling for all HTTP requests.

**Features:**
- Handles all HTTP error codes (400, 401, 403, 404, 500, etc.)
- Auto-logout on 401 (unauthorized)
- User-friendly error messages
- Logs errors in development mode
- Hides loading indicator on error

**Error Codes Handled:**
- `0` - Network error
- `400` - Bad request
- `401` - Unauthorized (auto-logout)
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict
- `422` - Validation error
- `500` - Server error
- `503` - Service unavailable

---

## 🔒 Route Guards

### **Auth Guard (`guards/auth-guard.ts`)**

Protects routes that require authentication.

### **Usage:**

```typescript
// In app.routes.ts
import { authGuard, adminGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard, adminGuard]  // Requires auth + admin role
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]  // Requires auth only
  }
];
```

**Features:**
- Redirects to `/login` if not authenticated
- Stores return URL for post-login redirect
- `adminGuard` checks for admin role

---

## 🌐 Environment Configuration

### **Development (`environments/environment.development.ts`)**

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',  // Your NestJS backend
  apiVersion: 'v1',
  useMockData: true,    // Use mock data during development
  enableLogging: true   // Enable console logging
};
```

### **Production (`environments/environment.ts`)**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourblogplatform.com/api',
  apiVersion: 'v1',
  useMockData: false,   // Use real API
  enableLogging: false  // Disable console logging
};
```

### **Toggle Mock/Real Data:**

```typescript
// In any service or component
import { environment } from '../environments/environment';

if (environment.useMockData) {
  // Use mock data
} else {
  // Use real API
}
```

---

## 📡 API Endpoints Expected

Your NestJS backend should implement these endpoints:

### **Authentication:**
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
POST   /api/auth/refresh         - Refresh access token
GET    /api/auth/profile         - Get current user
PATCH  /api/auth/profile         - Update user profile
```

### **Blog Posts:**
```
GET    /api/posts                - Get all posts (paginated)
GET    /api/posts/featured       - Get featured posts
GET    /api/posts/search?q=      - Search posts
GET    /api/posts/:id            - Get post by ID
GET    /api/posts/slug/:slug     - Get post by slug
GET    /api/posts/categories     - Get all categories
GET    /api/posts/tags           - Get all tags
POST   /api/posts                - Create new post (auth required)
PATCH  /api/posts/:id            - Update post (auth required)
DELETE /api/posts/:id            - Delete post (auth required)
POST   /api/posts/:id/like       - Like post
POST   /api/posts/:id/view       - Increment view count
GET    /api/posts/:id/stats      - Get post statistics
```

### **Query Parameters:**
```
?page=1&limit=10          - Pagination
?category=Frontend        - Filter by category
?tag=Angular              - Filter by tag
?q=search+term           - Search query
```

---

## 🔧 Complete Component Example

### **Blog List Component with Services:**

```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { BlogHttp } from '../services/blog-http';
import { Loading } from '../services/loading';
import { BlogPost } from '../models/blog-post';

@Component({
  selector: 'app-blog-list',
  template: `
    @if (loadingService.loading()) {
      <mat-spinner></mat-spinner>
    }

    @if (error()) {
      <mat-error>{{ error() }}</mat-error>
    }

    <div class="posts-grid">
      @for (post of posts(); track post.id) {
        <app-blog-card [post]="post" />
      }
    </div>
  `
})
export class BlogListComponent implements OnInit {
  private blogService = inject(BlogHttp);
  loadingService = inject(Loading);

  posts = signal<BlogPost[]>([]);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loadingService.show();

    this.blogService.getAllPosts(1, 10).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.error.set(null);
        this.loadingService.hide();
      },
      error: (err) => {
        this.error.set(err.message);
        this.loadingService.hide();
      }
    });
  }
}
```

---

## ✅ Best Practices

### **1. Use Signals for Reactive State:**
```typescript
// Good ✅
posts = signal<BlogPost[]>([]);
loading = signal(false);

// Less optimal
posts: BlogPost[] = [];
loading = false;
```

### **2. Handle Errors Gracefully:**
```typescript
this.service.getData().subscribe({
  next: (data) => this.data.set(data),
  error: (error) => {
    console.error('Error:', error.message);
    this.showErrorNotification(error.message);
  }
});
```

### **3. Always Clean Up Subscriptions:**
```typescript
// Use takeUntilDestroyed() or async pipe
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => ...);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### **4. Use Loading Service for Better UX:**
```typescript
async performAction() {
  this.loadingService.show();
  try {
    await this.doSomething();
  } finally {
    this.loadingService.hide();
  }
}
```

### **5. Leverage Interceptors:**
- ✅ Interceptors handle auth tokens automatically
- ✅ Interceptors handle errors centrally
- ✅ No need to manually add headers or catch errors everywhere

---

## 🚀 Migration from Mock to Real API

### **Step 1: Update Environment**
```typescript
// environment.development.ts
useMockData: false  // Switch to real API
```

### **Step 2: Ensure Backend is Running**
```bash
# Start your NestJS backend
cd backend
npm run start:dev
```

### **Step 3: Update API URL**
```typescript
// environment.development.ts
apiUrl: 'http://localhost:3000/api'
```

### **Step 4: Test API Endpoints**
- Test login/register
- Test blog CRUD operations
- Check error handling

### **Step 5: Handle API Differences**
If your API response structure differs, update the models and services accordingly.

---

## 📊 Service Dependency Graph

```
Components
    ↓
Services (Auth, BlogHttp, Loading)
    ↓
HTTP Interceptors (Auth, Error)
    ↓
Angular HttpClient
    ↓
Backend API (NestJS)
```

---

## 🎯 Quick Reference

| Task | Service | Method |
|------|---------|--------|
| Login user | `Auth` | `login(credentials)` |
| Get all posts | `BlogHttp` | `getAllPosts()` |
| Create post | `BlogHttp` | `createPost(post)` |
| Show loading | `Loading` | `show()` |
| Protect route | `Guard` | `canActivate: [authGuard]` |
| Check if admin | `Auth` | `isAdmin()` |

---

**Happy Coding! 🚀**

All services are configured and ready to use. Simply inject them into your components and start making API calls!

