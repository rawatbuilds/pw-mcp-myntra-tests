const { test, expect } = require('../../src/fixtures/base');
const { LoginPage } = require('../../src/pages/LoginPage');
const users = require('../data/users.json');

test.describe('SauceDemo Login', () => {
  test('successful login with standard_user @smoke @critical', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const inventory = await login.login(users.standard_user.username, users.standard_user.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(inventory.productList).toBeVisible();
  });

  test('locked_out_user shows explicit error @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.locked_out_user.username, users.locked_out_user.password);
    const error = login.errorBanner;
    await expect(error).toBeVisible();
    await expect(page).toHaveURL(/.*(?:saucedemo\.com|)\/?$/);
  });

  test('empty username and/or password validation @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await test.step('both fields empty', async () => {
      await login.clearFields();
      await login.login('', '');
      await expect(login.errorBanner).toBeVisible();
    });

    await test.step('username empty', async () => {
      await login.clearFields();
      await login.login('', users.standard_user.password);
      await expect(login.errorBanner).toBeVisible();
    });

    await test.step('password empty', async () => {
      await login.clearFields();
      await login.login(users.standard_user.username, '');
      await expect(login.errorBanner).toBeVisible();
    });
  });

  test('invalid credentials show generic error @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard_user.username, 'wrong_password');
    await expect(login.errorBanner).toBeVisible();
    await login.clearFields();
    await login.login('unknown_user', 'whatever');
    await expect(login.errorBanner).toBeVisible();
  });

  test('login form UI elements and accessibility @regression @accessibility', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.loginButton).toBeVisible();
    // Verify password input is masked
    await expect(login.passwordInput).toHaveAttribute('type', 'password');
  });

  test('logout clears session and returns to Login page @regression', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const inventory = await login.login(users.standard_user.username, users.standard_user.password);
    await inventory.isLoaded();
    const returnedLogin = await inventory.logout();
    await expect(page).toHaveURL(/.*(?:saucedemo\.com|)\/?$/);
    await expect(returnedLogin.usernameInput).toBeVisible();
    // Attempt to navigate back — should require login
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(login.errorBanner).toBeVisible();
  });

  test('security edge cases: long inputs and injection payloads @security', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    const long = 'a'.repeat(2000);
    await login.login(long, long);
    await expect(login.errorBanner).toBeVisible();
    await login.clearFields();
    await login.login("' OR '1'='1", "' OR '1'='1");
    await expect(login.errorBanner).toBeVisible();
  });
});
