import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should load the reading list', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('markBookAsRead$', () => {
    it('should mark the book as read when confirmedMarkBookAsRead action is dispatched', done => {
      actions = new ReplaySubject();

      actions.next(
        ReadingListActions.markBookAsRead({ book: createReadingListItem('A') })
      );
      effects.markBookAsRead$.subscribe((action) => {
        const finishedBook = {
          ...{
            ...createReadingListItem('A'),
            id: createReadingListItem('A').bookId,
          },
          finishedDate: '2021-03-02T10:46:19Z',
        };
        action['book'].finishedDate = '2021-03-02T10:46:19Z';

        expect(action).toEqual(
          ReadingListActions.confirmedMarkBookAsRead({ book: finishedBook })
        );
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${createBook('A').id}/finished`)
        .flush([]);
    });

    it('should dispatch failedMarkBookAsRead action on api failure', (done) => {
      actions = new ReplaySubject();

      actions.next(
        ReadingListActions.markBookAsRead({ book: createReadingListItem('A') })
      );

      effects.markBookAsRead$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedMarkBookAsRead({
            error:
              'Http failure response for /api/reading-list/A/finished: 404 Bad Request',
          })
        );
        done();
      });

      httpMock
        .expectOne(`/api/reading-list/${createBook('A').id}/finished`)
        .flush(null, { status: 404, statusText: 'Bad Request' });
    });
  });
});
