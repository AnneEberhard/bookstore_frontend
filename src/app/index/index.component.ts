import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import { BackendService } from 'src/shared/services/backend.service';
import { GeneralService } from 'src/shared/services/general.service';
import { Book, BookGenre } from 'src/shared/services/models.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit{

  books: Book[] = [];
  genres: BookGenre[] =  ['Dystopia', 'Fantasy', 'Historical', 'Spy', 'Contemporary'];
  selectedGenre: BookGenre | null = null;
  searchQuery: string = '';

  constructor(
    public authService: AuthService, 
    private router: Router, 
    public backend: BackendService,
    public general: GeneralService) {
  }


  /**
   * fetches Book Data on initialisation
   * dealing with backend via backend.service
   */
  ngOnInit() {
    this.backend.fetchBookData().subscribe(
      (data: Book[]) => {
        this.books = data.filter(book => book.is_published);
      }
    );

  }

  /**
  * filters Books by genre for html code
  * @param {BookGenre | null} genre to be filtered
  */
  filterBooksByGenre(genre: BookGenre | null): Book[] {
    if (!genre) {
      return this.books;
    }
    return this.books.filter(book => book.genre === genre);
  }


  /**
  * prevents right click on element to disable download
  * @param {MouseEvent} event rightclick
  */
  preventRightClick(event: MouseEvent) {
    event.preventDefault();
  }


  editBook(book: Book): void {
    this.router.navigate(['/book-edit', book.id]);
  }

  buyBook(book: Book): void {
    this.general.selectedBooks.push(book);
    this.general.closeBookOverlay()
    this.router.navigate(['/book-basket']);
  }

  deleteBook(book: Book): void {
    this.router.navigate(['/book-delete', book.id]);
  }

}
