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
//  formData: Book = {
//    title: '',
//    description: '',
//    genre: 'Unclassified',
//    is_published: true,
//    author: { username: '', first_name: '', last_name: '', email: '', password: '' }
//  };

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

      this.formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      this.backendService.createBook(this.formData).subscribe({
        next: (response) => {
          console.log('Book created successfully:', response);
        },
        error: (err) => {
          console.error('Book creation failed:', err);
        }
      });
    }
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
