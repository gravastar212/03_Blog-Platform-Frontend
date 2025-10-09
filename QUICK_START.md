# Quick Start Guide - Blog Platform

## 🚀 Start the Application

```bash
cd blog-platform
ng serve
```

Open browser to: **http://localhost:4200**

---

## 🗺️ Navigation Map

```
┌─────────────────────────────────────────────────────────┐
│                    NAVBAR (Always Visible)              │
│  [Logo] [Home] [All Posts]  [Admin ▼] [Account ▼]     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      HOME PAGE (/)                      │
│  • Hero Section                                         │
│  • Featured Posts Grid                                  │
│  • Features Showcase                                    │
│  • CTA Section                                          │
│  Buttons: [Explore All Posts] [Join Us]                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  ALL POSTS (/blog)                      │
│  • Search Bar                                           │
│  • Category Filter                                      │
│  • Posts Grid with Cards                               │
│  • Each card → [Read More] → Blog Detail               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                BLOG DETAIL (/blog/:id)                  │
│  • Full Post Content                                    │
│  • Cover Image                                          │
│  • Author Info                                          │
│  • Tags                                                 │
│  Buttons: [Like] [Share] [Back to All Posts]           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    LOGIN (/login)                       │
│  • Email Field                                          │
│  • Password Field                                       │
│  • Remember Me                                          │
│  Buttons: [Sign In] [Create Account]                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  REGISTER (/register)                   │
│  • Full Name Field                                      │
│  • Email Field                                          │
│  • Password Fields                                      │
│  • Terms Checkbox                                       │
│  Buttons: [Create Account] [Sign In]                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD (/admin)                   │
│  • Stats Cards (Posts, Views, Likes, Featured)         │
│  • Posts Table                                          │
│  • Actions: View, Edit, Delete per post                │
│  Buttons: [Create New Post]                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              BLOG EDITOR (/admin/editor)                │
│  • Title, Slug, Author                                  │
│  • Category, Read Time                                  │
│  • Cover Image URL                                      │
│  • Excerpt, Content (HTML)                             │
│  • Tags (chip input)                                    │
│  • Featured Toggle                                      │
│  Buttons: [Cancel] [Publish/Update]                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    FOOTER (Always Visible)              │
│  • Quick Links  • Categories  • Social Media           │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

All components adapt automatically!

---

## 🎨 Material Components Quick Reference

### Buttons
```html
<button mat-button>Basic</button>
<button mat-raised-button color="primary">Primary</button>
<button mat-icon-button><mat-icon>home</mat-icon></button>
<button mat-fab color="accent"><mat-icon>add</mat-icon></button>
```

### Form Fields
```html
<mat-form-field appearance="outline">
  <mat-label>Label</mat-label>
  <input matInput [(ngModel)]="value">
  <mat-icon matPrefix>search</mat-icon>
</mat-form-field>
```

### Cards
```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Title</mat-card-title>
  </mat-card-header>
  <mat-card-content>Content</mat-card-content>
  <mat-card-actions>
    <button mat-button>ACTION</button>
  </mat-card-actions>
