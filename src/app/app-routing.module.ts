import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { EmployeeListComponent } from './components/table-employee/table-employee.component';
import { DetailEmployeeComponent } from './components/detail-employee/detail-employee.component';
import { FormAddEmployee } from './components/form-add-employee/form-add-employee.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard-employee', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'dashboard-employee/add', component: FormAddEmployee, canActivate: [authGuard] },
  { path: 'dashboard-employee/:id', component: DetailEmployeeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard-employee' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }