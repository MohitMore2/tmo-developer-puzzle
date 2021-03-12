import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const ReadingListConstants = {
  ADD: 'add',
  REMOVE: 'remove',
  ADD_SNACKBAR_TEXT: 'Book added to reading list.',
  REMOVE_SNACKBAR_TEXT: 'Book removed from reading list.',
  UNDO: 'Undo'
};

export const ConfigOptions: MatSnackBarConfig = {
  duration: 2000,
  verticalPosition: 'bottom',
  horizontalPosition: 'right',
};