</mat-card>
```

---

## 🔧 Common Tasks

### Add a New Post (Manual)
1. Go to: http://localhost:4200/admin/editor
2. Fill in all fields
3. Click "Publish Post"
4. View in admin dashboard or blog list

### Search Posts
1. Go to: http://localhost:4200/blog
2. Use search bar at top
3. Type keywords (searches title, excerpt, tags)
4. Results update automatically

### Filter by Category
1. Go to: http://localhost:4200/blog
2. Use category dropdown
3. Select a category
4. See filtered results

### Edit a Post
1. Go to: http://localhost:4200/admin
2. Find post in table
3. Click edit icon
4. Modify fields
5. Click "Update Post"

### Delete a Post
1. Go to: http://localhost:4200/admin
2. Find post in table
3. Click delete icon
4. Confirm deletion

---

## 📊 Mock Data Available

**6 Sample Posts:**
1. Getting Started with Angular 20
2. Building RESTful APIs with NestJS
3. Angular Material Design Best Practices
4. TypeScript Advanced Types Tutorial
5. State Management with Signals
6. Database Design Fundamentals

**Categories:**
- Frontend
- Backend
- Programming

**Tags:**
- Angular, TypeScript, NestJS
- Web Development, Node.js
- REST API, Database, SQL
- UI/UX, Design, Signals
- State Management, Programming

---

## 🎯 Key Features to Test

### ✅ Home Page
- [ ] Hero section displays
- [ ] Featured posts load
- [ ] Feature cards show
- [ ] CTA buttons work

### ✅ Blog List
- [ ] All posts display
- [ ] Search works
- [ ] Category filter works
- [ ] Results count updates
- [ ] Cards are clickable

### ✅ Blog Detail
- [ ] Post content displays
- [ ] Like button works
- [ ] Share button works
- [ ] View count increments
- [ ] Back button navigates

### ✅ Authentication
- [ ] Login form displays
- [ ] Register form displays
- [ ] Password toggle works
- [ ] Form validation works
- [ ] Navigation between login/register works

### ✅ Admin Dashboard
- [ ] Stats cards show correct numbers
- [ ] Table displays all posts
- [ ] Edit button navigates to editor
- [ ] Delete button removes post
- [ ] View button opens post detail

### ✅ Blog Editor
- [ ] All form fields work
- [ ] Slug auto-generates
- [ ] Tags can be added/removed
- [ ] Featured toggle works
- [ ] Save creates/updates post
- [ ] Cancel returns to dashboard

---

## 🛠️ Development Commands

```bash
# Start dev server
ng serve

# Start with custom port
ng serve --port 4300

# Build for production
ng build

# Run tests
ng test

# Generate new component
ng generate component components/my-component

# Generate new service
ng generate service services/my-service

# Check for linting errors
ng lint
```

---

## 📝 Code Examples

### Using the Blog Service

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { Blog } from './services/blog';
import { BlogPost } from './models/blog-post';

export class MyComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  
  constructor(private blogService: Blog) {}
  
  ngOnInit() {
    // Get all posts
    this.blogService.getAllPosts().subscribe({
      next: (posts) => this.posts.set(posts)
    });
    
    // Get featured posts
    this.blogService.getFeaturedPosts().subscribe({
      next: (posts) => this.posts.set(posts)
    });
    
    // Search posts
    this.blogService.searchPosts('angular').subscribe({
      next: (posts) => this.posts.set(posts)
    });
  }
}
```

### Using Signals

```typescript
import { signal, computed } from '@angular/core';

// Create a signal
count = signal(0);

// Update signal
increment() {
  this.count.update(n => n + 1);
}

// Set signal
reset() {
  this.count.set(0);
}

// Read signal (in template or code)
value = this.count(); // Call like a function

// Computed signal
doubleCount = computed(() => this.count() * 2);
```

---

## 🎨 Customization Tips

### Change Primary Color
Edit `src/styles.scss`:
```scss
primary: mat.$indigo-palette,  // Try: red, pink, purple, blue, cyan, teal, green
```

### Modify Hero Background
Edit `src/app/pages/home/home.scss`:
```scss
.hero {
  background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
}
```

### Add New Mock Posts
Edit `src/app/services/blog.ts` → `mockPosts` array

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
ng serve --port 4300
```

### Module Not Found
```bash
npm install
```

### Changes Not Showing
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart ng serve

### Linting Errors
```bash
# Check errors
ng lint

# Auto-fix
ng lint --fix
```

---

## 🎓 Learning Resources

- **Angular Docs:** https://angular.dev
- **Material Components:** https://material.angular.dev/components
- **Material Icons:** https://fonts.google.com/icons
- **Signals Guide:** https://angular.dev/guide/signals
- **Routing Guide:** https://angular.dev/guide/routing

---

## 📞 Need Help?

Refer to:
1. `APPLICATION_STRUCTURE.md` - Complete documentation
2. `MATERIAL_USAGE_GUIDE.md` - Material components guide
3. Component source code - Well-commented

---

**Happy Coding! 🚀**

