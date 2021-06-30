import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { removeFromReadingList, markBookAsRead, ReadingListPartialState, READING_LIST_FEATURE_KEY, initialState } from '@tmo/books/data-access';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let store: MockStore<ReadingListPartialState>;
  const initialStates = {
    [READING_LIST_FEATURE_KEY]: {
      ...initialState,
      error: 'No Error Available',
      loaded: true
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule],
      providers: [provideMockStore({ initialState: initialStates })]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should dispatch removeFromReadingList action', () => {
    const removeFromReadingListSpy = jest.spyOn(store, 'dispatch');
    component.removeFromReadingList(createReadingListItem('A'));
    expect(removeFromReadingListSpy).toBeCalledWith(removeFromReadingList({ item:createReadingListItem('A') }));
  });

  describe('markBookRead', () => {
    it('markBookRead should dispatch markBookReadInBooks action when the checkbox is checked', () => {
      const markBookReadSpy = jest.spyOn(store, 'dispatch');
      const eventToClick = MatCheckboxChange;
      eventToClick['checked'] = true;
      component.markBookRead(eventToClick, createReadingListItem('A'));
      expect(markBookReadSpy).toBeCalledWith(
        markBookAsRead({ book:  createReadingListItem('A') })
      );
    });
  });
});
