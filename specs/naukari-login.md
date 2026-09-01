# Test Plan: Naukari Login Workflow

**Target:** https://www.naukari.com/
**Seed:** tests/seed.spec.js
**Date:** 2026-09-01

## Overview
Comprehensive test coverage for the Naukari.com login workflow, including successful login, failed login attempts with various invalid credentials, validation error handling, session management, and security scenarios. This plan covers both email/mobile and OTP-based authentication flows.

## Preconditions
- Naukari.com homepage is accessible and responsive
- Valid test user credentials are available in `tests/data/users.json`
- Browser has JavaScript enabled
- Cookies and local storage are cleared before each test scenario
- No existing active sessions in the browser

## Scenarios

### Scenario 1.1 — Successful Login with Valid Email and Password
- **Priority:** P0
- **Tags:** @smoke @critical
- **Preconditions:** User is on login page, valid email/password credentials exist in test data
- **Steps:**
  1. Navigate to https://www.naukari.com/ — expected: Homepage loads with login option visible
  2. Click on "Login" button/link — expected: Login modal or page appears with email and password fields
  3. Enter valid email in email field — expected: Email is filled without errors
  4. Enter valid password in password field — expected: Password is masked with dots/asterisks
  5. Click "Login" button — expected: Page navigates to dashboard/home page, user is logged in
  6. Verify user profile icon or name is visible in header — expected: User information displayed, confirming authentication
- **Assertions:**
  - Login button is clickable and responds
  - Email field accepts valid email format
  - Password field masks input
  - Navigation to dashboard/profile page occurs
  - User session cookie/token is created
  - User profile/name appears in header
- **Edge cases considered:**
  - Email with uppercase letters (should work)
  - Email with special characters but valid format
  - Very long valid password
  - Rapid consecutive login attempts

### Scenario 1.2 — Successful Login with Valid Mobile Number and Password
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User is on login page, valid mobile number credentials exist
- **Steps:**
  1. Navigate to https://www.naukari.com/ — expected: Homepage loads
  2. Click on "Login" or identify mobile login option — expected: Login form appears with mobile/email toggle option
  3. Switch to mobile number login option (if available) — expected: Field changes to accept mobile number
  4. Enter valid 10-digit mobile number — expected: Mobile number is accepted
  5. Enter valid password — expected: Password field is filled
  6. Click "Login" button — expected: Navigation to dashboard occurs
  7. Verify user is logged in — expected: Dashboard/profile page is displayed
- **Assertions:**
  - Mobile login option is accessible
  - Mobile number field accepts exactly 10 digits
  - Non-numeric characters are rejected or ignored
  - Login succeeds with valid mobile + password
  - Session is established
- **Edge cases considered:**
  - Mobile number with country code (+91)
  - Mobile number with spaces or hyphens
  - Switching between email and mobile toggle

### Scenario 1.3 — Login with OTP-based Authentication
- **Priority:** P1
- **Tags:** @regression @critical
- **Preconditions:** User is on login page, OTP-based login flow is available
- **Steps:**
  1. Navigate to login page — expected: Login options visible
  2. Click on "Login with OTP" or similar option — expected: OTP login flow initiates
  3. Enter valid email or mobile number — expected: Field accepts input
  4. Click "Send OTP" button — expected: OTP is sent, confirmation message appears
  5. Wait for OTP to appear in test data or intercepted request — expected: OTP is available
  6. Enter OTP in verification field — expected: OTP field accepts numeric input
  7. Click "Verify" button — expected: User is authenticated and navigated to dashboard
- **Assertions:**
  - OTP option is available and clickable
  - OTP is sent successfully
  - OTP verification field appears after sending OTP
  - Login completes after valid OTP entry
  - User session is created
- **Edge cases considered:**
  - Expired OTP (if applicable)
  - Resend OTP functionality
  - Wrong OTP entry

