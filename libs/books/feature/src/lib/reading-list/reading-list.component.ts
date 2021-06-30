import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, markBookAsRead } from '@tmo/books/data-access';
import {  ReadingListItem } from '@tmo/shared/models';
import { getReadingListError } from '@tmo/books/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ : Observable< ReadingListItem[]>= this.store.select(getReadingList);
  readingListError$: Observable<String>  = this.store.select(getReadingListError);

  constructor(private readonly store: Store) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  markBookRead($event, item:ReadingListItem) {
    if ($event.checked) {
       this.store.dispatch(markBookAsRead({ book: item }));
    }
 }
}
