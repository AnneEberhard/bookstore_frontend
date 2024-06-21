import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { GeneralService } from 'src/shared/services/general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  username: string | null = '';

  constructor(public authService: AuthService, private router: Router, public general: GeneralService) {
  }

/**
* handles logout in the frontend
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
    await this.checkMenu();
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

  async checkMenu() {
    this.username = localStorage.getItem('user');
    this.general.checkLogStatus();
  }

  clickSeeBasket() {
    this.hideMenu();
    this.router.navigate(['/book-basket']);
  }

  clickMainPage() {
    this.hideMenu();
    this.router.navigate(['/']);
  }
}
