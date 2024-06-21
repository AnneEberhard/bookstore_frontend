import { Injectable } from '@angular/core';
import { Book } from './models.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  selectedBook: Book | null = null;
  selectedBooks: Book[] = [];
  login: boolean = false;

  constructor(public authService: AuthService) { }


/**
* shows general overlay
*/
showOverlay(): void {
  let div = document.getElementById('overlay')
  if (div) {
    div.classList.remove('dNone')
  }
}

/**
* closes general overlay
*/
closeOverlay(): void {
  let div = document.getElementById('overlay')
  if (div) {
    div.classList.add('dNone')
  }
}

  /**
  * prevents right click on element to disable download
  * @param {MouseEvent} event rightclick
  */
  preventRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
  * shows overlay with book details
  * @param {Book} book Book Data from the backend for this specific Book
  */
  showBookOverlay(book: Book): void {
    this.checkLogStatus();
    this.selectedBook = book;
  }

  /**
  * closes book overlay
  */
  closeBookOverlay(): void {
    this.selectedBook = null;
  }

  /**
  * checks if user is logged in for display of buttons
  */
  async checkLogStatus() {
    let status = await this.authService.getWookielogin();
    this.login = (status === 'True');
  }
}
