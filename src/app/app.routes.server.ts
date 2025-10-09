import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'blog',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'blog/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/editor',
    renderMode: RenderMode.Client
  },
  {
    path: 'admin/editor/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
