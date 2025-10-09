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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  name = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  agreeToTerms = signal(false);
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  loading = signal(false);

  constructor(
    private router: Router,
    private authService: Auth,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (!this.name() || !this.email() || !this.password() || !this.confirmPassword()) {
      this.snackBar.open('Please fill in all fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.snackBar.open('Passwords do not match', 'Close', { duration: 3000 });
      return;
    }

    if (!this.agreeToTerms()) {
      this.snackBar.open('Please agree to the terms and conditions', 'Close', { duration: 3000 });
      return;
    }

    this.loading.set(true);
    
    this.authService.register({
      name: this.name(),
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.snackBar.open(`Welcome, ${response.user.name}! Please login.`, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.snackBar.open(err.message || 'Registration failed. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      }
    });
  }
}
