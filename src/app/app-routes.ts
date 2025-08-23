import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';
import { UserDetailsComponent } from './dashboard/components/user-details/user-details.component';
import { UserManagementComponent } from './dashboard/components/user-management/user-management.component';
import { LoginComponent } from './auth/components/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'user-details', component: UserDetailsComponent },
      { path: 'user-management', component: UserManagementComponent }
    ]
  }
];