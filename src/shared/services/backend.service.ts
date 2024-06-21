import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Book, BookGenre } from './models.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  bookUrl = environment.baseUrl + '/books';
  books: Book[] = [];

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  refreshToken(): Observable<any> {
    const url = environment.baseUrl + '/token/refresh/';
    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<any>(url, { refresh: refreshToken });
  }

  /**
   * Logic around getting content info from the backend
   * using getBooks for request
   * returns either arry of Book data (in JSON) or empty array if error occurs
   */
  fetchBookData(): Observable<Book[]> {
    return this.getBooks().pipe(
      tap((data: Book[]) => {
        this.books = data;
      }),
      catchError(error => {
        console.error('Error fetching Book data:', error);
        return of([]);
      })
    );
  }

  /**
   * handles getting Books from the backend
   */
  getBooks(): Observable<Book[]> {
    const url = this.bookUrl;
    return this.http.get<Book[]>(url);
  }

  /**
 * filters Books according to genre
 * @param {BookGenre} genreToFilter - respective genre names, model declared in interface
 */
  filterBooks(genreToFilter: BookGenre): Book[] {
    let filteredBooks: Book[];
    if (genreToFilter) {
      filteredBooks = this.books.filter(book => book.genre === genreToFilter);
    } else {
      filteredBooks = []
    }
    return filteredBooks;
  }

  /**
   * Retrieves a book by its ID from the server.
   * @param {string} id - The ID of the book to retrieve.
   * @returns {Observable<Book>} An Observable that emits the retrieved Book object.
   */
  getBookById(id: string): Observable<Book> {
    const url = `${this.bookUrl}/${id}/`;
    return this.http.get<Book>(url);
  }

  /**
 * Creates a new book on the server using the provided form data.
 * @param {FormData} formData - The form data containing book information.
 * @returns {Observable<any>} An Observable that emits the response data from the server.
 */
  createBook(formData: FormData): Observable<any> {
    const url = `${this.bookUrl}/create/`;
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.post<any>(url, formData, { headers });
  }


  /**
   * Updates an existing book on the server using the provided form data.
   * @param {number} id - The ID of the book to update.
   * @param {FormData} formData - The form data containing updated book information.
   * @returns {Observable<any>} An Observable that emits the response data from the server.
   */
  updateBook(id: number, formData: FormData): Observable<any> {
    const url = `${this.bookUrl}/edit/${id}/`;
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.put<any>(url, formData, { headers });
  }


  /**
   * Deletes a book from the server by its ID.
   * @param {number} id - The ID of the book to delete.
   * @returns {Observable<void>} An Observable that completes when the book is successfully deleted.
   */
  deleteBook(id: number): Observable<void> {
    const url = `${this.bookUrl}/delete/${id}/`;
    const accessToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    return this.http.delete<void>(url, { headers });
  }
}
