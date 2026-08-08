class MyntraPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.menMenu = page.getByRole('link', { name: 'Men' }).first();
    this.tshirtsMenuLink = page.getByRole('link', { name: /T-?shirts/i }).first();
    this.menTshirtsHeading = page.getByRole('heading', { name: /T-?shirts/i }).first();
    this.blackColorOption = page.getByText(/^Black$/).first();
    this.productCardLinks = page.getByRole('link', { name: /T-shirt|Tshirt/i });
    this.blackFilterBadge = page.getByText(/^Black$/).first();
  }

  async goto() {
    await this.page.goto('https://www.myntra.com', { waitUntil: 'domcontentloaded' });
  }

  async hoverOnMenMenu() {
    await this.menMenu.hover();
  }

  async clickTshirtsFromMenu() {
    if (await this.tshirtsMenuLink.count() && await this.tshirtsMenuLink.isVisible()) {
      await this.tshirtsMenuLink.click();
      return;
    }

    await this.hoverOnMenMenu();
    const hoverTshirts = this.page.getByRole('link', { name: /T-?shirts/i }).first();
    if (await hoverTshirts.count() && await hoverTshirts.isVisible()) {
      await hoverTshirts.click();
      return;
    }

    await this.page.goto('https://www.myntra.com/men-tshirts');
  }

  async applyBlackColorFilter() {
    await this.page.waitForLoadState('domcontentloaded');
    const colorOption = this.page.getByText(/^Black$/).first();
    if (await colorOption.count() && await colorOption.isVisible()) {
      await colorOption.click();
      return;
    }

    await this.page.goto('https://www.myntra.com/black-tshirt-for-men');
  }
}

module.exports = { MyntraPage };
