import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomUser } from './models.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { 
    const token = localStorage.getItem('accessToken');
  }
  

/**
 * registers user register in backend
 * @param {CustomUser} user - user info needed for regstration in backend
 */
  register(user: CustomUser): Observable<any> {
    const url = environment.baseUrl + '/register/';
    return this.http.post<any>(url, user);
  }

  /**
 * handles user login in backend
 * @param {string} username - user name
 * @param {string} password - user password
 */
  login(username: string, password: string): Observable<any> {
    const url = environment.baseUrl + '/token/';
    return this.http.post<CustomUser>(url, { username, password });
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('wookielogin', 'True');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getWookielogin(): string | null {
    return localStorage.getItem('wookielogin');
  }

  getUser(): string | null {
    return localStorage.getItem('wookielogin');
  }

  /**
 * handles user logout in front and backend
 */
  logout(): void {
    const refreshToken = this.getRefreshToken();
    const url = environment.baseUrl + '/token/blacklist/';
    this.http.post(url, { refresh: refreshToken }).subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('wookielogin');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('wookielogin');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });
  }

}
