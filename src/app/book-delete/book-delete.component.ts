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

    ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.backendService.getBookById(id).subscribe((book: Book) => {
          this.book = book;
        });
      }
    }

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

}
