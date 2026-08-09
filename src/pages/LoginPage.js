class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    // Locator priority: getByRole / getByLabel / getByPlaceholder preferred
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // The app exposes an error container; using a CSS locator with justification
    // because there is no accessible role/label for the error banner.
    this.errorBanner = page.locator('.error-message-container');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Perform login. Returns an InventoryPage instance if navigation occurs, otherwise `this`.
   * NOTE: Page objects do not perform assertions.
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // If navigation to inventory happened return that page object; tests should assert.
    if (this.page.url().includes('/inventory.html')) {
      // Lazy-require to avoid circular imports at module load time.
      const { InventoryPage } = require('./InventoryPage');
      return new InventoryPage(this.page);
    }
    return this;
  }

  async clearFields() {
    await this.usernameInput.fill('');
    await this.passwordInput.fill('');
  }
}

module.exports = { LoginPage };
