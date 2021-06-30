import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { getBooksError, getReadingListError } from '@tmo/books/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent  {
  @ViewChild('search') searchElement: ElementRef;
  books$: Observable<Book[]> = this.store.select(getAllBooks);
  bookError$: Observable<String> = this.store.select(getBooksError);
  readingListError$: Observable<String> = this.store.select(getReadingListError);

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchForm.value.term }));
    } else {
      this.store.dispatch(clearSearch());
    }
    this.searchElement.nativeElement.focus();
  }
}
