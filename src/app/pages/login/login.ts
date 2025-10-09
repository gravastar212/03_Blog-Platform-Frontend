import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  hidePassword = signal(true);
  loading = signal(false);

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.email() || !this.password()) {
      alert('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    
    // Simulate login - replace with actual authentication service
    setTimeout(() => {
      this.loading.set(false);
      alert('Login successful! (Demo only)');
      this.router.navigate(['/']);
    }, 1000);
  }
}
