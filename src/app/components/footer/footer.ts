import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { icon: 'facebook', url: 'https://facebook.com', label: 'Facebook' },
    { icon: 'code', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'email', url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'camera_alt', url: 'https://instagram.com', label: 'Instagram' }
  ];
}
