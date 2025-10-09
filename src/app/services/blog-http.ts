import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BlogPost } from '../models/blog-post';
import { Blog } from './blog'; // Import mock service for fallback

@Injectable({
  providedIn: 'root'
})
export class BlogHttp {
  private readonly API_URL = `${environment.apiUrl}/posts`;
  
  // Use mock service when in development mode with mock data
  private useMockService = environment.useMockData;

  constructor(
    private http: HttpClient,
    private mockService: Blog  // Inject mock service for development
  ) {}

  /**
   * Get all blog posts with optional pagination and filters
   */
  getAllPosts(page: number = 1, limit: number = 10, filters?: any): Observable<BlogPost[]> {
    if (this.useMockService) {
      return this.mockService.getAllPosts();
    }

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<BlogPost[]>(this.API_URL, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get featured posts
   */
  getFeaturedPosts(): Observable<BlogPost[]> {
    if (this.useMockService) {
      return this.mockService.getFeaturedPosts();
    }

    return this.http.get<BlogPost[]>(`${this.API_URL}/featured`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get single post by ID
   */
  getPostById(id: number): Observable<BlogPost | undefined> {
    if (this.useMockService) {
      return this.mockService.getPostById(id);
    }

    return this.http.get<BlogPost>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return throwError(() => new Error('Post not found'));
        }
        return this.handleError(error);
      })
    );
  }

  /**
   * Get post by slug
   */
  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    if (this.useMockService) {
      return this.mockService.getPostBySlug(slug);
    }

    return this.http.get<BlogPost>(`${this.API_URL}/slug/${slug}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get posts by category
   */
  getPostsByCategory(category: string): Observable<BlogPost[]> {
    if (this.useMockService) {
      return this.mockService.getPostsByCategory(category);
    }

    const params = new HttpParams().set('category', category);
    return this.http.get<BlogPost[]>(this.API_URL, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get posts by tag
   */
  getPostsByTag(tag: string): Observable<BlogPost[]> {
    if (this.useMockService) {
      return this.mockService.getPostsByTag(tag);
    }

    const params = new HttpParams().set('tag', tag);
    return this.http.get<BlogPost[]>(this.API_URL, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Search posts
   */
  searchPosts(query: string): Observable<BlogPost[]> {
    if (this.useMockService) {
      return this.mockService.searchPosts(query);
    }

    const params = new HttpParams().set('q', query);
    return this.http.get<BlogPost[]>(`${this.API_URL}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create new post (requires authentication)
   */
  createPost(post: Omit<BlogPost, 'id'>): Observable<BlogPost> {
    if (this.useMockService) {
      return this.mockService.createPost(post);
    }

    return this.http.post<BlogPost>(this.API_URL, post).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update existing post (requires authentication)
   */
  updatePost(id: number, updates: Partial<BlogPost>): Observable<BlogPost | undefined> {
    if (this.useMockService) {
      return this.mockService.updatePost(id, updates);
    }

    return this.http.patch<BlogPost>(`${this.API_URL}/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete post (requires authentication)
   */
  deletePost(id: number): Observable<boolean> {
    if (this.useMockService) {
      return this.mockService.deletePost(id);
    }

    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Delete error:', error);
        return throwError(() => false);
      })
    );
  }

  /**
   * Like a post
   */
  likePost(id: number): Observable<BlogPost | undefined> {
    if (this.useMockService) {
      return this.mockService.likePost(id);
    }

    return this.http.post<BlogPost>(`${this.API_URL}/${id}/like`, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Increment view count
   */
  viewPost(id: number): Observable<BlogPost | undefined> {
    if (this.useMockService) {
      return this.mockService.viewPost(id);
    }

    return this.http.post<BlogPost>(`${this.API_URL}/${id}/view`, {}).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all unique categories
   */
  getCategories(): Observable<string[]> {
    if (this.useMockService) {
      return new Observable(observer => {
        observer.next(this.mockService.getCategories());
        observer.complete();
      });
    }

    return this.http.get<string[]>(`${this.API_URL}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all unique tags
   */
  getAllTags(): Observable<string[]> {
    if (this.useMockService) {
      return new Observable(observer => {
        observer.next(this.mockService.getAllTags());
        observer.complete();
      });
    }

    return this.http.get<string[]>(`${this.API_URL}/tags`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get post statistics
   */
  getPostStats(id: number): Observable<{ views: number; likes: number }> {
    if (this.useMockService) {
      return this.mockService.getPostById(id).pipe(
        map(post => ({
          views: post?.views || 0,
          likes: post?.likes || 0
        }))
      );
    }

    return this.http.get<{ views: number; likes: number }>(`${this.API_URL}/${id}/stats`).pipe(
      catchError(this.handleError)
    );
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
      errorMessage = error.error?.message || `Server returned code ${error.status}: ${error.message}`;
    }

    if (environment.enableLogging) {
      console.error('Blog Service Error:', errorMessage, error);
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Toggle between mock and real API
   */
  setUseMockData(useMock: boolean): void {
    this.useMockService = useMock;
  }
}

