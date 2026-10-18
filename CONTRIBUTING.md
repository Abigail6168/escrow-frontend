# Contributing to Milestone Escrow Frontend

Thank you for your interest in contributing! This document outlines the process for making contributions.

## Getting Started

1. Fork the repository on GitHub
2. Clone your forked repo locally
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

## Making Changes

1. Create a new branch for your feature/fix: `git checkout -b my-feature`
2. Make your changes to the codebase
3. Write tests for new functionality (if applicable)
4. Verify the app runs correctly: `npm run dev`
5. Ensure the code builds: `npm run build`

## Code Style

Follow the project's existing code style and use ESLint to check:
```bash
npm run lint
```

## Submitting Changes

1. Commit your changes with a clear, descriptive message: `git commit -m "feat: add XYZ functionality"`
2. Push your branch to your fork: `git push origin my-feature`
3. Open a pull request (PR) on the main repository
4. Your PR will be reviewed and merged after approval

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub with clear details:
- Steps to reproduce the problem (if bug)
- Expected behavior
- Actual behavior
- System information (Node version, OS, etc.)

## Code of Conduct

We expect all contributors to be respectful and inclusive in their interactions.

## Changelog

PRs labelled `user-facing` must add one line under `[Unreleased]` in `CHANGELOG.md`, using the Keep a Changelog categories (Added, Changed, Fixed, Removed). Internal changes (refactors, CI, tests, docs-only) do not need an entry.

Each production deploy is then recorded under a dated heading using the titles of `user-facing` PRs.

Example: `- Arbitrator evidence list on the dispute page (#557)`
