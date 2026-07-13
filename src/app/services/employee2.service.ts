import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../model/employee.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService2 {
  private apiUrl = `${environment.apiUrl}/employees`;

  employeeListSubject = signal<Employee[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  currentPageSubject = signal(1);

  pageSizeSubject = signal(5);

  searchQuerySubject = signal('');

  groupSubject = signal('');

  statusSubject = signal('');

  private detailEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  detailEmployee$ = this.detailEmployeeSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllEmployees(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (employees) => {
        this.employeeListSubject.set(employees);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('Failed get employees', err);
        this.errorSubject.next('Failed to load employees');
        this.loadingSubject.next(false);
      }
    });
  }

  filteredEmployees$ = computed(() => {
    let filtered = this.employeeListSubject();

    const searchQuery = this.searchQuerySubject();
    const group = this.groupSubject();
    const status = this.statusSubject();

    if (searchQuery.trim()) {
      filtered = filtered.filter(employee =>
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (group) {
      filtered = filtered.filter(employee =>
        employee.group === group
      );
    }

    if (status) {
      filtered = filtered.filter(employee =>
        employee.status === status
      );
    }

    return filtered;
  });

  paginatedEmployees$ = computed(() => {
    const employees = this.filteredEmployees$();

    const start =
      (this.currentPageSubject() - 1) *
      this.pageSizeSubject();

    return employees.slice(
      start,
      start + this.pageSizeSubject()
    );
  });

  getDetailEmployee(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      tap((res: any) => {
        const employeeData = res?.data || res || null;
        this.detailEmployeeSubject.next(employeeData);
      })
    );
  }

  addEmployee(payloadEmployee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, payloadEmployee).pipe(
      catchError((err) => {
        console.error('Failed to add employee:', err);
        return throwError(() => err);
      })
    );
  }

  totalCount$ = computed(() =>
    this.filteredEmployees$().length
  );

  totalPages$ = computed(() =>
    Math.ceil(
      this.totalCount$() /
      this.pageSizeSubject()
    )
  );

  setSearchQuery(query: string): void {
    this.searchQuerySubject.set(query);
    this.currentPageSubject.set(1);
  }

  setGroup(group: string): void {
    this.groupSubject.set(group);
    this.currentPageSubject.set(1);
  }

  setStatus(status: string): void {
    this.statusSubject.set(status);
    this.currentPageSubject.set(1);
  }

  setPage(page: number): void {
    console.log('tes srvc setPage page', page, 'this.totalPages$()',this.totalPages$());
    this.currentPageSubject.set(page);
    console.log('tes srvc setPage this.currentPageSubject()', this.currentPageSubject());
  }

  setPageSize(size: number): void {
    this.pageSizeSubject.set(size);
    this.currentPageSubject.set(1);
  }
}