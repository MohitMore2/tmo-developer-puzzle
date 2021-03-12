import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;
    const error='';

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should return error of API failure on adding book', () => {
      const action = ReadingListActions.failedAddToReadingList({error});

      const result: State = reducer(state, action);

      expect(result.error).toEqual(error);
    });

    it('failedRemoveFromReadingList should return error of API failure on removing book', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({error});

      const result: State = reducer(state, action);

      expect(result.error).toEqual(error)
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
