import { Component } from '@angular/core';
import { BackendService } from 'src/shared/services/backend.service';
import { Book, BookGenre } from 'src/shared/services/models.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/shared/services/auth.service';
import { GeneralService } from 'src/shared/services/general.service';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.scss']
})
export class BookCreateComponent {
  messageHeader: string = '';
  messageText: string = '';
  success: boolean = false;
  genres: BookGenre[] = ['Dystopia', 'Fantasy', 'Historical', 'Spy', 'Contemporary'];
  coverImageFile: File | null = null;
  formData: FormData = new FormData();

  constructor(
    private backendService: BackendService,
    private authService: AuthService,
    public general: GeneralService) { }

  /**
   * Handles form submission for creating a new book.
   * If form is valid, assembles form data and submits it to create a new book.
   * Handles authentication errors (401) by attempting to refresh the access token.
   * Shows an overlay during submission.
   * @param {NgForm} form - The form object containing book details.
   */
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.assembleData(form);
      this.backendService.createBook(this.formData).subscribe({
        next: (response) => {
          this.handleSuccess(response);
        },
        error: (err) => {
          if (err.status === 401) {
            this.backendService.refreshToken().subscribe({
              next: (res) => {
                localStorage.setItem('accessToken', res.access);
                this.backendService.createBook(this.formData).subscribe({
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
    }
    this.general.showOverlay();
  }

  /**
 * Assembles form data from NgForm into FormData for book creation.
 * Sets title, description, genre, price, and marks book as published.
 * Optionally adds a cover image file if selected.
 * @param {NgForm} form - The form object containing book details.
 */
  assembleData(form: NgForm) {
    this.formData.set('title', form.value.title);
    this.formData.set('description', form.value.description);
    this.formData.set('genre', form.value.genre);
    this.formData.set('price', form.value.price);
    this.formData.set('is_published', 'True');

    if (this.coverImageFile) {
      this.formData.set('cover_image', this.coverImageFile, this.coverImageFile.name);
    }
  }

  /**
   * Handles successful response after creating a book.
   * Sets success message and logs the response.
   * @param {any} response - The response object from the backend.
   */
  handleSuccess(response: any) {
    this.messageHeader = 'Success';
    this.messageText = 'Book created successfully!';
    this.success = true;
    console.log('Book created successfully:', response);
  }

  /**
   * Handles errors that occur during book creation.
   * Sets error message based on the error detail from the backend.
   * Logs the error details.
   * @param {{ error: { detail: string } }} err - The error object containing error details.
   */
  handleError(err: { error: { detail: string; }; }) {
    this.messageHeader = 'Error';
    this.messageText = err.error.detail;
    this.success = false;
    console.error('Book creation failed:', err);
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
    // Optionally, redirect to the login page
  }

  /**
   * Handles the selection of a cover image file.
   * Stores the selected cover image file for later use.
   * @param {any} event - The event containing the selected file.
   */
  onCoverImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.coverImageFile = event.target.files[0];
    }
  }
}
