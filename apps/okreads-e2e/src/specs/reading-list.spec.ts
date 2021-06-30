import { $, $$, browser, ExpectedConditions, element, by } from 'protractor';

describe('When: I use the reading list feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    const form = $('form');
    const input = $('input[type="search"]');
    await input.sendKeys('python');
    await form.submit();
  });

  it('I should be able to perform undo action on the book added to reading list', async () => {
    const readingList = await $$('.reading-list-item');
    const initialReadingListLength = 0;
    const readingListToggle = $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    if (readingList.length > 0) {
      await element.all(by.css('[data-testing="remove-button"]')).map((item) => item.click());
      readingList.length=0;
    }
    await $('[data-testing="reading-list-container"] button').click();
    await $$('[data-testing="want-to-read-button"]').first().click();
    
    await browser.executeScript(`
      const undoButton = document.querySelector('simple-snack-bar button');
      undoButton.click();
    `);

    expect(initialReadingListLength).toEqual(readingList.length);
  });

  it('I should be able to perform undo action on the book removed from reading list', async () => {
    const readingList = await $$('.reading-list-item');
    const initialReadingListLength = 1;
    await $$('[data-testing="want-to-read-button"]').first().click();
    const readingListToggle = $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();
    await $$('[data-testing="remove-button"]').last().click();

    await browser.executeScript(`
      const undoButton = document.querySelector('simple-snack-bar button');    
      undoButton.click();
    `);
    expect(initialReadingListLength).toEqual(readingList.length+1);
  });
});
