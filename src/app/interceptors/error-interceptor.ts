import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';
import { Loading } from '../services/loading';
import { environment } from '../../environments/environment';

/**
 * HTTP Interceptor for centralized error handling
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(Auth);
  const loadingService = inject(Loading);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      // Hide loading indicator on error
      loadingService.hide();

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Network error. Please check your connection.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            // Clear auth data and redirect to login
            authService.logout().subscribe(() => {
              router.navigate(['/login']);
            });
            break;
          case 403:
            errorMessage = 'Access forbidden. You don\'t have permission.';
            break;
          case 404:
            errorMessage = error.error?.message || 'Resource not found.';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict. Resource already exists.';
            break;
          case 422:
            errorMessage = error.error?.message || 'Validation error. Please check your input.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Log errors in development
      if (environment.enableLogging) {
        console.error('HTTP Error:', {
          url: req.url,
          method: req.method,
          status: error.status,
          message: errorMessage,
          error
        });
      }

      // Show user-friendly error (you can replace with a notification service)
      if (!environment.useMockData) {
        console.error('Error:', errorMessage);
        // TODO: Integrate with notification service
        // this.notificationService.error(errorMessage);
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
