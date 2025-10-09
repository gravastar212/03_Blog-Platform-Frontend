import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Loading {
  // Global loading state
  private isLoading = signal(false);
  private loadingCount = signal(0);

  // Public read-only signal
  readonly loading = this.isLoading.asReadonly();

  /**
   * Show loading indicator
   */
  show(): void {
    this.loadingCount.update(count => count + 1);
    this.isLoading.set(true);
  }

  /**
   * Hide loading indicator
   * Only hides when all loading operations are complete
   */
  hide(): void {
    this.loadingCount.update(count => {
      const newCount = Math.max(0, count - 1);
      if (newCount === 0) {
        this.isLoading.set(false);
      }
      return newCount;
    });
  }

  /**
   * Force hide loading indicator
   */
  forceHide(): void {
    this.loadingCount.set(0);
    this.isLoading.set(false);
  }

  /**
   * Get current loading state
   */
  isCurrentlyLoading(): boolean {
    return this.isLoading();
  }
}
