// ============================================================
// === COMMAND BUILDER (pure functions, DOM-free) ===
// ============================================================
// Single source of truth for command generation, shell quoting, URL
// validation and storage sanitization. Loaded as a plain classic script
// before app.js so the tool keeps working when opened via file://;
// exported for Node tests.

// ============================================================
// === PRESETS ===
// ============================================================
const PRESETS = {
  'best-video': {
    videoFormat: 'best', resolution: 'best',
    audioOnly: false, embedThumbnail: true, addMetadata: true,
  },
  'hd-mp4': {
    videoFormat: 'mp4', resolution: '1080',
    audioOnly: false, mergeFormat: 'mp4',
    embedThumbnail: false, addMetadata: false,
  },
  'audio-mp3': {
    audioOnly: true, audioFormat: 'mp3', audioQuality: 0,
    videoFormat: 'best',
  },
  'youtube-music-audio': {
    audioOnly: true,
    audioFormat: 'm4a',
    audioQuality: 0,
    embedThumbnail: true,
    addMetadata: true,
    videoFormat: 'best',
  },
  'playlist': {
    videoFormat: 'best', resolution: 'best',
    downloadPlaylist: true, addMetadata: true,
    outputTemplate: '%(playlist_index)s - %(title)s.%(ext)s',
  },
};

// ============================================================
// === STORAGE VALIDATION ===
// ============================================================
const STORAGE_VERSION = 1;
const STORAGE_OPTION_KEYS = [
  'lang',
  'videoFormat',
  'resolution',
  'audioOnly',
  'audioFormat',
  'audioQuality',
  'writeSubs',
  'writeAutoSubs',
  'embedSubs',
  'subLangs',
  'writeThumbnail',
  'embedThumbnail',
  'addMetadata',
  'sponsorBlock',
  'downloadPlaylist',
  'playlistStart',
  'playlistEnd',
  'mergeFormat',
  'outputTemplate',
  'rateLimit',
  'cookiesBrowser',
  'cookiesFileEnabled',
  'cookiesFilePath',
  'multiline',
  'os',
  'activePreset',
];

const STORAGE_ENUMS = {
  lang: ['id', 'en'],
  videoFormat: ['best', 'mp4', 'webm', 'audio-only'],
  resolution: ['best', '2160', '1440', '1080', '720', '480', '360', 'worst'],
  audioFormat: ['m4a', 'mp3', 'opus', 'wav'],
  mergeFormat: [null, 'mp4'],
  cookiesBrowser: ['', 'brave', 'chrome', 'chromium', 'edge', 'firefox', 'opera', 'safari', 'vivaldi'],
  os: ['unix', 'windows-cmd', 'powershell'],
  activePreset: [null, 'best-video', 'hd-mp4', 'audio-mp3', 'youtube-music-audio', 'playlist'],
};

const STORAGE_BOOLEAN_KEYS = [
  'audioOnly',
  'writeSubs',
  'writeAutoSubs',
  'embedSubs',
  'writeThumbnail',
  'embedThumbnail',
  'addMetadata',
  'sponsorBlock',
  'downloadPlaylist',
  'cookiesFileEnabled',
  'multiline',
];

const STORAGE_STRING_LIMITS = {
  subLangs: 80,
  outputTemplate: 160,
  rateLimit: 32,
  cookiesFilePath: 160,
};

const STORAGE_STRING_DEFAULTS = {
  subLangs: 'en,id',
  outputTemplate: '%(title)s.%(ext)s',
  rateLimit: '',
  cookiesFilePath: 'cookie.txt',
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function clampString(value, fallback, maxLength) {
  if (typeof value !== 'string') return fallback;
  return value.slice(0, maxLength);
}

function clampPlaylistIndex(value) {
  if (value === null || value === '' || value === undefined) return null;
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 999999) return null;
  return numeric;
}

