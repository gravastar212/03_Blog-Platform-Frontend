import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BlogHttp } from '../../services/blog-http';
import { BlogPost } from '../../models/blog-post';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-blog-editor',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './blog-editor.html',
  styleUrl: './blog-editor.scss'
})
export class BlogEditor implements OnInit {
  isEditMode = signal(false);
  postId = signal<number | null>(null);
  loading = signal(false);
  
  // Form fields
  title = signal('');
  slug = signal('');
  excerpt = signal('');
  content = signal('');
  author = signal('Anonymous');
  categoryId = signal<number | null>(null);
  tags = signal<string[]>([]);
  featured = signal(false);
  readTime = signal(5);
  coverImage = signal('');

  categories = signal<{ id: number; name: string; slug: string }[]>([]);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogHttp,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Load categories from backend as objects (with IDs)
    this.blogService.getCategoryObjects().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      }
    });
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode.set(true);
        this.postId.set(+id);
        this.loadPost(+id);
      }
    });
  }

  loadPost(id: number) {
    this.loading.set(true);
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        if (post) {
          this.title.set(post.title);
          this.slug.set(post.slug);
          this.excerpt.set(post.excerpt);
          this.content.set(post.content);
          // Handle author - can be object or string
          const authorName = typeof post.author === 'string' ? post.author : post.author?.name || '';
          this.author.set(authorName);
          // Handle category - can be object or string
          if (typeof post.category === 'object' && post.category?.id) {
            this.categoryId.set(post.category.id);
          } else {
            // If it's a string, try to find matching category ID
            const categoryName = typeof post.category === 'string' ? post.category : '';
            const foundCategory = this.categories().find(c => c.name === categoryName);
            if (foundCategory) {
              this.categoryId.set(foundCategory.id);
            }
          }
          this.tags.set([...post.tags]);
          this.featured.set(post.featured);
          this.readTime.set(post.readTime);
          this.coverImage.set(post.coverImage || '');
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/admin']);
      }
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.update(tags => [...tags, value]);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  generateSlug() {
    const slug = this.title()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.slug.set(slug);
  }

  onSubmit() {
    if (!this.title() || !this.excerpt() || !this.content() || !this.categoryId()) {
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    if (!this.slug()) {
      this.generateSlug();
    }

    this.loading.set(true);

    const postData = {
      title: this.title(),
      slug: this.slug(),
      excerpt: this.excerpt(),
      content: this.content(),
      categoryId: this.categoryId()!,
      tags: this.tags(),
      featured: this.featured(),
      readTime: this.readTime(),
      coverImage: this.coverImage() || undefined,
      published: true
    };

    if (this.isEditMode() && this.postId()) {
      this.blogService.updatePost(this.postId()!, postData).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('Post updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.loading.set(false);
          this.snackBar.open(err.message || 'Error updating post', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      this.blogService.createPost(postData).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('Post created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.loading.set(false);
          this.snackBar.open(err.message || 'Error creating post', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }
}
