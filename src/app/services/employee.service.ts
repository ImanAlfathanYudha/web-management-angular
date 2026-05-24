import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../model/employee.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  private employeeListSubject = new BehaviorSubject<Employee[]>([]);
  employeeList$ = this.employeeListSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();

  private pageSizeSubject = new BehaviorSubject<number>(5);
  pageSize$ = this.pageSizeSubject.asObservable();

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  private groupSubject = new BehaviorSubject<string>('');
  group$ = this.groupSubject.asObservable();

  private statusSubject = new BehaviorSubject<string>('');
  status$ = this.statusSubject.asObservable();

  private detailEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  detailEmployee$ = this.detailEmployeeSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllEmployees(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (employees) => {
        this.employeeListSubject.next(employees);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        console.error('Failed get employees', err);
        this.errorSubject.next('Failed to load employees');
        this.loadingSubject.next(false);
      }
    });
  }

  filteredEmployees$ = combineLatest([
    this.employeeList$,
    this.searchQuery$,
    this.group$,
    this.status$
  ]).pipe(
    map(([employees, searchQuery, group, status]) => {
      let filtered = employees;
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
    })
  );

  paginatedEmployees$ = combineLatest([
    this.filteredEmployees$,
    this.currentPage$,
    this.pageSize$
  ]).pipe(
    map(([employees, currentPage, pageSize]) => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return employees.slice(start, end);
    })
  );

  getDetailEmployee(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      tap((res: any) => {
        console.log('RAW employee response:', res);
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

  totalCount$ = this.filteredEmployees$.pipe(
    map(employees => employees.length)
  );

  totalPages$ = combineLatest([
    this.totalCount$,
    this.pageSize$
  ]).pipe(
    map(([totalCount, pageSize]) =>
      Math.ceil(totalCount / pageSize)
    )
  );

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
    this.currentPageSubject.next(1);
  }

  setGroup(group: string): void {
    console.log('tes group filter to:', group);
    this.groupSubject.next(group);
    this.currentPageSubject.next(1);
  }

  setStatus(status: string): void {
    this.statusSubject.next(status);
    this.currentPageSubject.next(1);
  }

  setPage(page: number): void {
    this.currentPageSubject.next(page);
  }

  setPageSize(size: number): void {
    this.pageSizeSubject.next(size);
    this.currentPageSubject.next(1);
  }
}