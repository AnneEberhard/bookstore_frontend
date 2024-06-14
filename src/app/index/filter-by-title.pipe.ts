import { Pipe, PipeTransform } from '@angular/core';
import { Book } from 'src/shared/services/models.service';


/**
 * This pipe is only for filtering the books bei genres
 * @remarks
 * models are defined in models.service.ts
 */
@Pipe({
  name: 'filterByTitle'
})
export class FilterByTitlePipe implements PipeTransform {
  transform(books: Book[], searchText: string): Book[] {
    if (!books || !searchText) {
      return books;
    }

    searchText = searchText.toLowerCase();

    return books.filter(book =>
      book.title.toLowerCase().includes(searchText)
    );
  }
}
