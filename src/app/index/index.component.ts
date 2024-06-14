import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/shared/services/auth.service';
import { BackendService } from 'src/shared/services/backend.service';
import { Book, BookGenre } from 'src/shared/services/models.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit{

  Books: any[] = [];
  genres: BookGenre[] =  ['Dystopia', 'Fantasy', 'Historical', 'Spy', 'Contemporary'];
  selectedGenre: BookGenre | null = null;
  searchQuery: string = '';
  selectedBook: Book | null = null;

  constructor(public authService: AuthService, private router: Router,public backend: BackendService,) {
  }
    /**
    * handles logout in the frontend
    * token is removed from sessionStorage
    * dealing with backend via auth.service
    * refers to login page
    * @remarks
    * sessionStorage used instead of localStorage to avoid blocking
  */
  async logout() {
    const authToken = sessionStorage.getItem('token');
    if (authToken) {
      try {
        await this.authService.logout(authToken);
        this.router.navigate(['/login']);
        sessionStorage.removeItem('token');
      } catch (error: any) {
        console.log('Error at logout:', error);
      }
    }
  }

  /**
   * fetches Book Data on initialisation
   * dealing with backend via backend.service
   */
  ngOnInit() {
    this.backend.fetchBookData().subscribe(
      (data: Book[]) => {
        this.Books = data;
      }
    );

  }

  /**
  * filters Books by genre for html code
  * @param {BookGenre | null} genre to be filtered
  */
  filterBooksByGenre(genre: BookGenre | null): Book[] {
    if (!genre) {
      return this.Books;
    }
    return this.Books.filter(Book => Book.genre === genre);
  }


  /**
  * prevents right click on element to disable download
  * @param {MouseEvent} event rightclick
  */
  preventRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  /**
  * shows overlay with Book details
  * @param {Book} Book Book Data from the backend for this specific Book
  */
  showOverlay(Book: Book): void {
    this.selectedBook = Book;
  }

  /**
  * closes overlay
  */
  closeOverlay(): void {
    this.selectedBook = null;
  }

  editBook(book: Book): void {}
}
