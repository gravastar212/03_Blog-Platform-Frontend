import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { BlogList } from './pages/blog-list/blog-list';
import { BlogDetail } from './pages/blog-detail/blog-detail';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { BlogEditor } from './pages/blog-editor/blog-editor';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home | Blog Platform'
  },
  {
    path: 'blog',
    component: BlogList,
    title: 'All Posts | Blog Platform'
  },
  {
    path: 'blog/:id',
    component: BlogDetail,
    title: 'Blog Post | Blog Platform'
  },
  {
    path: 'login',
    component: Login,
    title: 'Login | Blog Platform'
  },
  {
    path: 'register',
    component: Register,
    title: 'Register | Blog Platform'
  },
  {
    path: 'admin',
    component: AdminDashboard,
    title: 'Admin Dashboard | Blog Platform'
  },
  {
    path: 'admin/editor',
    component: BlogEditor,
    title: 'Create Post | Blog Platform'
  },
  {
    path: 'admin/editor/:id',
    component: BlogEditor,
    title: 'Edit Post | Blog Platform'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
