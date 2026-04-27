import { Routes } from '@angular/router';
import { projectDetailsResolver } from './core/resolver/project-details.resolver';
import { analyicResolver } from './core/resolver/analyic.resolver';
import { blogResolver } from './core/resolver/blog.resolver';
import { authguardGuard } from './core/guard/authguard.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent), title: 'Home' },
  { path: 'project', loadComponent: () => import('./pages/projects/projects.component').then(c => c.ProjectsComponent), title: ' Projects' },
  { path: 'project/details/:id', resolve: { data: projectDetailsResolver }, loadComponent: () => import('./pages/project-details/project-details.component').then(c => c.ProjectDetailsComponent), title: 'Project Details' },
  { path: 'contact-us', loadComponent: () => import('./pages/contact-us/contact-us.component').then(c => c.ContactUsComponent), title: ' Contact Us' },
  { path: 'project/analytics/:id', resolve: { data: analyicResolver }, loadComponent: () => import('./pages/analyics-page/analyics-page.component').then(c => c.AnalyicsPageComponent), title: 'Project results' },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog/blog.component').then(c => c.BlogComponent), title: 'Blog' },
  { path: 'blog-detalis', loadComponent: () => import('./pages/blog/blog-detalis/blog-detalis.component').then(c => c.BlogDetalisComponent), title: 'Blog Detalis' },
  {path : 'blog/:id',resolve :{blog : blogResolver} , loadComponent : ()=> import('./pages/blog/blog-detalis/blog-detalis.component').then(c=>c.BlogDetalisComponent)},
  {path:'dashboard' , loadComponent :()=>import('./pages/dashboard_pages/dashboard/dashboard.component').then(c=>c.DashboardComponent) , title : 'Dashboard' , canActivate : [authguardGuard] },
  { path: '**', loadComponent: () => import('./pages/notfound/notfound.component').then(c => c.NotfoundComponent), title: ' Not Found' }
];
