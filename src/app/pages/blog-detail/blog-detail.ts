import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Blog } from '../../services/blog';
import { BlogPost } from '../../models/blog-post';

@Component({
  selector: 'app-blog-detail',
  imports: [
    RouterLink,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss'
})
export class BlogDetail implements OnInit {
  post = signal<BlogPost | undefined>(undefined);
  loading = signal(true);
  liked = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: Blog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadPost(id);
      }
    });
  }

  loadPost(id: number) {
    this.loading.set(true);
    this.blogService.getPostById(id).subscribe({
      next: (post) => {
        if (post) {
          this.post.set(post);
          this.blogService.viewPost(id).subscribe(); // Increment view count
        } else {
          this.router.navigate(['/blog']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.loading.set(false);
        this.router.navigate(['/blog']);
      }
    });
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(1, html) || '';
  }

  toggleLike() {
    if (!this.post()) return;
    
    if (!this.liked()) {
      this.blogService.likePost(this.post()!.id).subscribe({
        next: (updatedPost) => {
          if (updatedPost) {
            this.post.set(updatedPost);
            this.liked.set(true);
          }
        }
      });
    }
  }

  sharePost() {
    if (navigator.share && this.post()) {
      navigator.share({
        title: this.post()!.title,
        text: this.post()!.excerpt,
        url: window.location.href
      }).catch(() => {
        // Fallback: copy to clipboard
        this.copyToClipboard(window.location.href);
      });
    } else {
      this.copyToClipboard(window.location.href);
    }
  }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}
