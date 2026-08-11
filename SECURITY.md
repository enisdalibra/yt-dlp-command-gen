# Security Policy

## Supported Versions

This project is a static single-page app. Security fixes are applied to the current `main` branch.

## Reporting a Vulnerability

Please report security issues privately when possible.

Use GitHub's private vulnerability reporting or security advisory flow if it is enabled for this repository. If that is not available, contact the maintainer through the repository owner's public GitHub profile.

Do not include private cookies, tokens, full browser profiles, or other secrets in reports.

## Security Scope

Relevant issues include:
- Generated commands that allow shell injection or unsafe argument handling
- XSS or unsafe HTML rendering
- Unsafe localStorage parsing or migration behavior
- Clipboard behavior that can copy a command different from what is displayed

Out of scope:
- Behavior of `yt-dlp` itself
- Download authorization, copyright, or Terms of Service disputes
- Vulnerabilities in optional local development servers such as `http-server` or `live-server`
