import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: Use the search feature', () => {
  it('Then: I should see search results as I am typing', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const input = $('input[type="search"]');
    await input.clear();
    await input.sendKeys('angular');

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(1,'At least one book');
  });
});
