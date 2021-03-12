import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  catchError,
  concatMap,
  exhaustMap,
  map
} from 'rxjs/operators';
import { ReadingListItem } from '@tmo/shared/models';
import { ReadingListConstants, ConfigOptions } from './reading.constants';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      concatMap(({ book, canUndo }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() =>
            ReadingListActions.confirmedAddToReadingList({
              book,
              canUndo
            })
          ),
          catchError((error) =>
            of(ReadingListActions.failedAddToReadingList({ error }))
          )
        )
      )
    )
  );

  promptToAdd$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedAddToReadingList),
      filter((action) => action.canUndo),
      map((action) =>
        ReadingListActions.openSnackBarAction({
          actionType: ReadingListConstants.ADD,
          book: { bookId: action.book.id, ...action.book }
        })
      )
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, canUndo }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({
              item,
              canUndo
            })
          ),
          catchError((error) =>
            of(ReadingListActions.failedRemoveFromReadingList({ error }))
          )
        )
      )
    )
  );

  promptToRemove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.confirmedRemoveFromReadingList),
      filter((action) => action.canUndo),
      map((action) =>
        ReadingListActions.openSnackBarAction({
          actionType: ReadingListConstants.REMOVE,
          book: action.item
        })
      )
    )
  );

  openSnackBar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.openSnackBarAction),
      concatMap((action) =>
        this.snackBar
          .open(
            action.actionType === ReadingListConstants.ADD
              ? ReadingListConstants.ADD_SNACKBAR_TEXT
              : ReadingListConstants.REMOVE_SNACKBAR_TEXT,
            ReadingListConstants.UNDO,
            ConfigOptions
          )
          .onAction()
          .pipe(
            map(() =>
              action.actionType === ReadingListConstants.ADD
                ? ReadingListActions.removeFromReadingList({
                    item: action.book,
                    canUndo: false
                  })
                : ReadingListActions.addToReadingList({
                    book: { id: action.book.bookId, ...action.book },
                    canUndo: false
                  })
            )
          )
      )
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) {}
}
