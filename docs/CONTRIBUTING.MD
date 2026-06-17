# Contributing to Sahaja Yoga Telangana

## Testing Strategy

As a general rule:
*   **Unit Tests**: Test the internal logic (methods/helpers) in isolation.
*   **Integration Tests**: Test the API endpoints and their interaction with the database.
*   **System Tests**: Test the UI flows and user journeys that trigger these APIs in a real browser.

### 1. Unit Tests
*   **What**: Tests individual functions, schemas, or components in isolation (no database).
*   **Real Example**: `tests/unit/contactSchema.test.ts` — Validates that the contact form schema correctly identifies invalid email formats and enforces minimum name lengths.
*   **Command**: `npm run test:unit`

### 2. Integration Tests
*   **What**: Tests the interaction between the application and the database.
*   **Real Example**: `tests/integration/register.test.ts` — Verifies that the registration API successfully creates a user in a temporary MongoDB instance and correctly hashes their password.
*   **Command**: `npm run test:integration`

### 3. System (E2E) Tests
*   **What**: Tests the entire application flow in a real browser.
*   **Real Example**: `tests/system/loginFlow.spec.ts` — Simulates a real user entering credentials on the login page and verifies that they are granted access to the dashboard.
*   **Command**: `npm run test:system`
*   **UI Mode**: `npx playwright test --ui` (to see the browser actions).

## Local Validation (Pre-push Hook)

To prevent broken code from reaching GitHub, we use **Husky** to run local checks:
*   **Trigger**: Automatically runs when you execute `git push`.
*   **What it runs**: Executes the `Unit` and `Integration` test suites (`npm test`).
*   **Result**: If any test fails, your push will be aborted. This saves CI time and ensures the main branch stays stable.

## Configuration
*   **Vitest (Unit/Integration)**: Configured in `vitest.config.ts` and `tests/setup.ts`.
*   **Playwright (System)**: Configured in `playwright.config.ts`.
*   **Environment**: Test variables are managed via `.env.test` and the `playwright.config.ts` webServer block.

## Running Tests Locally
Ensure you have installed dependencies (`npm install`) and have a local MongoDB instance running (for system tests). Use `npm test` to run all Vitest-based tests.
