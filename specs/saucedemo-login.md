# Test Plan: SauceDemo Login

**Target:** https://www.saucedemo.com
**Seed:** tests/seed.spec.js
**Date:** 2026-08-09

## Overview
This plan covers the Sauce Demo application's Login page. It validates successful authentication for `standard_user`, proper error handling for `locked_out_user`, input validation, UI elements, and session/logout behavior. The plan includes a Page Object Model (POM) design to support scaling.

## Preconditions
- The test runner can access https://www.saucedemo.com
- No authentication state persisted between scenarios (each scenario starts at the Login page)
- Test data available: `standard_user`, `locked_out_user`, password: `secret_sauce`

## Scenarios

### Scenario 1.1 — Successful login with `standard_user`
- **Priority:** P0
- **Tags:** @smoke @regression @critical
- **Preconditions:** Browser is at the Login page (`/`)
- **Steps:**
  1. Fill username with `standard_user` and password with `secret_sauce`, click Login — expected: navigates to inventory page
  2. Wait for product list to be visible — expected: inventory items load
- **Assertions:**
  - URL contains `/inventory.html`
  - Product grid or first product card is visible
  - Header contains the app logo/title
- **Edge cases considered:**
  - Slow network causes delayed load
  - Intermittent flakiness of resource loading

### Scenario 1.2 — Locked out user shows explicit error
- **Priority:** P0
- **Tags:** @regression
- **Preconditions:** Browser at Login page
- **Steps:**
  1. Fill username with `locked_out_user` and password `secret_sauce`, click Login — expected: error shown, stay on login
- **Assertions:**
  - Error banner is visible with text containing "locked out" or the canonical message returned by the app
  - URL remains the login URL (`/`)
- **Edge cases considered:**
  - Error styling not visible in headless mode

### Scenario 1.3 — Empty username and/or password validation
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** Browser at Login page
- **Steps:**
  1. Submit with both fields empty — expected: validation/error displayed
  2. Submit with username only empty — expected: validation/error displayed
  3. Submit with password only empty — expected: validation/error displayed
- **Assertions:**
  - Appropriate error banner or inline message is visible for each case
  - No navigation to inventory occurs
- **Edge cases considered:**
  - Different browsers may surface validation differently

### Scenario 1.4 — Invalid credentials show generic error
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** Browser at Login page
- **Steps:**
  1. Enter known-good username with wrong password, click Login — expected: error visible
  2. Enter unknown username with any password, click Login — expected: error visible
- **Assertions:**
  - Error banner visible and content indicates authentication failure
  - No inventory navigation
- **Edge cases considered:**
  - Account lockout after repeated failures (not covered functionally here)

### Scenario 1.5 — Login form UI elements and accessibility
- **Priority:** P2
- **Tags:** @regression @accessibility
- **Preconditions:** Browser at Login page
- **Steps:**
  1. Verify username input, password input, login button, and error container exist and are interactable
  2. Verify password input has type `password` (masked)
  3. Verify form fields have accessible names/labels for screen readers
- **Assertions:**
  - Each locator is visible and enabled
  - Password field is masked
- **Edge cases considered:**
  - Screen-reader name differences across browsers

### Scenario 1.6 — Logout clears session and returns to Login page
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User successfully logged in (use `standard_user`)
- **Steps:**
  1. From inventory page, open menu and click Logout — expected: redirected to Login page
  2. Attempt to navigate back to `/inventory.html` — expected: redirected or requires login
- **Assertions:**
  - After logout, URL is login page and login form visible
  - Protected inventory requires login again
- **Edge cases considered:**
  - Browser back button behavior and cached pages

### Scenario 1.7 — Security edge cases (injection / long inputs)
- **Priority:** P2
- **Tags:** @security
- **Preconditions:** Browser at Login page
- **Steps:**
  1. Enter very long username and password strings and submit — expected: handled gracefully (error or truncation)
  2. Enter common injection payloads (e.g., `"' OR '1'='1`) — expected: authentication fails and no injection occurs
- **Assertions:**
  - No server errors returned to the UI
  - Proper authentication failure message shown
- **Edge cases considered:**
  - Logging of sensitive inputs (tests must not persist secrets)

## Page Object Model (POM)
Design guidelines: follow project conventions — one class per page, constructor accepts `page`, no assertions in page objects, action methods return `Promise<void>` or next page object.

- `LoginPage`
  - Locators (readonly, defined in constructor):
    - `usernameInput` — selector: `#user-name` or `getByPlaceholder('Username')`
    - `passwordInput` — selector: `#password` or `getByPlaceholder('Password')`
    - `loginButton` — selector: `#login-button` or `getByRole('button', { name: 'Login' })`
    - `errorBanner` — selector: `.error-message-container` or role/aria-live where available
  - Methods:
    - `async goto()` — navigate to `https://www.saucedemo.com/`
    - `async login(username: string, password: string): Promise<InventoryPage | this>` — fills fields and clicks login; returns `InventoryPage` on expected success or `this` if stays on login
    - `async loginExpectingFailure(username: string, password: string): Promise<void>` — helper to perform login and wait for `errorBanner`

- `InventoryPage`
  - Locators:
    - `productList` — main inventory container
    - `menuButton` — the navigation/menu control (for logout)
    - `logoutLink` — the logout element inside the menu
  - Methods:
    - `async isLoaded()` — waits for `productList` visible
    - `async logout(): Promise<LoginPage>` — opens menu and clicks logout, returns `LoginPage`

## Test Data
- `standard_user` / `secret_sauce` — valid login
- `locked_out_user` / `secret_sauce` — locked out account (error expected)
- Additional accounts (for later expansion): `problem_user`, `performance_glitch_user`

## Not covered (and why)
- Add-to-cart, checkout, and payment flows — out of scope for Login-focused plan
- Performance/load tests — separate suite recommended
- Deep accessibility audits — included only basic checks here

---

Generated as a Playwright-friendly high-level plan; the Generator agent will convert scenarios into test files and concrete Playwright selectors.
