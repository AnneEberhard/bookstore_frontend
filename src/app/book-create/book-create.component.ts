import { Component } from '@angular/core';
import { BackendService } from 'src/shared/services/backend.service';
import { BookGenre } from 'src/shared/services/models.service';
import { NgForm } from '@angular/forms';
import { GeneralService } from 'src/shared/services/general.service';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.scss']
})
export class BookCreateComponent {
  genres: BookGenre[] = ['Dystopia', 'Fantasy', 'Historical', 'Spy', 'Contemporary'];
  coverImageFile: File | null = null;
  formData: FormData = new FormData();

  constructor(
    private backendService: BackendService,
    public generalService: GeneralService) { }

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
          this.generalService.handleSuccess(response, 'created');
        },
        error: (err) => {
          if (err.status === 401) {
            this.backendService.refreshToken().subscribe({
              next: (res) => {
                localStorage.setItem('accessToken', res.access);
                this.backendService.createBook(this.formData).subscribe({
                  next: (response) => {
                    this.generalService.handleSuccess(response, 'created')
                  },
                  error: (err) => {
                    this.generalService.handleError(err);
                  }
                });
              },
              error: (refreshErr) => {
                this.generalService.handleRefreshError(refreshErr);
              }
            });
          } else {
            this.generalService.handleError(err);
          }
        }
      });
    }
    this.generalService.showOverlay();
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
