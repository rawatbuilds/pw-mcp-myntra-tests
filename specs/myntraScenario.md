# Test Plan: Myntra Scenario

**Target:** https://www.myntra.com
**Seed:** tests/seed.spec.ts
**Date:** 2026-08-06

## Overview
This plan validates the Myntra homepage landing, the Men menu hover behavior, navigation to the Men T-shirts category, application of the Black color filter, and the final product results.

## Preconditions
- Browser can access https://www.myntra.com
- No authentication is required for browsing products
- The Myntra homepage loads successfully with the main navigation visible

## Scenarios

### Scenario 1.1 — Validate landing on Myntra homepage
- **Priority:** P0
- **Tags:** @smoke @regression
- **Preconditions:** The browser is at the Myntra homepage
- **Steps:**
  1. Navigate to https://www.myntra.com — expected: homepage loads successfully
- **Assertions:**
  - The page title contains "Myntra" or the homepage banner is visible
  - The main navigation includes the "Men" menu item
- **Edge cases considered:**
  - Homepage load is slow due to network latency
  - The Men menu item is not visible due to a different viewport or localization

### Scenario 1.2 — Hover over MEN and validate submenu display
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** The user is on the Myntra homepage and main navigation is visible
- **Steps:**
  1. Hover over the "Men" navigation item — expected: the Men submenu or category options appear
- **Assertions:**
  - The Men navigation item is visible and hoverable
  - The submenu reveals a link or option for T-shirts or a related Men category
- **Edge cases considered:**
  - Hover behavior does not trigger on touch-only devices
  - Submenu takes time to appear after hover

### Scenario 1.3 — Select T-shirt category from MEN and validate products
- **Priority:** P0
- **Tags:** @smoke @critical
- **Preconditions:** The Men submenu is visible or the Men category page can be reached directly
- **Steps:**
  1. Click the T-shirt link under Men — expected: navigation to the Men T-shirts category page
  2. Verify the page heading or breadcrumb shows "Men T-shirts" and product results are displayed
- **Assertions:**
  - The current page URL contains "/men-tshirts" or similar category path
  - The page shows product cards or a list of T-shirt items
- **Edge cases considered:**
  - The T-shirt category link is labeled differently or nested under a submenu
  - Product listing is empty due to temporary site issues

### Scenario 1.4 — Apply Black color filter and validate results
- **Priority:** P0
- **Tags:** @regression @critical
- **Preconditions:** The user is on the Men T-shirts category page and filters are visible
- **Steps:**
  1. Expand the Color filter section if required
  2. Select "Black" from the available color filter options — expected: page updates and only black T-shirts are displayed
- **Assertions:**
  - The Black color checkbox or filter option is visible and selectable
  - The product result set updates after filtering
  - Each displayed product card indicates black color or the filter badge shows "Black"
- **Edge cases considered:**
  - The Black filter option is not visible without expanding additional colors
  - Filter application yields no products due to a temporary site or inventory issue

## Not covered (and why)
- Variant-level verification of individual product colors beyond the listing view, because the plan focuses on category-level filtering behavior
- Add-to-cart or checkout flows, because the requested scope is limited to navigation and filter validation
