import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { getBooksError,getReadingListError } from '@tmo/books/data-access';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  @ViewChild('search') searchElement: ElementRef;
  books$: Observable<Book[]> = this.store.select(getAllBooks);
  bookError$: Observable<String> = this.store.select(getBooksError);
  readingListError$: Observable<String> = this.store.select(
    getReadingListError
  );
  subscription:Subscription;

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit():void {
    this.subscription = this.searchForm
      .get('term')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.searchBooks();
      });
  }

  addBookToReadingList(book: Book):void {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample():void {
    this.searchForm.controls.term.setValue('javascript');
  }

  searchBooks():void {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchForm.value.term }));
    } else {
      this.store.dispatch(clearSearch());
    }
    this.searchElement.nativeElement.focus();
  }

  ngOnDestroy():void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
