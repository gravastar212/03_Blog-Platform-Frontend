import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { environment } from '../../environments/environment';

/**
 * HTTP Interceptor to attach authentication token to requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  // Skip token injection for auth endpoints or when using mock data
  if (environment.useMockData || req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Clone request and add authorization header if token exists
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
