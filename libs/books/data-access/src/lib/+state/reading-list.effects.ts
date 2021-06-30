import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>('/api/reading-list')
          .pipe(
            map(data =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            )
          )
      ),
      catchError(error =>
        of(ReadingListActions.loadReadingListError({ error }))
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ error }))
          )
        )
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error }))
          )
        )
      )
    )
  );

  markBookAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.markBookAsRead),
      concatMap(({ book }) => {
        const finishedBook = {
          ...{ ...book, id: book.bookId },
          finishedDate: new Date().toISOString(),
        };
        return this.http
          .put(`/api/reading-list/${finishedBook.id}/finished`, finishedBook)
          .pipe(
            map(() =>
              ReadingListActions.confirmedMarkBookAsRead({ book: finishedBook })
            ),
            catchError((error) =>{
             return of(
               ReadingListActions.failedMarkBookAsRead({ error: error.message })
             );
            })
          );
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}
