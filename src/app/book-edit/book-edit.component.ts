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
    private authService: AuthService,
    private route: ActivatedRoute,
    public general: GeneralService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.backendService.getBookById(id).subscribe((book: Book) => {
        this.book = book;
      });
    }
  }

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

  handleSuccess(response: any) {
    this.messageHeader = 'Success';
    this.messageText = 'Book updated successfully!';
    this.success = true;
    console.log('Book updated successfully:', response);
  }


  handleError(err: { error: { detail: string; }; }) {
    this.messageHeader = 'Error';
    this.messageText = err.error.detail;
    this.success = false;
    console.error('Book update failed:', err);
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
      if (this.coverImageFile !== null) {
        this.formData.set('cover_image', this.coverImageFile, this.coverImageFile.name);
      }
    } else {
      console.error('No file selected');
      // Optional: Feedback an den Benutzer geben
    }
  }


  /**
  * closes overlay
  */
  closeOverlay(): void {
    let div = document.getElementById('overlay')
    if (div) {
      div.classList.add('dNone')
    }
  }

}
