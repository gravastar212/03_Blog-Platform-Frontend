import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user';
import { TokenStorage } from './token-storage';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  // Reactive state using signals
  private currentUserSubject!: BehaviorSubject<User | null>;
  public currentUser$!: Observable<User | null>;
  
  // Signal for reactive components
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorage
  ) {
    // Initialize after tokenStorage is available
    this.currentUserSubject = new BehaviorSubject<User | null>(this.tokenStorage.getUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.currentUser.set(this.tokenStorage.getUser());
    this.isAuthenticated.set(this.tokenStorage.isAuthenticated());
    
    // Sync signal with BehaviorSubject
    this.currentUser$.subscribe(user => {
      this.currentUser.set(user);
      this.isAuthenticated.set(!!user);
    });
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`).pipe(
      tap(user => {
        this.tokenStorage.saveUser(user);
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/profile`, updates).pipe(
      tap(user => {
        this.tokenStorage.saveUser(user);
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.tokenStorage.saveToken(response.token);
    this.tokenStorage.saveUser(response.user);
    this.currentUserSubject.next(response.user);
  }

  /**
   * Clear all auth data
   */
  private clearAuthData(): void {
    this.tokenStorage.clear();
    this.currentUserSubject.next(null);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    if (environment.enableLogging) {
      console.error('Auth Error:', errorMessage);
    }

    return throwError(() => new Error(errorMessage));
  }
}
