const { test, expect } = require('@playwright/test');
const { MyntraPage } = require('../src/pages/MyntraPage');

test.describe.serial('Myntra T-shirt browse and filter flow', () => {
  let context;
  let page;
  let myntra;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    myntra = new MyntraPage(page);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Validate landing on Myntra homepage @smoke @regression', async () => {
    await myntra.goto();

    await expect(page).toHaveTitle(/Myntra/i);
    await expect(myntra.menMenu).toBeVisible();
  });

  test('Hover over MEN and validate submenu display @regression', async () => {
    await myntra.goto();

    await myntra.hoverOnMenMenu();
    await expect(myntra.tshirtsMenuLink).toBeVisible();
  });

  test('Click T-shirts and validate T-shirt products are visible @critical', async () => {
    await myntra.goto();

    await myntra.clickTshirtsFromMenu();
    await expect(page).toHaveURL(/(men-)?tshirts/);
    await expect(myntra.menTshirtsHeading).toBeVisible();
    await expect(myntra.productCardLinks.first()).toBeVisible();
  });

  test('Apply Black color filter and validate black T-shirts are shown @critical', async () => {
    await myntra.goto();

    await myntra.clickTshirtsFromMenu();
    await myntra.applyBlackColorFilter();

    await expect(myntra.productCardLinks.first()).toBeVisible();
    await expect(page).toHaveURL(/black/i);
  });
});
