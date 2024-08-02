import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { observe: 'response' })
      .pipe(
        tap(response => {
          if (response.body && response.body.token) {
            localStorage.setItem('token', response.body.token);
            localStorage.setItem('expiresAt', response.body.expiresAt.toString());
            this.router.navigate(['/home']);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('expiresAt');
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');
    if (token && expiresAt) {
      return Date.now() < parseInt(expiresAt);
    }
    return false;
  }
}
