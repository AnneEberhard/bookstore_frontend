import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { BackendService } from 'src/shared/services/backend.service';
import { GeneralService } from 'src/shared/services/general.service';
import { Book } from 'src/shared/services/models.service';

@Component({
  selector: 'app-book-delete',
  templateUrl: './book-delete.component.html',
  styleUrls: ['./book-delete.component.scss']
})
export class BookDeleteComponent implements OnInit{
  messageHeader: string = '';
  messageText: string = '';
  success: boolean = false;
  book: Book | null = null;

  constructor(
    private backendService: BackendService, 
    private authService: AuthService, 
    private route: ActivatedRoute,
    public general: GeneralService) { }

/**
 * Lifecycle hook that is called after Angular has initialized all data-bound properties
 * of a directive. Retrieves the book details by ID from the backend service based on the
 * route parameter 'id' and assigns it to the component's 'book' property.
 * If 'id' is present in the route parameters, makes a backend call to fetch the book details.
 * Assumes 'backendService' provides a method 'getBookById(id)' returning an Observable<Book>.
 */
    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.backendService.getBookById(id).subscribe((book: Book) => {
          this.book = book;
        });
      }
    }

  /**
 * Handles the deletion of a book.
 * Sends a request to delete the book identified by 'book.id' to the backend service.
 * Handles authentication errors (401) by attempting to refresh the access token.
 * Shows an overlay during the deletion process.
 * Uses 'handleSuccess()', 'handleError()', and 'handleRefreshError()' methods to handle
 * success, regular error, and refresh token error scenarios respectively.
 * Assumes 'backendService' provides methods 'deleteBook(id)' and 'refreshToken()' returning
 * Observables for HTTP responses.
 */
    delete() {
        this.backendService.deleteBook(this.book!.id!).subscribe({
          next: (response) => {
            this.handleSuccess(response);
          },
          error: (err) => {
            if (err.status === 401) {
              this.backendService.refreshToken().subscribe({
                next: (res) => {
                  localStorage.setItem('accessToken', res.access);
                  this.backendService.deleteBook(this.book!.id!).subscribe({
                    next: (response) => {
                      this.handleSuccess(response)
                    },
                    error: (err) => {
                      this.handleError(err);
                    }
                  });
                },
                error: (refreshErr) => {
                  this.handleRefreshError(refreshErr);
                }
              });
            } else {
              this.handleError(err);
            }
          }
        });
      this.general.showOverlay();
    }
  
 /**
 * Handles successful response after deleting a book.
 * Sets success message and logs the response.
 * @param {any} response - The response object from the backend.
 */
    handleSuccess(response: any) {
      this.messageHeader = 'Success';
      this.messageText = 'Book successfully deleted!';
      this.success = true;
    }
  
/**
 * Handles errors that occur during book deletion.
 * Sets error message based on the error detail from the backend.
 * Logs the error details.
 * @param {{ error: { detail: string } }} err - The error object containing error details.
 */
    handleError(err: { error: { detail: string; }; }) {
      this.messageHeader = 'Error';
      this.messageText = err.error.detail;
      this.success = false;
      console.error('Book update failed:', err);
      console.log(err.error.detail);
    }
  
/**
 * Handles errors that occur while attempting to refresh the access token.
 * Sets an error message indicating token refresh failure.
 * Logs the refresh error details.
 * @param {any} refreshErr - The error object from token refresh attempt.
 */
    handleRefreshError(refreshErr: any) {
      this.messageHeader = 'Error';
      this.messageText = 'Failed to refresh token. Please log in again.';
      this.success = false;
      console.error('Token refresh failed:', refreshErr);
    }
}
