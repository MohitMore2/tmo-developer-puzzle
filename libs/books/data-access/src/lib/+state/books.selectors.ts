import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  BOOKS_FEATURE_KEY,
  booksAdapter,
  BooksPartialState,
  BookState
} from './books.reducer';

export const getBooksState = createFeatureSelector<BooksPartialState, BookState>(
  BOOKS_FEATURE_KEY
);

const { selectAll } = booksAdapter.getSelectors();

export const getBooksLoaded = createSelector(
  getBooksState,
  (state: BookState) => state.loaded
);

export const getBooksError = createSelector(
  getBooksState,
  (state: BookState) => state.error
);

export const getBooks = createSelector(getBooksState, selectAll);
