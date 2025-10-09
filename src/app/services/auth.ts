import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  // Reactive state using signals
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal for reactive components
  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(!!this.getToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
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
    if (environment.useMockData) {
      return this.mockLogin(credentials);
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    if (environment.useMockData) {
      return this.mockRegister(userData);
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<void> {
    if (environment.useMockData) {
      this.clearAuthData();
      this.router.navigate(['/login']);
      return of(undefined);
    }

    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/login']);
      }),
      catchError(() => {
        // Even if API call fails, clear local data
        this.clearAuthData();
        this.router.navigate(['/login']);
        return of(undefined);
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        this.logout().subscribe();
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<User> {
    if (environment.useMockData) {
      const user = this.getUserFromStorage();
      return of(user || {} as User);
    }

    return this.http.get<User>(`${this.API_URL}/profile`).pipe(
      tap(user => {
        this.saveUser(user);
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    if (environment.useMockData) {
      const currentUser = this.currentUser();
      const updatedUser = { ...currentUser, ...updates } as User;
      this.saveUser(updatedUser);
      this.currentUserSubject.next(updatedUser);
      return of(updatedUser);
    }

    return this.http.patch<User>(`${this.API_URL}/profile`, updates).pipe(
      tap(user => {
        this.saveUser(user);
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
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this.saveToken(response.token);
    if (response.refreshToken) {
      this.saveRefreshToken(response.refreshToken);
    }
    this.saveUser(response.user);
    this.currentUserSubject.next(response.user);
  }

  /**
   * Save token to storage
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Save refresh token to storage
   */
  private saveRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  /**
   * Save user to storage
   */
  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user from storage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Clear all auth data
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
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

  // ===== MOCK DATA METHODS (for development) =====

  /**
   * Mock login for development
   */
  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          const mockResponse: AuthResponse = {
            user: {
              id: 1,
              email: credentials.email,
              name: 'Demo User',
              role: 'admin',
              avatar: 'https://i.pravatar.cc/150?img=1'
            },
            token: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now()
          };
          observer.next(mockResponse);
          observer.complete();
        } else {
          observer.error(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }

  /**
   * Mock register for development
   */
  private mockRegister(userData: RegisterRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const mockResponse: AuthResponse = {
          user: {
            id: Date.now(),
            email: userData.email,
            name: userData.name,
            role: 'reader',
            avatar: 'https://i.pravatar.cc/150?img=5'
          },
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        };
        observer.next(mockResponse);
        observer.complete();
      }, 500);
    });
  }
}