function sanitizeStoredOptions(candidate) {
  if (!isPlainObject(candidate)) return {};

  const next = {};
  for (const key of STORAGE_OPTION_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(candidate, key)) continue;
    const value = candidate[key];

    if (STORAGE_BOOLEAN_KEYS.includes(key)) {
      if (typeof value === 'boolean') next[key] = value;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(STORAGE_ENUMS, key)) {
      if (STORAGE_ENUMS[key].includes(value)) next[key] = value;
      continue;
    }

    if (key === 'audioQuality') {
      const numeric = Number(value);
      if (Number.isInteger(numeric) && numeric >= 0 && numeric <= 9) next[key] = numeric;
      continue;
    }

    if (key === 'playlistStart' || key === 'playlistEnd') {
      next[key] = clampPlaylistIndex(value);
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(STORAGE_STRING_LIMITS, key)) {
      next[key] = clampString(value, STORAGE_STRING_DEFAULTS[key], STORAGE_STRING_LIMITS[key]);
    }
  }

  if (next.audioOnly || next.videoFormat !== 'mp4') {
    next.mergeFormat = null;
  }
  if (next.cookiesFileEnabled) {
    next.cookiesBrowser = '';
  }
  if (next.playlistEnd && next.playlistStart && next.playlistEnd < next.playlistStart) {
    next.playlistEnd = null;
  }

  return next;
}

function parseStoredOptions(raw) {
  if (!raw) return {};
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return {};
  }
  if (isPlainObject(parsed) && parsed.version === STORAGE_VERSION && isPlainObject(parsed.options)) {
    return sanitizeStoredOptions(parsed.options);
  }
  // Legacy storage used the options object directly.
  return sanitizeStoredOptions(parsed);
}

function serializeOptionsForStorage(currentState) {
  const options = sanitizeStoredOptions(currentState);
  delete options.url;
  return JSON.stringify({
    version: STORAGE_VERSION,
    options,
  });
}

function sanitizeStoredUrl(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (trimmed.length > 2048) return '';
  return validateUrl(trimmed).valid ? trimmed : '';
}

// ============================================================
// === VALIDATION ===
// ============================================================
const URL_PATTERNS = {
  video:    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]{11}(?:[?&][^\s]*)?$/,
  short:    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{11}(?:[?&][^\s]*)?$/,
  playlist: /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[\w-]+(?:[?&][^\s]*)?$/,
  shortUrl: /^https?:\/\/(www\.)?youtu\.be\/[\w-]{11}(?:[?&][^\s]*)?$/,
  channel:  /^https?:\/\/(www\.)?youtube\.com\/@[\w-]+(?:[?&][^\s]*)?$/,
  music:    /^https?:\/\/music\.youtube\.com\/watch\?v=[\w-]{11}(?:[?&][^\s]*)?$/,
};

function validateUrl(url, lang = 'id') {
  // Pasted URLs commonly carry trailing spaces/newlines; validate the
  // trimmed value so those never fail an otherwise valid URL.
  const candidate = String(url || '').trim();
  if (!candidate) return { valid: false, type: null, message: '' };
  for (const [type, pattern] of Object.entries(URL_PATTERNS)) {
    if (pattern.test(candidate)) {
      // A watch URL can also point at a playlist. Treat it as a playlist so
      // the explicit playlist option is generated instead of silently being
      // left to yt-dlp's default behavior.
      if (['video', 'short', 'shortUrl', 'music'].includes(type)) {
        try {
          if (new URL(candidate).searchParams.has('list')) {
            return { valid: true, type: 'playlist', message: '' };
          }
        } catch (e) {}
      }
      return { valid: true, type, message: '' };
    }
  }
  return {
    valid: false, type: null,
    message: lang === 'en'
      ? 'URL not recognized. Example: youtube.com/watch?v=... or music.youtube.com/watch?v=...'
      : 'URL tidak dikenali. Contoh: youtube.com/watch?v=... atau music.youtube.com/watch?v=...'
  };
}

