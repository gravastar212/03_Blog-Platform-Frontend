import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { BlogPost } from '../../models/blog-post';

@Component({
  selector: 'app-blog-card',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe
  ],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.scss'
})
export class BlogCard {
  post = input.required<BlogPost>();

  // Helper methods to handle both string and object types
  get authorName(): string {
    const author = this.post().author;
    return typeof author === 'string' ? author : author?.name || 'Unknown';
  }

  get authorAvatar(): string | undefined {
    const post = this.post();
    const author = post.author;
    if (post.authorAvatar) return post.authorAvatar;
    return typeof author === 'object' ? author?.avatar : undefined;
  }

  get categoryName(): string {
    const category = this.post().category;
    return typeof category === 'string' ? category : category?.name || '';
  }
}
