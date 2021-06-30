import { bookInitialState, bookReducer, BookState } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    it('loadBooksSuccess should return set the list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });

      const result: BookState = bookReducer(bookInitialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = bookReducer(bookInitialState, action);

      expect(result).toBe(bookInitialState);
    });
  });
});
