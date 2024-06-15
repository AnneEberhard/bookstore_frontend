import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  login = this.authService.isLoggedIn;

  constructor(public authService: AuthService, private router: Router) {
  }

    /**
    * handles logout in the frontend
    * token is removed 
    * dealing with backend via auth.service
    * refers to login page
    * @remarks
    * sessionStorage used instead of localStorage to avoid blocking
  */
    async logout() {
      const authToken = sessionStorage.getItem('token');
      if (authToken) {
        try {
          await this.authService.logout();
          this.router.navigate(['/login']);
          sessionStorage.removeItem('token');
        } catch (error: any) {
          console.log('Error at logout:', error);
        }
      }
    }
}
