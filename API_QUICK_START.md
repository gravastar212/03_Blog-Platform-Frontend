# API Services - Quick Start

## 🚀 **1-Minute Setup**

### **✅ Already Configured!**

All services are ready to use. HttpClient and interceptors are configured in `app.config.ts`.

---

## 📝 **Basic Usage**

### **Authentication**

```typescript
import { Component, inject } from '@angular/core';
import { Auth } from './services/auth';

export class LoginComponent {
  auth = inject(Auth);

  login() {
    this.auth.login({ email: 'user@example.com', password: '123' })
      .subscribe({
        next: (res) => console.log('Success!', res.user),
        error: (err) => console.error('Failed:', err.message)
      });
  }
}
```

### **Blog Posts**

```typescript
import { Component, inject, signal } from '@angular/core';
import { BlogHttp } from './services/blog-http';

export class BlogListComponent {
  blog = inject(BlogHttp);
  posts = signal([]);

  loadPosts() {
    this.blog.getAllPosts().subscribe({
      next: (posts) => this.posts.set(posts)
    });
  }
}
```

### **Loading State**

```typescript
import { Component, inject } from '@angular/core';
import { Loading } from './services/loading';

export class MyComponent {
  loading = inject(Loading);

  async doSomething() {
    this.loading.show();
    // ... do work ...
    this.loading.hide();
  }
}
```

---

## 🔐 **Protect Routes**

```typescript
// app.routes.ts
import { authGuard } from './guards/auth-guard';

export const routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]  // ← Add this
  }
];
```

---

## 🌐 **Environment Configuration**

### **Current Mode: Mock Data** ✓

```typescript
// src/environments/environment.development.ts
useMockData: true  // ← Change to false for real API
```

### **Switch to Real API:**

1. Set `useMockData: false`
2. Update `apiUrl: 'http://localhost:3000/api'`
3. Start your backend server
4. Refresh the app

---

## 📡 **API Endpoints (Backend)**

Your NestJS backend should implement:

```
/api/auth/login          POST   - Login
/api/auth/register       POST   - Register
/api/posts               GET    - All posts
/api/posts/:id           GET    - Single post
/api/posts               POST   - Create (auth required)
/api/posts/:id           PATCH  - Update (auth required)
/api/posts/:id           DELETE - Delete (auth required)
```

---

## 🛠️ **Built-in Features**

✅ **Auto Token Injection** - Auth tokens added automatically
✅ **Error Handling** - Centralized error messages
✅ **Auto Logout** - On 401 unauthorized
✅ **Loading States** - Global loading service
✅ **Type Safety** - Full TypeScript support
✅ **Mock Data** - Test without backend

---

## 🔍 **Check Service Status**

```typescript
// Check if using mock data
import { environment } from './environments/environment';
console.log('Using mock:', environment.useMockData);

// Check if authenticated
const auth = inject(Auth);
console.log('Authenticated:', auth.isAuthenticated());

// Check current user
console.log('User:', auth.currentUser());
```

---

## 📚 **Full Documentation**

See `SERVICES_API_GUIDE.md` for:
- Complete API reference
- Advanced usage examples
- Error handling patterns
- Best practices
- Migration guide

---

## ⚡ **Pro Tips**

1. **Use Signals** for reactive state (already implemented)
2. **Let interceptors handle** auth tokens and errors
3. **Use LoadingService** for better UX
4. **Toggle useMockData** for development vs. production
5. **Check console** for detailed error logs (dev mode only)

---

## 🎯 **Common Tasks**

| Task | Code |
|------|------|
| Login | `auth.login({email, password}).subscribe()` |
| Get posts | `blog.getAllPosts().subscribe()` |
| Create post | `blog.createPost(data).subscribe()` |
| Show loading | `loading.show()` |
| Hide loading | `loading.hide()` |
| Check auth | `auth.isAuthenticated()` |
| Get current user | `auth.currentUser()` |
| Logout | `auth.logout().subscribe()` |

---

**Ready to use! 🎉** Just inject the services and start making API calls.

