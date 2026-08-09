const { test: base, expect } = require('@playwright/test');

// Export the Playwright `test` and `expect` so tests import from `src/fixtures/base`.
// This file is intentionally minimal; add fixtures here later if needed.
module.exports = { test: base, expect };
