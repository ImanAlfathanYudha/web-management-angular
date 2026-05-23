import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Employee } from 'src/app/model/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-table-employee',
  templateUrl: './table-employee.component.html',
  styleUrl: './table-employee.component.scss',
  standalone: false,
})

export class EmployeeListComponent implements OnInit {

  employees$!: Observable<Employee[]>;

  loading$ = this.employeeService.loading$;
  error$ = this.employeeService.error$;

  searchQuery = '';
  selectedGroup = '';
  selectedStatus = '';

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;
  totalCount = 0;

  constructor(
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployees();
    this.employees$ = this.employeeService.paginatedEmployees$;
    combineLatest([
      this.employeeService.currentPage$,
      this.employeeService.pageSize$,
      this.employeeService.totalPages$,
      this.employeeService.totalCount$
    ]).subscribe(([
      currentPage,
      pageSize,
      totalPages,
      totalCount
    ]) => {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.totalPages = totalPages;
      this.totalCount = totalCount;
    });
  }

  onSearch(): void {
    this.employeeService.setSearchQuery(
      this.searchQuery
    );
  }

  onGroupChange(group: string): void {
    this.employeeService.setGroup(group);
  }

  onStatusChange(status: string): void {
    this.employeeService.setStatus(status);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.employeeService.setPage(page);
  }

  onPageSizeChange(size: number): void {
    this.employeeService.setPageSize(size);
  }

  // onSort(field: string): void {
  //   this.employeeService.setSorting(field);
  // }
}