// ============================================================
// === COMMAND BUILDER (pure functions) ===
// ============================================================
function buildFormatString(options) {
  const { videoFormat, resolution } = options;
  if (resolution === 'worst') {
    return 'bv*+ba[ext=m4a]/b';
  }

  const heightFilter = resolution && resolution !== 'best' ? `[height<=${resolution}]` : '';
  const videoExtFilter = videoFormat === 'mp4' ? '[ext=mp4]' : videoFormat === 'webm' ? '[ext=webm]' : '';
  // Prefer m4a audio so merges stay MP4-compatible (avc/aac). Without this,
  // "best" picks opus/webm and the merged output silently becomes MKV,
  // which also blocks --embed-thumbnail for MP4. WebM mode must filter audio
  // by container too: YouTube serves opus audio as ext=webm, so [ext=opus]
  // never matches and the whole selector fails.
  const audioExtFilter = videoFormat === 'webm' ? '[ext=webm]' : '[ext=m4a]';
  const fallbackFilter = `${heightFilter}${videoExtFilter}`;

  const chain = `bv*${heightFilter}${videoExtFilter}+ba${audioExtFilter}/b${fallbackFilter}`;
  // Terminal /b keeps the chain from dead-ending ("Requested format is not
  // available") when a video has no formats matching the filters at all.
  // Only needed when the fallback branch is itself filtered; a bare b is
  // already the unfiltered last resort.
  return fallbackFilter ? `${chain}/b` : chain;
}

function buildCommand(state) {
  const { url, options } = state;
  const isWindows = options.os === 'windows-cmd' || options.os === 'powershell';
  const parts = [isWindows ? '.\\yt-dlp.exe' : 'yt-dlp'];

  if (options.audioOnly) {
    parts.push('-x');
    parts.push('--audio-format', options.audioFormat || 'mp3');
    if (options.audioQuality !== undefined && options.audioQuality !== null) {
      parts.push('--audio-quality', String(options.audioQuality));
    }
  } else {
    const fmtStr = buildFormatString(options);
    parts.push('-f', fmtStr);
    if (options.resolution === 'worst') {
      parts.push('-S', '+size,+br,+res,+fps');
    }
    if (options.videoFormat === 'mp4' || options.mergeFormat) {
      parts.push('--merge-output-format', 'mp4');
    }
  }

  if (options.writeSubs)     parts.push('--write-subs');
  if (options.writeAutoSubs) parts.push('--write-auto-subs');
  if (options.embedSubs)     parts.push('--embed-subs');
  if (options.writeSubs || options.writeAutoSubs) {
    const langs = options.subLangs || 'en,id';
    parts.push('--sub-langs', langs);
  }

  if (options.writeThumbnail) parts.push('--write-thumbnail');
  if (options.embedThumbnail) parts.push('--embed-thumbnail');
  if (options.addMetadata)    parts.push('--add-metadata');
  if (options.sponsorBlock)   parts.push('--sponsorblock-remove', 'all');

  // Make the playlist choice explicit. This is important for watch URLs that
  // contain both a video id and a playlist id.
  parts.push(options.downloadPlaylist ? '--yes-playlist' : '--no-playlist');

  const tpl = options.outputTemplate || '%(title)s.%(ext)s';
  parts.push('-o', tpl);

  if (options.rateLimit && options.rateLimit.trim()) {
    parts.push('--limit-rate', options.rateLimit.trim());
  }
  // cookies dari browser dan cookies dari file harus saling eksklusif
  if (options.cookiesBrowser && !options.cookiesFileEnabled) {
    parts.push('--cookies-from-browser', options.cookiesBrowser);
  }
  if (options.cookiesFileEnabled) {
    const filePath = (options.cookiesFilePath || '').trim() || 'cookie.txt';
    parts.push('--cookies', filePath);
  }
  if (options.downloadPlaylist && options.playlistStart) {
    parts.push('--playlist-start', String(options.playlistStart));
  }
  if (options.downloadPlaylist && options.playlistEnd) {
    parts.push('--playlist-end', String(options.playlistEnd));
  }

  const safeUrl = (url && url.trim()) ? url.trim() : 'URL';
  parts.push(safeUrl);
  return parts;
}

