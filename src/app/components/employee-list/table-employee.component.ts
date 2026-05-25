import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';
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
  private destroy$ = new Subject<void>();

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
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployees();
    this.employees$ = this.employeeService.paginatedEmployees$;
    this.employeeService.searchQuery$
      .subscribe(value => {
        this.searchQuery = value;
      });
    this.employeeService.group$
      .subscribe(value => {
        this.selectedGroup = value;
      });
    this.employeeService.status$
      .subscribe(value => {
        this.selectedStatus = value;
      });
    combineLatest([
      this.employeeService.currentPage$,
      this.employeeService.pageSize$,
      this.employeeService.totalPages$,
      this.employeeService.totalCount$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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