### Scenario 2.1 — Login with Invalid Email (Negative Test)
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User is on login page
- **Steps:**
  1. Navigate to login page — expected: Login form is displayed
  2. Enter invalid email format (e.g., "notanemail" without @) — expected: Email field accepts text
  3. Enter any password — expected: Password field accepts input
  4. Click "Login" button — expected: Error message appears, no navigation occurs
- **Assertions:**
  - Invalid email format triggers validation error
  - Error message is displayed clearly
  - Login button does not submit or shows validation before submit
  - No session is created
  - Page remains on login form
- **Edge cases considered:**
  - Email without @ symbol
  - Email without domain
  - Email with multiple @ symbols
  - Spaces in email field
  - Special characters in invalid positions

### Scenario 2.2 — Login with Non-existent Email (Negative Test)
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** Email exists in valid format but is not registered
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Enter valid format email that is not registered — expected: Email field accepts input
  3. Enter any password — expected: Password field accepts input
  4. Click "Login" button — expected: Error message appears indicating user not found
- **Assertions:**
  - Submission succeeds (form validates)
  - Server returns "User not found" or similar error
  - No session is created
  - Login page is displayed again
  - Error message is user-friendly
- **Edge cases considered:**
  - Recently deleted account
  - Deactivated account
  - Account in different region

### Scenario 2.3 — Login with Correct Email but Wrong Password (Negative Test)
- **Priority:** P0
- **Tags:** @smoke @regression
- **Preconditions:** Valid registered email exists in test data
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Enter valid registered email — expected: Email is filled
  3. Enter incorrect password — expected: Password field accepts input
  4. Click "Login" button — expected: Error message appears, authentication fails
- **Assertions:**
  - Form submission succeeds but authentication fails
  - Error message indicates "Invalid credentials" or similar
  - No session/auth token is created
  - User remains on login page
  - Failed login attempt is logged (if tracking exists)
- **Edge cases considered:**
  - Password with similar but wrong characters
  - Password case-sensitive validation
  - Multiple consecutive failed attempts
  - Account lockout after N failed attempts

### Scenario 2.4 — Login with Empty Email Field (Negative Test)
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User is on login page
- **Steps:**
  1. Navigate to login page — expected: Login form is displayed
  2. Leave email field empty — expected: Field remains empty
  3. Enter password — expected: Password field accepts input
  4. Click "Login" button — expected: Validation error appears
- **Assertions:**
  - Form validation prevents submission
  - Error message indicates email is required
  - Login button is disabled or shows error on click
  - No API call is made
- **Edge cases considered:**
  - Only whitespace in email field
  - Focus/blur behavior on empty field
  - Tab navigation through fields

### Scenario 2.5 — Login with Empty Password Field (Negative Test)
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User is on login page
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Enter valid email — expected: Email is filled
  3. Leave password field empty — expected: Password field remains empty
  4. Click "Login" button — expected: Validation error appears
- **Assertions:**
  - Form validation prevents submission
  - Error message indicates password is required
  - No API call is made
  - User remains on login page
- **Edge cases considered:**
  - Only whitespace in password field
  - Pasted empty value
  - Focus state on empty field

### Scenario 2.6 — Login with Both Fields Empty (Negative Test)
- **Priority:** P2
- **Tags:** @regression
- **Preconditions:** User is on login page
- **Steps:**
  1. Navigate to login page — expected: Login form is displayed
  2. Leave both email and password fields empty — expected: Fields remain empty
  3. Click "Login" button — expected: Validation errors appear
- **Assertions:**
  - Form validation prevents submission
  - Error messages appear for both fields or single message
  - Login button does not submit
  - No API call is made
- **Edge cases considered:**
  - First field validation vs second field
  - Error message clarity for multiple field errors

