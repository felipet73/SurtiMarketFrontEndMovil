import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role.guard';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/auth/login/login.page').then(m => m.LoginPage),
  },

  {
    path: 'dashboard/admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./features/dashboard/admin/admin.page').then(m => m.AdminPage),
  },
  {
    path: 'dashboard/employee',
    canActivate: [authGuard, roleGuard(['EMPLOYEE'])],
    loadComponent: () =>
      import('./features/dashboard/employee/employee.page').then(m => m.EmployeePage),
  },
  {
    path: 'dashboard/client',
    canActivate: [authGuard, roleGuard(['CLIENT'])],
    loadComponent: () =>
      import('./features/dashboard/client/client.page').then(m => m.ClientPage),
  },
  {
    path: 'start',
    loadComponent: () => import('./features/sustainability/start/start.page').then( m => m.StartPage)
  },
  {
    path: 'questionnaire',
    loadComponent: () => import('./features/sustainability/questionnaire/questionnaire.page').then( m => m.QuestionnairePage)
  },
  {
    path: 'sustainability/start',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sustainability/start/start.page').then(m => m.StartPage),
  },
  {
    path: 'sustainability/questionnaire',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/sustainability/questionnaire/questionnaire.page').then(m => m.QuestionnairePage),
  },
];
