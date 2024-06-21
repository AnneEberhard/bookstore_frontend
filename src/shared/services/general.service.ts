import { Injectable } from '@angular/core';
import { Book } from './models.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  messageHeader: string = '';
  messageText: string = '';
  success: boolean = false;
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

/**
 * Handles success responses for book operations.
 * Sets success message header and text based on the action performed.
 * @param response The response object from the API.
 * @param action The action performed on the book (e.g., 'deleted', 'created', 'updated').
 */
   handleSuccess(response: any, action: string) {
    this.messageHeader = 'Success';
    this.messageText = `Book successfully ${action}!`;
    this.success = true;
  }

/**
* Handles errors that occur during book deletion.
* Sets error message based on the error detail from the backend.
* @param {{ error: { detail: string } }} err - The error object containing error details.
*/
  handleError(err: { error: { detail: string; }; }) {
    this.messageHeader = 'Error';
    this.messageText = err.error.detail;
    this.success = false;
  }

/**
* Handles errors that occur while attempting to refresh the access token.
* Sets an error message indicating token refresh failure.
* @param {any} refreshErr - The error object from token refresh attempt.
*/
  handleRefreshError(refreshErr: any) {
    this.messageHeader = 'Error';
    this.messageText = 'Failed to refresh token. Please log in again.';
    this.success = false;
  }
}
