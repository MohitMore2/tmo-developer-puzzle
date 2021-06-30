import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListConstants } from './reading.constants';
import { Action } from '@ngrx/store';

describe('ToReadEffects', () => {
  let actions: Observable<Action>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should load the reading list', done => {
      actions = of(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should add book to the reading list', (done) => {
      actions = of(
        ReadingListActions.addToReadingList({
          book: createBook('A'),
          canUndo: true
        })
      );

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedAddToReadingList({
            book: createBook('A'),
            canUndo: true
          })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('should open snackbar to undo book addition to reading list', (done) => {
      actions = of(
        ReadingListActions.confirmedAddToReadingList({
          book: createBook('A'),
          canUndo: true
        })
      );

      effects.promptToAdd$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.openSnackBarAction({
            actionType: ReadingListConstants.ADD,
            book: { bookId: createBook('A').id, ...createBook('A') },
          })
        );
        done();
      });
    });
  });

  describe('removeBook$', () => {
    it('should remove book from the reading list', done => {
      actions = of(
        ReadingListActions.removeFromReadingList({
          item: createReadingListItem('A'),
          canUndo: true
        })
      );

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.confirmedRemoveFromReadingList({
            item: createReadingListItem('A'),
            canUndo: true
          })
        );
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${createReadingListItem('A').bookId}`)
        .flush([]);
    });

    it('should open snackbar to undo book removal from reading list', (done) => {
      actions = of(
        ReadingListActions.confirmedRemoveFromReadingList({
          item: createReadingListItem('A'),
          canUndo: true
        })
      );

      effects.promptToRemove$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.openSnackBarAction({
            actionType: ReadingListConstants.REMOVE,
            book: action.book
          })
        );
        done();
      });
    });
  });
});
