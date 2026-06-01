import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { EmployeeListComponent } from './components/employee-list/table-employee.component';
import { DetailEmployeeComponent } from './components/employee-detail/detail-employee.component';
import { FormAddEmployee } from './components/employee-add/form-add-employee.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard-employee', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'add-employee', component: FormAddEmployee, canActivate: [authGuard] },
  { path: 'detail-employee/:id', component: DetailEmployeeComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard-employee' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }