class InventoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    // Prefer accessible locators; when not available, use stable attributes.
    this.productList = page.locator('.inventory_list');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async isLoaded() {
    await this.productList.first().waitFor({ state: 'visible' });
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
    const { LoginPage } = require('./LoginPage');
    return new LoginPage(this.page);
  }
}

module.exports = { InventoryPage };
