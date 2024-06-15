import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, lastValueFrom, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient, private router: Router) { 
    const token = localStorage.getItem('accessToken');
  }
  

/**
 * logic around handling registration of user in the backend
 * @param {any} userData - user info needed for regstration in backend
 * refers to the confirmation page next
 * containg the info whether regstration worked or not (s. confirmation component)
 */
  public registerUser(userData: any) {
    this.registerUserinBackend(userData).pipe(take(1))
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl(`/confirmation?data=${JSON.stringify(response)}`);
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            this.router.navigateByUrl(`/confirmation?data=${JSON.stringify(err.error)}`);
          } else {
            console.error('An error occurred:', err);
            alert('An error occurred!');
          }
        }
      });
  }

/**
 * handles user register in backend
 * @param {any} userData - user info needed for regstration in backend
 */
  registerUserinBackend(userData: any): Observable<any> {
    const url = environment.baseUrl + '/register/';
    return this.http.post<any>(url, userData);
  }

  /**
 * handles user login in backend
 * @param {string} username - user name
 * @param {string} password - user password
 */
  login(username: string, password: string): Observable<any> {
    const url = environment.baseUrl + '/token/';
    return this.http.post(url, { username, password });
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

  /**
 * handles user logout in front and backend
 */
  logout(): void {
    const refreshToken = this.getRefreshToken();
    const url = environment.baseUrl + '/token/blacklist/';
    this.http.post(url, { refresh_token: refreshToken }).subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('wookielogin');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('wookielogin');
        this.router.navigate(['/login']);
      }
    });
  }

}
