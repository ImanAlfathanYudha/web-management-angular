import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { EmployeeListComponent } from './components/employee-list-signal/table-employee.component';
import { CommonModule} from '@angular/common';
import { DetailEmployeeComponent } from './components/employee-detail/detail-employee.component';
import { FormAddEmployee } from './components/employee-add/form-add-employee.component';
import { FilterToolbarComponent } from './components/employee-list-signal/search-toolbar/search-toolbar.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmployeeListComponent,
    DetailEmployeeComponent,
    FormAddEmployee,
    FilterToolbarComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule, FormsModule, CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
