import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { EmployeeListComponent } from './components/table-employee/table-employee.component';
import { CommonModule} from '@angular/common';
import { DetailEmployeeComponent } from './components/detail-employee/detail-employee.component';
import { FormAddEmployee } from './components/form-add-employee/form-add-employee.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmployeeListComponent,
    DetailEmployeeComponent,
    FormAddEmployee,
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule, FormsModule, CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
