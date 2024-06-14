import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Book, BookGenre } from './models.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  bookUrl = environment.baseUrl + '/books/';
  books: Book[] = [];

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

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
    const url = environment.baseUrl + `/Books/`;
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
}
