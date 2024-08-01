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
            this.router.navigate(['/home']);
          }
        }),
        catchError(error => {
          // Aqui você pode tratar o erro ou retransmitir para ser tratado no componente
          return throwError(() => error);
        })
      );
  }
  

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
