# Saga's Scout

Saga's Scout is a standalone, browser-first app for capturing customer conversation insights using the symbol system from Rob Fitzpatrick’s book, *The Mom Test*.

## Why this app exists

This project is inspired by and gives full credit to Rob Fitzpatrick, author of *The Mom Test* — a must-read book for anyone doing customer development, product interviews, or startup validation.

We highly recommend you buy the book and support Rob’s work:
👉 https://momtestbook.com

> This project is not affiliated with, endorsed by, or officially connected to Rob Fitzpatrick or The Mom Test. It is a tribute tool for founders, product teams, and researchers who want to apply the lessons in their own workflows.

## What it does

- 📝 Create text-only notes using Mom Test symbols
- 🔎 Search, filter, and sort insights quickly
- 📜 Track note version history
- 🚪 Local browser authentication with Name + Email
- 🖥️ Offline-capable behavior with browser storage persistence
- 🤝 Local sharing metadata for dashboards and notes

## Features

- Minimal research note editor with emoji-coded categories
- Dashboard organization for related interview notes
- Version history for every note
- Local user sign-in with browser-based persistence
- Export-friendly note and dashboard workflows

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the app locally:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Notes on storage

This standalone version stores data in `localStorage` inside your browser. That means:

- Data persists across refreshes on the same browser and device
- There is no remote sync or server backend
- Shared dashboards and notes are stored locally and are not sent to an external service

## Development notes

The app is based on a Vite + React stack with Tailwind-style components and local storage persistence for data.

### Translations

All user-visible text lives in `src/i18n/locales/en.ts` and is shown through [react-i18next](https://react.i18next.com/) (`useTranslation()`, or `<Trans>` for text with markup). Only English is shipped for now. Keys and their `{{variables}}` are type-checked against the English file, so a missing key or variable fails `npm run typecheck`.

To add a language:

1. Copy `src/i18n/locales/en.ts` to `src/i18n/locales/<code>.ts` and translate the values. Mark the object `satisfies TranslationResource` instead of `as const`; plural forms follow the language (e.g. Hebrew adds `_two`).
2. Register it in `LANGUAGES` in `src/i18n/languages.ts`, with its date-fns locale for relative times.

Text direction (`<html dir>`) and `<html lang>` follow the active language, and dates are formatted for it.

## License

See the `LICENSE` file for more details.
