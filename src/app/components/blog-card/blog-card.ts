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
}