### Scenario 3.1 — Session Persistence After Login
- **Priority:** P1
- **Tags:** @regression @critical
- **Preconditions:** User is logged in successfully
- **Steps:**
  1. Login with valid credentials — expected: User is on dashboard
  2. Navigate away from dashboard (visit another page within Naukari) — expected: Page loads and user remains logged in
  3. Return to dashboard or profile page — expected: User is still logged in without re-entering credentials
- **Assertions:**
  - Session token/cookie is persisted
  - Page refresh does not require re-login
  - Navigation between pages maintains session
  - User identity is maintained across pages
- **Edge cases considered:**
  - Browser tab closure and reopening
  - Multiple tabs open simultaneously
  - Session timeout scenarios

### Scenario 3.2 — Logout and Session Termination
- **Priority:** P1
- **Tags:** @regression @critical
- **Preconditions:** User is logged in
- **Steps:**
  1. User is logged in and on dashboard — expected: User profile visible
  2. Click "Logout" button/option — expected: User is logged out, redirected to homepage or login page
  3. Attempt to navigate directly to profile/dashboard URL — expected: User is redirected to login page
- **Assertions:**
  - Logout button is accessible
  - Session token is cleared
  - User cannot access protected pages without re-login
  - Redirect to login occurs for protected routes
- **Edge cases considered:**
  - Logout during page load
  - Multiple logout attempts
  - Back button after logout

### Scenario 4.1 — Account Lockout After Multiple Failed Login Attempts
- **Priority:** P1
- **Tags:** @security @regression
- **Preconditions:** User has failed login attempts threshold
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Attempt login with wrong password 5 times consecutively — expected: Each attempt fails with error
  3. On 5th or 6th attempt, submit login form — expected: Account lockout message or login blocked
  4. Attempt to login with correct password — expected: Login is still blocked, account remains locked
- **Assertions:**
  - Account is locked after N failed attempts
  - Error message indicates account is locked
  - Correct credentials do not bypass lockout
  - Lockout persists across browser sessions (if applicable)
- **Edge cases considered:**
  - Lockout duration and reset mechanism
  - Unlock via email link
  - Manual unlock option

### Scenario 4.2 — Password Reset Flow
- **Priority:** P1
- **Tags:** @regression @critical
- **Preconditions:** User is on login page and knows registered email
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Click on "Forgot Password" or similar link — expected: Password reset page/modal appears
  3. Enter registered email — expected: Email is accepted
  4. Click "Send Reset Link" or "Request OTP" — expected: Confirmation message appears
  5. Verify reset email/OTP is received (via test data or interception) — expected: Reset link/OTP is available
  6. Click reset link or enter OTP — expected: Password reset form appears
  7. Enter new password and confirm — expected: Passwords are accepted
  8. Submit password change — expected: Success message appears
  9. Login with new password — expected: Login succeeds
- **Assertions:**
  - Forgot password option is accessible
  - Reset email/OTP is sent successfully
  - New password can be set
  - Login succeeds with new password
  - Old password no longer works
- **Edge cases considered:**
  - Expired reset link
  - Resend reset link functionality
  - Password validation rules
  - Password history (cannot reuse old password)

### Scenario 4.3 — Security - SQL Injection Attempt (Negative Test)
- **Priority:** P2
- **Tags:** @security
- **Preconditions:** User is on login page
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Enter SQL injection attempt in email field (e.g., "' OR '1'='1") — expected: Field accepts input
  3. Enter any password — expected: Password accepts input
  4. Click "Login" button — expected: Request is sent, SQL injection is neutralized
- **Assertions:**
  - SQL injection is not executed
  - Application returns normal error response
  - No database error messages are exposed
  - Application remains stable
- **Edge cases considered:**
  - Various SQL injection payloads
  - Encoded injection attempts
  - Comment-based injections

### Scenario 4.4 — Security - XSS Attempt in Login Form (Negative Test)
- **Priority:** P2
- **Tags:** @security
- **Preconditions:** User is on login page
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Enter XSS payload in email field (e.g., "<script>alert('XSS')</script>") — expected: Field accepts input
  3. Click "Login" button — expected: Form submission occurs
  4. Verify no alert is triggered on page — expected: XSS payload is neutralized
