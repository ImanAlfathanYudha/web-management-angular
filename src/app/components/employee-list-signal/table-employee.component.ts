import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { APP_CONFIG } from 'src/app/config/app.config';
import { EmployeeService2 } from 'src/app/services/employee2.service';

@Component({
  selector: 'app-table-employee',
  templateUrl: './table-employee.component.html',
  styleUrl: './table-employee.component.scss',
  standalone: false,
})

export class EmployeeListComponent implements OnInit {

  employees$ = this.employeeService2.paginatedEmployees$;
  private destroy$ = new Subject<void>();

  loading$ = this.employeeService2.loading$;
  error$ = this.employeeService2.error$;

  searchQuery = '';
  selectedGroup = '';
  selectedStatus = '';

  currentPage = this.employeeService2.currentPageSubject;
  pageSize = this.employeeService2.pageSizeSubject();
  totalPages = this.employeeService2.totalPages$;
  totalCount =  this.employeeService2.totalCount$;

  departments = APP_CONFIG.departments;

  constructor(
    private employeeService2: EmployeeService2,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeService2.getAllEmployees();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.employeeService2.setSearchQuery(query);
  }

  onGroupChange(group: string) {
    this.selectedGroup = group;
    this.employeeService2.setGroup(group);
  }

  onStatusChange(status: string) {
    this.selectedStatus = status;
    this.employeeService2.setStatus(status);
  }

  onPageChange(page: number): void {
    console.log('tes onPageChange', page, this.totalPages());
    if (page < 1 || page > this.totalPages()) {
      console.log('tes invalid page number', page, this.totalPages());
      return;
    }
    this.employeeService2.setPage(page);
  }

  onPageSizeChange(size: number): void {
    this.employeeService2.setPageSize(size);
  }

  gotoDetail(id: string): void {
    this.router.navigate([`/detail-employee/${id}`]);
  }

  gotoEdit(id: string): void {
    alert('Edit employee with ID: ' + id);
  }

  gotoDelete(id: string): void {
    alert('Delete employee with ID: ' + id);
  }
}