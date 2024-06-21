import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
 * Determines if a route can be activated based on the presence of an access token.
 * Redirects to the login page if no access token is found.
 * @returns {boolean} True if the route can be activated (access token is present), false otherwise.
 */
  canActivate(): boolean {
    const token = this.authService.getAccessToken();
    if (token) {
      // Optional: Token-Überprüfung oder Erneuerung
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
