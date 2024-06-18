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
    const url = environment.baseUrl +'/token/refresh/';
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


  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.bookUrl}${id}/`);
  }

  createBook(formData: FormData): Observable<any> {
    const url = `${this.bookUrl}/create/`;
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    return this.http.post<any>(url, formData, { headers });
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.bookUrl}${id}/edit/`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.bookUrl}${id}/delete/`);
  }

}
