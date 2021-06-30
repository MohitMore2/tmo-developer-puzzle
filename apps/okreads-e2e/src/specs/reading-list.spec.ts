import { $, $$, browser, ExpectedConditions, element, by } from 'protractor';

describe('When: I use the reading list feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    const form = $('form');
    const input = $('input[type="search"]');
    await input.sendKeys('python');
    await form.submit();
  });

  it('Then: I should be able to add book to reading list and able to mark it as finished', async () => {

    const readingListToggle = $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
    const readingList = await $$('.reading-list-item');
    if (readingList.length >= 0) {
      await element
        .all(by.css('[data-testing="removebutton"]'))
        .map((e) => e.click());
    }

    await element(
      by.css('[data-testing="reading-list-container"] button')
    ).click();

    await element
      .all(by.css('[data-testing="want-to-read-button"]'))
      .first()
      .click();

     await readingListToggle.click();

    await browser.executeScript(`
      let markFinishCheckbox = document.querySelector('input[type="checkbox"]');
      markFinishCheckbox.click()
    `);
    const finishedLength = await element.all(
      by.css('[data-testing="checkbox-test"]')
    );
    expect(finishedLength.length).toBeGreaterThan(0, 'finished items list');
  });
});
