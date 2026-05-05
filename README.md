# The Mom Notes

The Mom Notes is a standalone, browser-first app for capturing customer conversation insights using the symbol system from Rob Fitzpatrick’s book, *The Mom Test*.

This version is built to run fully in the browser without any Base44 backend. Your notes, dashboards, and sharing metadata are stored locally in the browser, making the app fast, simple, and offline-capable.

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

## License

See the `LICENSE` file for more details.
