import { Component } from '@angular/core';
import { BackendService } from 'src/shared/services/backend.service';
import { Book, BookGenre } from 'src/shared/services/models.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/shared/services/auth.service';

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

  constructor(private backendService: BackendService, private authService: AuthService) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.formData.set('title', form.value.title);
      this.formData.set('description', form.value.description);
      this.formData.set('genre', form.value.genre);
      this.formData.set('is_published', String(form.value.is_published));

      if (this.coverImageFile) {
        this.formData.set('cover_image', this.coverImageFile, this.coverImageFile.name);
      }

      this.backendService.createBook(this.formData).subscribe({
        next: (response) => {
          this.messageHeader = 'Success';
          this.messageText = 'Book created successfully!';
          this.success = true;
          console.log('Book created successfully:', response);
        },
        error: (err) => {
          if (err.status === 401) {
            // Token abgelaufen oder ungültig, versuchen Sie den Token zu aktualisieren
            this.backendService.refreshToken().subscribe({
              next: (res) => {
                localStorage.setItem('accessToken', res.access);
                // Versuchen Sie erneut, das Buch zu erstellen
                this.backendService.createBook(this.formData).subscribe({
                  next: (response) => {
                    this.messageHeader = 'Success';
                    this.messageText = 'Book created successfully!';
                    this.success = true;
                    console.log('Book created successfully:', response);
                  },
                  error: (err) => {
                    this.messageHeader = 'Error';
                    this.messageText = 'Failed to create book. Please try again.';
                    this.success = false;
                    console.error('Book creation failed:', err);
                  }
                });
              },
              error: (refreshErr) => {
                this.messageHeader = 'Error';
                this.messageText = 'Failed to refresh token. Please log in again.';
                this.success = false;
                console.error('Token refresh failed:', refreshErr);
                // Optionally, redirect to the login page
              }
            });
          } else {
            this.messageHeader = 'Error';
            this.messageText = 'Failed to create book. Please try again.';
            this.success = false;
            console.error('Book creation failed:', err);
          }
        }
      });
    }
    this.showOverlay();
  }

  onCoverImageSelected(event: any) {
    if (event.target.files.length > 0) {
      this.coverImageFile = event.target.files[0];
    }
  }

  /**
* shows overlay
*/
  showOverlay(): void {
    let div = document.getElementById('overlay')
    if (div) {
      div.classList.remove('dNone')
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
