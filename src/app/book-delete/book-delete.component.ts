import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from 'src/shared/services/backend.service';
import { GeneralService } from 'src/shared/services/general.service';
import { Book } from 'src/shared/services/models.service';

@Component({
  selector: 'app-book-delete',
  templateUrl: './book-delete.component.html',
  styleUrls: ['./book-delete.component.scss']
})
export class BookDeleteComponent implements OnInit{

  book: Book | null = null;

  constructor(
    private backendService: BackendService, 
    private route: ActivatedRoute,
    public generalService: GeneralService) { }

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
 * Assumes 'generalService' provides methods 'handleSuccess()', 'handleError()', and 'handleRefreshError()'
 * to handle success, regular error, and refresh token error scenarios respectively.
 * Assumes 'backendService' provides methods 'deleteBook(id)' and 'refreshToken()' returning
 * Observables for HTTP responses.
 */
    delete() {
        this.backendService.deleteBook(this.book!.id!).subscribe({
          next: (response) => {
            this.generalService.handleSuccess(response, 'deleted');
          },
          error: (err) => {
            if (err.status === 401) {
              this.backendService.refreshToken().subscribe({
                next: (res) => {
                  localStorage.setItem('accessToken', res.access);
                  this.backendService.deleteBook(this.book!.id!).subscribe({
                    next: (response) => {
                      this.generalService.handleSuccess(response, 'deleted')
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
      this.generalService.showOverlay();
    }
}
