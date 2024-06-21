import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/shared/services/auth.service';
import { BackendService } from 'src/shared/services/backend.service';
import { Book, BookGenre } from 'src/shared/services/models.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/shared/services/general.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss']
})
export class BookEditComponent implements OnInit {
  messageHeader: string = '';
  messageText: string = '';
  success: boolean = false;
  genres: BookGenre[] = ['Dystopia', 'Fantasy', 'Historical', 'Spy', 'Contemporary'];
  coverImageFile: File | null = null;
  formData: FormData = new FormData();
  book: Book | null = null;
  coverImageFileName: string | null = null;


  constructor(
    private backendService: BackendService,
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
 * Handles form submission for updating a new book.
 * If form is valid, assembles form data and submits it to update a new book.
 * Handles authentication errors (401) by attempting to refresh the access token.
 * Shows an overlay during submission.
 * @param {NgForm} form - The form object containing book details.
 */
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.assembleData(form);
      this.backendService.updateBook(this.book!.id!, this.formData).subscribe({
        next: (response) => {
          this.handleSuccess(response);
        },
        error: (err) => {
          if (err.status === 401) {
            this.backendService.refreshToken().subscribe({
              next: (res) => {
                localStorage.setItem('accessToken', res.access);
                this.backendService.updateBook(this.book!.id!, this.formData).subscribe({
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
 * Assembles form data from NgForm into FormData for book update.
 * Sets title, description, genre, price, and is_published.
 * Optionally adds a cover image file if selected.
 * @param {NgForm} form - The form object containing book details.
 */ 
assembleData(form: NgForm) {
  this.formData.set('title', form.value.title);
  this.formData.set('description', form.value.description);
  this.formData.set('genre', form.value.genre);
  this.formData.set('price', form.value.price);
  this.formData.set('is_published', String(form.value.is_published));

  if (this.coverImageFile) {
    this.formData.set('cover_image', this.coverImageFile, this.coverImageFile.name);
  }
}

/**
 * Handles successful response after updating a book.
 * Sets success message and logs the response.
 * @param {any} response - The response object from the backend.
 */
  handleSuccess(response: any) {
    this.messageHeader = 'Success';
    this.messageText = 'Book updated successfully!';
    this.success = true;
    console.log('Book updated successfully:', response);
  }

/**
 * Handles errors that occur during book updating.
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
      if (this.coverImageFile !== null) {
        this.formData.set('cover_image', this.coverImageFile, this.coverImageFile.name);
      }
    } else {
      console.error('No file selected');
    }
  }
}