- **Assertions:**
  - XSS payload is not executed
  - Script tags are escaped or sanitized
  - Page functions normally
  - No console errors related to script execution
- **Edge cases considered:**
  - Event handler XSS (onclick, onload)
  - Encoded XSS payloads
  - DOM-based XSS vectors

### Scenario 5.1 — Remember Me Functionality
- **Priority:** P2
- **Tags:** @regression
- **Preconditions:** User is on login page
- **Steps:**
  1. Navigate to login page — expected: Login form loads
  2. Identify "Remember Me" checkbox (if available) — expected: Checkbox is visible and unchecked
  3. Enter valid email and password — expected: Fields are filled
  4. Check "Remember Me" checkbox — expected: Checkbox is marked
  5. Click "Login" button — expected: User is logged in
  6. Close browser or clear session manually — expected: Session is cleared
  7. Navigate back to Naukari.com — expected: User may be automatically logged in or email is pre-filled
- **Assertions:**
  - Remember Me checkbox is available and functional
  - Credentials are securely stored after selection
  - User is automatically logged in on return (if enabled)
  - Credentials are cleared when "Remember Me" is unchecked
- **Edge cases considered:**
  - Remember Me on public/shared computer (security consideration)
  - Cookie persistence across browser restarts
  - Remember Me on multiple devices

### Scenario 5.2 — Social Login - Google Sign-In (if available)
- **Priority:** P2
- **Tags:** @regression @integration
- **Preconditions:** Google login option is available, test Google account exists
- **Steps:**
  1. Navigate to login page — expected: Google login button is visible
  2. Click "Login with Google" or similar button — expected: Google OAuth page appears
  3. Enter valid Google credentials — expected: Google login succeeds
  4. Grant permissions if prompted — expected: Permissions are granted
  5. Return to Naukari.com — expected: User is logged in to Naukari with Google account linked
- **Assertions:**
  - Google login option is available and clickable
  - OAuth flow succeeds
  - User account is created or linked correctly
  - Session is established after Google login
- **Edge cases considered:**
  - Account already linked to Google
  - Google login cancellation
  - Multiple Google accounts

### Scenario 5.3 — Social Login - LinkedIn Sign-In (if available)
- **Priority:** P2
- **Tags:** @regression @integration
- **Preconditions:** LinkedIn login option is available, test LinkedIn account exists
- **Steps:**
  1. Navigate to login page — expected: LinkedIn login button is visible
  2. Click "Login with LinkedIn" — expected: LinkedIn OAuth page appears
  3. Authenticate with LinkedIn credentials — expected: LinkedIn login succeeds
  4. Grant permissions for profile data — expected: Permissions dialog appears and is granted
  5. Return to Naukari.com — expected: User profile is auto-filled from LinkedIn data
- **Assertions:**
  - LinkedIn login option is functional
  - OAuth authentication succeeds
  - User profile data is synced from LinkedIn
  - Session is established
- **Edge cases considered:**
  - LinkedIn permission denial
  - Account linking scenarios
  - Profile data conflicts

## Not covered (and why)
- **Two-Factor Authentication (2FA)**: Requires security setup that may not be standard across all Naukari accounts; can be added if 2FA is mandatory
- **Biometric Login**: Browser-specific capability; depends on device support
- **API-only login**: Test focuses on web UI; API testing requires separate scope
- **Payment/subscription gated login**: Out of scope for login workflow; authentication is separate from monetization
- **Login on mobile app**: Out of scope; web login is primary focus
- **Rate limiting detailed testing**: Would require load/stress testing setup
- **Account recovery via registered phone**: Depends on account setup; can be tested separately
- **Admin/staff login**: Different role; may have separate login endpoint
- **Deprecated authentication methods**: Older methods removed from production are not tested