// Keep arguments raw until the final render so user input cannot provide its
// own shell syntax. Each shell has different quoting rules.
function shellQuote(value, os) {
  const arg = String(value);
  if (os === 'powershell') {
    // PowerShell single-quoted strings are literal; apostrophes are doubled.
    return `'${arg.replace(/'/g, "''")}'`;
  }
  if (os === 'windows-cmd') {
    // cmd.exe treats ^ & | < > literally inside double quotes, so they must
    // NOT be caret-escaped here; escaping corrupts the argument yt-dlp
    // receives (e.g. "height^<=1080"). Newlines cannot survive a single
    // quoted argument and are stripped.
    return `"${arg.replace(/\r?\n/g, '')}"`;
  }
  // POSIX shells: apostrophes are represented by closing and reopening the
  // single-quoted string around an escaped apostrophe.
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

function renderCommandParts(parts, os) {
  const optionNames = new Set([
    '-x', '-f', '-S', '--audio-format', '--audio-quality', '--merge-output-format',
    '--write-subs', '--write-auto-subs', '--embed-subs', '--sub-langs',
    '--write-thumbnail', '--embed-thumbnail', '--add-metadata',
    '--sponsorblock-remove', '--yes-playlist', '--no-playlist', '-o', '--limit-rate', '--cookies-from-browser',
    '--cookies', '--playlist-start', '--playlist-end',
  ]);
  return parts.map((part, index) => {
    // The executable and flags are application constants. Every value,
    // including URL and user-controlled options, must be quoted.
    if (index === 0 || optionNames.has(part)) return part;
    return shellQuote(part, os);
  });
}

function isSafeWindowsCmdInput(options) {
  // CMD expands %NAME% before yt-dlp receives the argument, and a double
  // quote closes the quoted region so trailing text is parsed as cmd syntax.
  // Allow normal percent-encoded URL bytes and yt-dlp's %(field)s output
  // placeholders, but reject any remaining percent/quote/newline from
  // user-controlled fields.
  const url = String(options.url || '').replace(/%[0-9a-fA-F]{2}/g, '');
  const template = String(options.outputTemplate || '').replace(/%\([A-Za-z0-9_.-]+\)[0-9.]*[A-Za-z]/g, '');
  const fields = [url, template, options.subLangs, options.rateLimit, options.cookiesBrowser, options.cookiesFilePath];
  return fields.every(value => !/[%"\r\n]/.test(String(value || '')));
}

function formatCommand(parts, os, multiline) {
  if (!multiline) return parts.join(' ');
  const continuation = os === 'powershell' ? ' `' : os === 'windows-cmd' ? ' ^' : ' \\';
  const [cmd, ...flags] = parts;
  if (!flags.length) return cmd;
  return cmd + continuation + '\n  ' + flags.join(continuation + '\n  ');
}

function syntaxHighlight(parts, os, multiline) {
  parts = renderCommandParts(parts, os);
  const flagParts = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (i === 0) {
      flagParts.push(p); // yt-dlp
    } else if (p === parts[parts.length - 1] && (p.startsWith('"') || p.startsWith("'"))) {
      flagParts.push(`<span class="cmd-url">${escapeHtml(p)}</span>`);
    } else if (p.startsWith('-')) {
      flagParts.push(`<span class="cmd-flag">${escapeHtml(p)}</span>`);
    } else if (p.startsWith('"') || p.startsWith("'")) {
      flagParts.push(`<span class="cmd-value">${escapeHtml(p)}</span>`);
    } else {
      flagParts.push(escapeHtml(p));
    }
  }

  if (!multiline) return flagParts.join(' ');
  const continuation = os === 'powershell' ? ' `' : os === 'windows-cmd' ? ' ^' : ' \\';
  const escSpan = `<span class="cmd-escape">${escapeHtml(continuation.trim())}</span>`;
  const [cmd, ...flags] = flagParts;
  if (!flags.length) return cmd;
  const sep = ` ${escSpan}\n  `;
  return cmd + sep + flags.join(sep);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}



// --- Node test export ---
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRESETS,
    STORAGE_VERSION,
    STORAGE_OPTION_KEYS,
    STORAGE_ENUMS,
    STORAGE_BOOLEAN_KEYS,
    STORAGE_STRING_LIMITS,
    STORAGE_STRING_DEFAULTS,
    isPlainObject,
    clampString,
    clampPlaylistIndex,
    sanitizeStoredOptions,
    parseStoredOptions,
    serializeOptionsForStorage,
    sanitizeStoredUrl,
    URL_PATTERNS,
    validateUrl,
    buildFormatString,
    buildCommand,
    shellQuote,
    renderCommandParts,
    isSafeWindowsCmdInput,
    formatCommand,
    syntaxHighlight,
    escapeHtml,
  };
}
