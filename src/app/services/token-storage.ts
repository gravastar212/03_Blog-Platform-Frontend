import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Signal for reactive token state
  private tokenSignal = signal<string | null>(null);
  readonly token = this.tokenSignal.asReadonly();

  constructor() {
    // Initialize token signal only in browser
    if (this.isBrowser) {
      this.tokenSignal.set(this.getToken());
    }
  }

  /**
   * Save JWT token
   */
  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.tokenSignal.set(token);
    }
  }

  /**
   * Get JWT token
   */
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Remove JWT token
   */
  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      this.tokenSignal.set(null);
    }
  }

  /**
   * Save current user data
   */
  saveUser(user: any): void {
    if (this.isBrowser) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Get current user data
   */
  getUser(): any {
    if (this.isBrowser) {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  /**
   * Remove user data
   */
  removeUser(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Clear all auth data
   */
  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
