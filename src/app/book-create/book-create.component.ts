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

  assembleData(form: NgForm) {
    this.formData.set('title', form.value.title);
    this.formData.set('description', form.value.description);
    this.formData.set('genre', form.value.genre);
    this.formData.set('is_published', String(form.value.is_published));
  
    if (this.coverImageFile) {
      this.formData.set('cover_image', this.coverImageFile, this.coverImageFile.name);
    }
  }

  handleSuccess(response: any) {
    this.messageHeader = 'Success';
    this.messageText = 'Book created successfully!';
    this.success = true;
    console.log('Book created successfully:', response);
  }

  handleError(err: { error: { detail: string; }; }) {
    this.messageHeader = 'Error';
    this.messageText = err.error.detail;
    this.success = false;
    console.error('Book creation failed:', err);
    console.log(err.error.detail);
  }


  handleRefreshError(refreshErr: any) {
    this.messageHeader = 'Error';
    this.messageText = 'Failed to refresh token. Please log in again.';
    this.success = false;
    console.error('Token refresh failed:', refreshErr);
    // Optionally, redirect to the login page
  }


  onCoverImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.coverImageFile = event.target.files[0];
    }
  }

}
