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
import { Blog } from '../../services/blog';
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
    MatTooltipModule
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
  category = signal('');
  tags = signal<string[]>([]);
  featured = signal(false);
  readTime = signal(5);
  coverImage = signal('');

  categories = signal<string[]>([]);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: Blog
  ) {}

  ngOnInit() {
    this.categories.set(this.blogService.getCategories());
    
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
          this.author.set(post.author);
          this.category.set(post.category);
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
    if (!this.title() || !this.excerpt() || !this.content() || !this.category()) {
      alert('Please fill in all required fields');
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
      author: this.author(),
      category: this.category(),
      tags: this.tags(),
      featured: this.featured(),
      readTime: this.readTime(),
      coverImage: this.coverImage(),
      publishedDate: new Date(),
      likes: 0,
      views: 0
    };

    if (this.isEditMode() && this.postId()) {
      this.blogService.updatePost(this.postId()!, postData).subscribe({
        next: () => {
          this.loading.set(false);
          alert('Post updated successfully!');
          this.router.navigate(['/admin']);
        },
        error: () => {
          this.loading.set(false);
          alert('Error updating post');
        }
      });
    } else {
      this.blogService.createPost(postData).subscribe({
        next: () => {
          this.loading.set(false);
          alert('Post created successfully!');
          this.router.navigate(['/admin']);
        },
        error: () => {
          this.loading.set(false);
          alert('Error creating post');
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }
}
