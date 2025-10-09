import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  menuItems = [
    { label: 'Home', route: '/', icon: 'home' },
    { label: 'All Posts', route: '/blog', icon: 'article' },
  ];

  authItems = [
    { label: 'Login', route: '/login', icon: 'login' },
    { label: 'Register', route: '/register', icon: 'person_add' },
  ];

  adminItems = [
    { label: 'Dashboard', route: '/admin', icon: 'dashboard' },
    { label: 'New Post', route: '/admin/editor', icon: 'add_circle' },
  ];
}
