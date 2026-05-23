import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../model/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private apiUrl = `${environment.apiUrl}/users`;

  private currentUserSubject =
    new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?username=${username}&password=${password}`).pipe(
      map(users => {
        if (users && users.length > 0) {
          const user = users[0] as User;
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          return true;
        }
        throw new Error('Invalid username or password.');
      }),
      catchError(err => {
        const errorMessage = err?.error?.Message || 'Authentication service unavailable. Please try again later.';
        return throwError(() => new Error(errorMessage));
      })
    )
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}