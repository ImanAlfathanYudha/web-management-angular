import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService2 } from 'src/app/services/employee2.service';
import { faker } from '@faker-js/faker';
import { Employee } from 'src/app/model/employee.model';
import { APP_CONFIG } from 'src/app/config/app.config';

@Component({
  selector: 'app-form-add-employee',
  standalone: false,
  templateUrl: './form-add-employee.component.html',
  styleUrl: './form-add-employee.component.scss',
})
export class FormAddEmployee {
  employeeForm!: FormGroup;
  departments = APP_CONFIG.departments;
  searchGroup = '';
  maxDate = new Date().toISOString().split('T')[0];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService2,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      basicSalary: [
        0,
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/)
        ]
      ],
      group: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const updatedEmployeePayload: Employee = {
      ...this.employeeForm.value,
      id: faker.number.int({ min: 1, max: 999 }),
      birthDate: this.employeeForm.value.birthDate
        ? new Date(this.employeeForm.value.birthDate)
        : null,
      username: faker.internet.displayName({
        firstName: this.employeeForm.value.firstName,
        lastName: this.employeeForm.value.lastName,
      }),
      status: 'ACTIVE',
      description: new Date().toISOString(),
    };
    this.employeeService
      .addEmployee(updatedEmployeePayload)
      .subscribe({
        next: () => {
          alert('Employee added successfully');
          this.router.navigate(['/dashboard-employee']);
        },
        error: (err) => {
          alert('Failed to add employee: ' + err?.error?.Message || '');
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard-employee']);
  }

  onSalaryInputChecker(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.employeeForm
      .get('basicSalary')
      ?.setValue(input.value, { emitEvent: false });
  }
}
