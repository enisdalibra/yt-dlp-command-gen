# Contributing

Thanks for helping improve yt-dlp Command Generator.

## Development Setup

This project is intentionally small and offline-first. Source files live in `src/`, and the build script produces a single-file `index.html` distribution artifact.

Requirements:
- Modern browser for manual testing
- Node.js >= 18 for automated tests

Run tests:

```bash
npm test
```

Build the single-file app:

```bash
npm run build
```

Optional local server:

```bash
python -m http.server 3000
```

Then open `http://localhost:3000`.

## Contribution Guidelines

- Keep the app static and offline-first. Do not add runtime dependencies, CDN assets, analytics, or network calls unless there is a clear project decision to do so.
- Edit source files in `src/`; do not hand-edit generated distribution output unless you are also updating the source and build flow.
- Preserve command safety. User-controlled values must remain quoted and validated before being copied as a runnable command.
- Keep UI text covered by the `I18N` object for both Indonesian and English.
- Keep localStorage changes versioned and validated.
- Maintain keyboard and screen reader accessibility for new controls.
- Add focused tests for command generation, storage migration, validation, and other pure logic.

## Pull Request Checklist

- `npm test` passes.
- Generated `index.html` is up to date after `npm run build`.
- Manual browser check covers the changed UI flow.
- README is updated when behavior, requirements, storage, or dependencies change.
- No unrelated formatting churn or generated files are included.

## Reporting Issues

When filing an issue, include:
- Browser and operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Example URL shape or options, without sharing private cookies or personal data
