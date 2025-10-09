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
    MatDividerModule
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

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.name() || !this.email() || !this.password() || !this.confirmPassword()) {
      alert('Please fill in all fields');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      alert('Passwords do not match');
      return;
    }

    if (!this.agreeToTerms()) {
      alert('Please agree to the terms and conditions');
      return;
    }

    this.loading.set(true);
    
    // Simulate registration - replace with actual authentication service
    setTimeout(() => {
      this.loading.set(false);
      alert('Registration successful! (Demo only)');
      this.router.navigate(['/login']);
    }, 1000);
  }
}
