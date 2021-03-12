import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BooksDataAccessModule } from '@tmo/books/data-access';
import { BookSearchComponent } from './book-search/book-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { TotalCountComponent } from './total-count/total-count.component';
import { ReadingListComponent } from './reading-list/reading-list.component';

const EXPORTS = [
  BookSearchComponent,
  TotalCountComponent,
  ReadingListComponent
];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: BookSearchComponent }
    ]),
    BooksDataAccessModule
  ],
  exports: [...EXPORTS],
  declarations: [...EXPORTS]
})
export class BooksFeatureModule {}
