# 🎭 pw-mcp-myntra-tests

**AI-agent–driven test automation with Playwright, Playwright MCP and GitHub Copilot custom agents.**

Instead of hand-writing every test, this repo uses three specialised Copilot agents that share one
rulebook ([`AGENTS.md`](AGENTS.md)). The agents explore a live web app, write a numbered test plan,
turn the plan into Playwright tests, and repair tests when the UI changes. A QA engineer reviews
the output at every step.

```
 You (prompt in Copilot Chat)
        │
        ▼
 ┌──────────────┐  specs/<feature>.md  ┌────────────────┐  tests/**/*.spec.js  ┌──────────────┐
 │ 🎭 Planner    │ ───────────────────▶ │ 🎭 Generator    │ ───────────────────▶ │ 🎭 Healer     │
 │ explores app  │                      │ writes tests   │                      │ fixes failing │
 │ read-only     │                      │ verifies live  │ ◀── re-run ───────── │ tests         │
 └──────┬───────┘                      └───────┬────────┘                      └──────┬───────┘
        └──────────────── Playwright MCP server (real browser) ────────────────────────┘
```

---

## Contents

- [What's in the repo](#whats-in-the-repo)
- [The agents](#the-agents)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [How to use the agents (VS Code + Copilot)](#how-to-use-the-agents-vs-code--copilot)
- [Running tests](#running-tests)
- [CI/CD](#cicd)
- [Project rules](#project-rules)
- [Test plans](#test-plans)
- [History](#history)

---

## What's in the repo

```
.github/
  agents/
    playwright-test-planner.agent.md     🎭 explores the app → writes specs/*.md
    playwright-test-generator.agent.md   🎭 turns plan scenarios → Playwright specs
    playwright-test-healer.agent.md      🎭 diagnoses & fixes failing tests
  copilot-instructions.md                rules Copilot applies to every chat
  workflows/
    playwright.yml                       CI: run tests on push / PR
    copilot-setup-steps.yml              environment for the Copilot coding agent
.vscode/mcp.json                         starts the Playwright Test MCP server in VS Code
AGENTS.md                                master rulebook every agent reads first
specs/                                   test plans written by the Planner
tests/seed.spec.js                       seed test — the agents' starting point
playwright.config.js                     Playwright configuration
Dockerfile · Jenkinsfile                 containerised runs & Jenkins pipeline
CHANGELOG.md                             release notes
```

## The agents

Each agent is a Markdown file with a description, an explicit **tool allow-list**, a model, and
strict instructions. Select them from the **agent dropdown in Copilot Chat**.

| Agent | Job | Can | Cannot |
|---|---|---|---|
| **Planner** | Explore the app and produce a numbered Markdown plan | navigate, hover, snapshot, screenshot, read console & network, write `specs/*.md` | write test code, touch files outside `specs/`, click destructive buttons |
| **Generator** | Turn plan scenarios (e.g. `1.1`, `2.3`) into runnable specs | drive the browser to verify each step, read/edit files, run tests in the terminal | invent scenarios, break framework conventions |
| **Healer** | Make failing tests pass *for the right reason* | run & debug tests, inspect the live page, edit tests | weaken assertions, skip tests silently, hide failures with sleeps |

**Why three agents instead of one?** Each has only the tools its job needs. The Planner can't
write code and the Healer can't invent scenarios. Every hand-off is a file (`specs/*.md` →
`tests/*.spec.js`) that a human reviews before the next step.

All agents use `claude-haiku-4-5` by default. Change the `model:` line in an agent file to any
model available in your Copilot model picker.

## Prerequisites

- **Node.js 20+**
- **VS Code 1.105+** with **GitHub Copilot** (Chat + agent mode)
- Git

## Setup

```bash
git clone https://github.com/rawatbuilds/pw-mcp-myntra-tests.git
cd pw-mcp-myntra-tests
npm ci
npx playwright install
```

Then in VS Code:

1. Open the folder.
2. Open `.vscode/mcp.json` and click **Start** above `playwright-test`, or open the Command
   Palette → *MCP: List Servers* → `playwright-test` → Start.
3. Open Copilot Chat (`⌃⌘I` on macOS, `Ctrl+Alt+I` on Windows/Linux). The agents appear in the
   agent dropdown.

## How to use the agents (VS Code + Copilot)

### 1 — Plan: select **playwright-test-planner**

```
Explore https://www.myntra.com: landing page → Men → T-Shirts, then filter by colour Black.
Plan scenarios that validate only black T-shirts are shown.
Save to specs/myntra-men-tshirts-colour-filter.md
```

A browser opens, the agent explores, and a plan lands in `specs/`.
**Review and edit the plan.** This is where QA judgement goes in.

### 2 — Generate: select **playwright-test-generator**

```
Generate tests for scenarios 1.1 and 1.2 from specs/myntra-men-tshirts-colour-filter.md
```

The agent performs each step in a real browser, confirms the locators work, writes the spec under
`tests/`, and runs it.

### 3 — Heal: select **playwright-test-healer**

```
Run the tests in tests/ and fix any failures
```

The healer reports each fix (test · root cause · fix · result). When the *application* is wrong
rather than the test, it says so instead of loosening the assertion.

### 4 — Commit

```bash
git add specs tests
git commit -m "test: add <feature> tests (agent-generated, reviewed)"
git push
```

## Running tests

```bash
npm test                                   # headed, 1 worker, slow-mo (good for demos)
npx playwright test                        # standard run, all browsers in the config
npx playwright test --project=chromium     # one browser
npx playwright test --grep @smoke          # by tag
npx playwright show-report                 # open the HTML report
```

## CI/CD

| Pipeline | File | What it does |
|---|---|---|
| **GitHub Actions** | `.github/workflows/playwright.yml` | On push/PR to `main`: install, run tests, upload the HTML report as an artifact |
| **Copilot coding agent** | `.github/workflows/copilot-setup-steps.yml` | Prepares the environment when an issue is assigned to Copilot on GitHub |
| **Jenkins** | `Jenkinsfile` | Runs inside the official `mcr.microsoft.com/playwright` Docker image and archives the report |
| **Docker** | `Dockerfile` | `docker build -t pw-tests . && docker run --rm pw-tests` |

## Project rules

[`AGENTS.md`](AGENTS.md) is the single source of truth that every agent reads first. Highlights:

- Locator priority: `getByRole` → `getByLabel` → `getByTestId` → `getByText`; CSS/XPath only with PR approval
- Page Object Model: one class per page, no `expect()` inside page objects
- Web-first assertions only; **no** `waitForTimeout` or `waitForSelector`
- Test data lives in `tests/data/`, not inline
- Tags: `@smoke`, `@regression`, `@critical`
- Never skip or comment out failing tests to make CI green

## Test plans

| Plan | Target | Scenarios |
|---|---|---|
| [`specs/naukari-login.md`](specs/naukari-login.md) | Naukri login | 19 scenarios: valid login (email, mobile, OTP), negative cases, session, lockout, password reset, SQLi/XSS, remember-me, social login |

Plans follow a fixed format: target, seed, preconditions, and numbered scenarios with priority,
tags, steps with expected results, assertions, and edge cases. The Generator refers to
scenarios by number.

## History

See [`CHANGELOG.md`](CHANGELOG.md).

| Stage | What changed |
|---|---|
| Initial | Myntra suite generated with Playwright MCP + Copilot agents, CI workflow |
| v1.0.0 | SauceDemo login/inventory suite with POM (`LoginPage`, `InventoryPage`) |
| CI | Jenkins pipeline + Dockerfile running in the Playwright Docker image |
| Current | Agents refined; Naukri login test plan produced by the Planner |

---

**Author:** Rajat Singh Rawat · Senior QA Engineer / SDET · [github.com/rawatbuilds](https://github.com/rawatbuilds)
