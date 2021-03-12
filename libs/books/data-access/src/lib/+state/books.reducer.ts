import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Book } from '@tmo/shared/models';

import * as BooksActions from './books.actions';

export const BOOKS_FEATURE_KEY = 'books';

export interface BookState extends EntityState<Book> {
  loaded: boolean;
  error?: string | null;
  searchTerm?: string;
}

export interface BooksPartialState {
  readonly [BOOKS_FEATURE_KEY]: BookState;
}

export const booksAdapter: EntityAdapter<Book> = createEntityAdapter<Book>();

export const bookInitialState: BookState = booksAdapter.getInitialState({
  loaded: false
});

const booksReducer = createReducer(
  bookInitialState,
  on(BooksActions.searchBooks, (state, { term }) => ({
    ...state,
    searchTerm: term,
    loaded: false
  })),
  on(BooksActions.searchBooksSuccess, (state, action) =>
    booksAdapter.setAll(action.books, {
      ...state,
      loaded: true
    })
  ),
  on(BooksActions.searchBooksFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(BooksActions.clearSearch, state => booksAdapter.removeAll(state))
);

export function bookReducer(state: BookState | undefined, action: Action) {
  return booksReducer(state, action);
}
