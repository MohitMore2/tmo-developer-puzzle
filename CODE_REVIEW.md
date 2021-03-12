# Code smells and improvements

1. Used async pipes instead of subscriptions in book-search component to avoid potential memory leaks.
   Explanation : When the component gets destroyed, async pipe unsubscribes to a Observable automatically to avoid potential memory leaks.

2. Removed function formatDate() from book-search component and used date pipe instead as it reduces the amount of code.

3. Removed the unwanted function searchTerm() inside book-search component as we can fetch the value of the form control from the variable searchForm in the component class. It eliminates the unwanted or extra code in the application.

4. Error Handling done in book-search component. Error handling is required in order to notify the user about errors. For instance, API Failures.

5. Implemented missing functions failedAddToReadingList, failedRemoveFromReadingList  reading-list-reducer to fix test cases. Utilized these actions for error handling.

6. Implemented accessibility test using NVDA software for ADA compliance.
   Explanation : According to Americans with Disabilities Act (ADA) standards all electronic and information technology must be accessible to people with disabilities. NVDA software is a portable screen reader which reads the accessible content of the screen.

7. Initially, the books were getting added to the reading list on api failure as well as success.Therefore, made changes in the reading list reducres to add book to reading list only on api success.Similarly while removing the book from reading list.

8. Removed unused property from reading list actions and added the relevant property.For instance, replaced the 'book: Book' property from failedAddToReadingList with 'error: string'.

9. Initially, the exported interfaces and functions inside the book reducer and readingList reducer had same names.Therefore, renamed the exported interfaces and functions having common names in books reducer so that we can export both books reducer and reading list reducers from index.ts without any conflicts.

# Accessibility issues

1. Background and foreground colors do not have a sufficient contrast ratios.
   For example -
    - The empty search text "Try searching for a topic, for example" inside      book-search component might not be visible to user as its contrast ratio does not match. Therefore, changed the $gray40 color to $gray60.
    - The "Reading List" button app component might not be visible to user as its contrast ratio does not match. Therefore, added background of $gray80.

2. Added aria-label attribute to the buttons not having accessible names.
   Ex. In book-search component added aria-label attribute to search icon button.

# Manual Accessibility

1. Interactive controls should be keyboard focusable.
   Ex.Initially the anchor tag was not keyboard focusable so replaced the anchor tag with button in book-search component.Also anchor tag element did not inditcate its purpose of redirecting.

2. After Loading the search items cursor should focus back on either the input tag or "Mark as Read" Button so that the user knows exactly what shall be done next.Used ViewChild to to focus the search input.
