import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  login: boolean = false;
  username: string | null = '';

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
  clicklogout() {
    this.hideMenu();
    this.authService.logout();
  }


  clickLogin() {
    this.hideMenu();
    this.router.navigate(['/login']);
  }

  clickAddBook() {
    this.hideMenu();
    this.router.navigate(['/book-add']);
  }

  async showMenu() {
    await this.checkLogStatus();
    let nav = document.getElementById('navContainer')
    if (nav) {
      nav.classList.remove('dNone')
    }
  }

  hideMenu() {
    let nav = document.getElementById('navContainer')
    if (nav) {
      nav.classList.add('dNone')
    }
  }

  async checkLogStatus() {
    let status = await this.authService.getWookielogin();
    this.username = localStorage.getItem('user');
    this.login = (status === 'True');
  }
}
