import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { addToReadingList, searchBooks } from '@tmo/books/data-access';
import { createBook } from '@tmo/shared/testing';
import { Book } from '@tmo/shared/models';
import { ReadingListPartialState, READING_LIST_FEATURE_KEY, initialState, bookInitialState, BOOKS_FEATURE_KEY } from '@tmo/books/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';

describe('BookSearchComponent', () => {
  let component: BookSearchComponent;
  let store: MockStore<ReadingListPartialState>;
  let fixture: ComponentFixture<BookSearchComponent>;
  const initialStates = {
    [READING_LIST_FEATURE_KEY]: {
      ...initialState,
      error: 'No Error Available',
      loaded: true
    },
    [BOOKS_FEATURE_KEY]: {
      ...bookInitialState,
      error: 'No Error Available',
      loaded: true
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BooksFeatureModule,
        NoopAnimationsModule,
        SharedTestingModule,
        StoreModule.forRoot(
          {}
        ),
      ],
      providers: [
        provideMockStore({ initialState: initialStates })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should not dispatch searchBooks action on ngOnInit() before 500ms', fakeAsync(() => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.ngOnInit();
      component.searchForm.get('term').setValue('javascript');

      tick(300);
      expect(dispatchSpy).not.toHaveBeenNthCalledWith(
        1,
        searchBooks({ term: 'javascript' })
      );

      tick(500);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        1,
        searchBooks({ term: 'javascript' })
      );
    }));

    it('should not dispatch searchBooks action when search term is not changed after 500ms debounceTime', fakeAsync(() => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.searchForm.setValue({ term: 'javascript' });

      tick(500);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        1,
        searchBooks({ term: 'javascript' })
      );

      component.searchForm.setValue({ term: 'javas' });
      component.searchForm.setValue({ term: 'javascript' });
      tick(500);
      expect(dispatchSpy).toHaveBeenNthCalledWith(
        1,
        searchBooks({ term: 'javascript' })
      );
    }));
  });

  describe('addBookToReadingList()', () => {
    it('should dispatch addToReadingList action when addBookToReadingList function is called', () => {
      const book: Book = createBook('A');
      jest.spyOn(store,'dispatch');

      component.addBookToReadingList(book);

      expect(store.dispatch).toHaveBeenCalledWith(
        addToReadingList({ book })
      );
    });
  });
});
