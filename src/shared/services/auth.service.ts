import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, lastValueFrom, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoading: boolean = false;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); //defining an Observale for subscription
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); //observable derived from isLoggedInSubject, cannot be altered from outside
  
  constructor(private http: HttpClient, private router: Router) { 
    const token = sessionStorage.getItem('token');
    if (token) {
      this.setLoggedIn(true); //if token is available aka logged in in backend, setLoggedIn(true)
    }else {
      this.setLoggedIn(false);
    }
  }
  
/**
 * changes isLoggedInSubject to the value false or true depending on token existence in session storage
 * @param {boolean} value : refers to the fact whether a token is in the session storage as defined in the constructur
 */
  setLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

/**
 * @returns the value of isLoggedInSubject
 */
  get isLoggedIn() {
    return this.isLoggedInSubject.value;
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


  login(username: string, password: string): Observable<any> {
    return this.http.post('/token/', { username, password });
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    this.http.post('/token/blacklist/', { refresh_token: refreshToken }).subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        // Fallback: Trotzdem Token entfernen
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/login']);
      }
    });
  }

  /**
 * handles user login in backend
 * @param {string} email - user email
 * @param {string} password - user password
 */
  public login2(email: string, password: string) {
    const url = environment.baseUrl + '/token/';
    const body = {
      "email": email,
      "password": password
    };
    return lastValueFrom(this.http.post(url, body));
  }

/**
 * handles user logout in backend
 * @param {string} authToken - token from sessionStorage
 */
  async logout2(authToken: string) {
    const url = environment.baseUrl + `/logout/`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Token ${authToken}`,
      },
    }).catch(error => {
      console.error("Fehler beim Logout:", error);
    });
  }

}
