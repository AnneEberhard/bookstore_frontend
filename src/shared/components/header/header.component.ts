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
   * Performs logout by hiding the menu and logging the user out through the authentication service.
   */
  clicklogout() {
    this.hideMenu();
    this.authService.logout();
  }

  /**
   * Redirects to the login page after hiding the menu.
   */
  clickLogin() {
    this.hideMenu();
    this.router.navigate(['/login']);
  }

  /**
   * Redirects to the book addition page after hiding the menu.
   */
  clickAddBook() {
    this.hideMenu();
    this.router.navigate(['/book-add']);
  }

  /**
   * Shows the navigation menu after ensuring it is checked.
   * @returns {Promise<void>} A promise that resolves once the menu check is completed.
   */
  async showMenu() {
    await this.checkMenu();
    let nav = document.getElementById('navContainer');
    if (nav) {
      nav.classList.remove('dNone');
    }
  }

  /**
   * Hides the navigation menu.
   */
  hideMenu() {
    let nav = document.getElementById('navContainer');
    if (nav) {
      nav.classList.add('dNone');
    }
  }

  /**
   * Checks the menu status by retrieving the username from local storage and checking the login status.
   */
  async checkMenu() {
    this.username = localStorage.getItem('user');
    this.general.checkLogStatus();
  }

  /**
   * Navigates to the book basket page after hiding the menu.
   */
  clickSeeBasket() {
    this.hideMenu();
    this.router.navigate(['/book-basket']);
  }

  /**
   * Navigates to the main page after hiding the menu.
   */
  clickMainPage() {
    this.hideMenu();
    this.router.navigate(['/']);
  }
}
