# yt-dlp Command Generator

A visual web app for generating [yt-dlp](https://github.com/yt-dlp/yt-dlp) commands without memorizing CLI flags. Choose options in the UI, review the generated command, then copy and paste it into your terminal.

> **Offline-first**: no external runtime dependencies. The UI runs from a single `index.html` file.

---

## Running the App

This is a static HTML app. You can open it directly in a browser with no server and no installation step.

### Option 1: Open Directly

```text
Double-click index.html
```

You can also drag and drop `index.html` into a browser window.

### Option 2: Python HTTP Server

Useful when you want to access the app through `localhost` during development.

```bash
python -m http.server 3000

# Then open:
# http://localhost:3000
```

### Option 3: Node.js with npx http-server

Optional local static server.

```bash
npx http-server . -p 3001 --cors -c-1

# Then open:
# http://localhost:3001
```

### Option 4: Live Server

Optional local static server with auto-reload.

```bash
npx live-server --port=3002 --no-browser

# Then open:
# http://localhost:3002
```

### Tests

Tests use Node.js built-in `node:test`, so no additional packages are required.

```bash
npm test
```

### Build

The source is modular under `src/`, while the distributable app remains a single HTML file.

```bash
npm run build
```

This writes:

- `index.html`: the root single-file app for direct browser use
- `dist/index.html`: the same generated single-file app for local release packaging

---

## Requirements

| Requirement | Notes |
|---|---|
| Modern browser | Latest Chrome, Firefox, Edge, or Safari |
| yt-dlp | Required only to run the generated commands |
| Node.js >= 18 | Required only for tests |
| Python or npx tools | Optional, only for a local static server |

### Installing yt-dlp

Full installation guide: [github.com/yt-dlp/yt-dlp/wiki/Installation](https://github.com/yt-dlp/yt-dlp/wiki/Installation)

**Windows portable recommendation:**

Download `yt-dlp.exe` from the [latest release page](https://github.com/yt-dlp/yt-dlp/releases/latest), then run generated commands from the same folder as the `.exe` file.

**Linux / macOS:**

```bash
# pip
pip install yt-dlp

# or Homebrew on macOS
brew install yt-dlp
```

---

## Features

### Video Format and Resolution

- **Best quality**: automatically selects the best available format
- **MP4 / WebM**: filters by video container
- **Audio only**: extracts audio with `-x`
- Resolution presets: 4K, 2K, 1080p, 720p, 480p, 360p, or lowest

### Audio Format

- Audio formats: M4A, MP3, Opus, WAV
- Audio quality slider, where `0` means best and `9` means smallest

### Advanced Options

- **Subtitles**: download, auto-generated subtitles, embed, and language selection
- **Thumbnails**: download or embed thumbnails
- **Metadata**: add metadata to the output file
- **SponsorBlock**: remove sponsor segments
- **Playlist**: download full playlists or a selected range
- **Rate limit**: limit download speed
- **Cookies**: use browser cookies or a `cookie.txt` file
- **Output template**: customize output filenames

### OS Command Format

| OS | Executable | Line continuation |
|---|---|---|
| Unix / macOS | `yt-dlp` | `\` |
| Windows CMD | `.\yt-dlp.exe` | `^` |
| PowerShell | `.\yt-dlp.exe` | `` ` `` |

### Quick Presets

| Preset | Description |
|---|---|
| Best Video | Best quality, automatic format |
| 1080p MP4 | Full HD, high compatibility |
| Audio MP3 | Audio extraction as MP3 |
| YouTube Music Audio | Audio preset for music.youtube.com |
| Playlist | Download an entire playlist |

### UI Features

- English is the default interface language
- Indonesian is available through the language toggle
- Dark mode stored in `localStorage`
- Multiline or single-line command format
- Copy button with visual feedback
- Automatic playlist URL detection
- Real-time YouTube URL validation
- Auto-saved options with localStorage validation and versioning
- Keyboard and screen reader accessibility: focus states, live regions, `aria-pressed`, `role="switch"`, and an inert advanced panel when collapsed

---

## Local Storage

The app stores preferences in `localStorage` so the last selected options survive page reloads.

| Key | Contents |
|---|---|
| `ytdlp-options` | UI options in `{ version, options }` format |
| `ytdlp-last-url` | Last valid YouTube URL |
| `ytdlp-theme` | `light` or `dark` |

Stored options are validated when read. Unknown values, wrong types, invalid URLs, and conflicting option combinations are ignored or reset to safe defaults. Legacy payloads that stored the options object directly are migrated automatically.

---

## Dependencies

### Runtime

There are no JavaScript runtime dependencies, CDN assets, bundlers, frameworks, or build steps. Browsers run the HTML/CSS/JS directly from `index.html`.

Browser APIs used:

- `localStorage` for local preferences
- `navigator.clipboard` with `document.execCommand('copy')` fallback
- `matchMedia('(prefers-color-scheme: dark)')` for the default theme
- `URL` for YouTube URL validation

### Development and Tests

| Dependency | Status | Purpose |
|---|---|---|
| Node.js >= 18 | Required for build and tests | Runs the build script and `node:test` |
| npm | Bundled with Node.js | Runs `build` and `test` scripts |
| Python 3 | Optional | Local static server with `python -m http.server` |
| `http-server` / `live-server` | Optional via `npx` | Local static server during development |

`package.json` does not declare `dependencies` or `devDependencies` because tests use Node.js built-in modules.

---

## Community and License

- License: [MIT](LICENSE)
- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)

---

## Project Structure

```text
yt-dlp-interface/
├── index.html          # Generated single-file distribution app
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── package.json        # Build/test scripts and Node.js engine
├── scripts/
│   └── build.js        # Inlines modular source into single-file HTML
├── src/
│   ├── index.template.html
│   ├── styles.css
│   └── app.js
└── test/
    └── command-builder.test.js
```

Edit files in `src/`, then run `npm run build` to regenerate the single-file `index.html`.

---

## Example Generated Commands

**1080p MP4 with subtitles:**

```bash
yt-dlp \
  -f "bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080][ext=mp4]" \
  --merge-output-format mp4 \
  --write-subs \
  --embed-subs \
  --sub-langs "en,id" \
  -o "%(title)s.%(ext)s" \
  "https://youtube.com/watch?v=..."
```

**Audio MP3 on Windows CMD:**

```cmd
.\yt-dlp.exe -x --audio-format mp3 --audio-quality 0 ^
  -o "%(title)s.%(ext)s" ^
  "https://youtube.com/watch?v=..."
```

**Playlist on PowerShell:**

```powershell
.\yt-dlp.exe `
  -f "bv*+ba/b" `
  --yes-playlist `
  --playlist-start 1 `
  --playlist-end 10 `
  -o "%(playlist_index)s - %(title)s.%(ext)s" `
  "https://youtube.com/playlist?list=..."
```

---

## Notes

- This tool only generates commands. It does not execute downloads.
- Respect copyright and YouTube Terms of Service when using yt-dlp.
- For Windows portable usage, run generated commands from the same folder as `yt-dlp.exe`, or use the full path to the executable.
