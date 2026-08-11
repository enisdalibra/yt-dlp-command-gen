const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadCommandBuilder() {
  const appPath = path.join(__dirname, '..', 'src', 'app.js');
  const app = fs.readFileSync(appPath, 'utf8');
  const start = app.indexOf('// === PRESETS ===');
  const end = app.indexOf('// === UI UPDATER ===');

  assert.notEqual(start, -1, 'Cannot find command-builder source start marker');
  assert.notEqual(end, -1, 'Cannot find command-builder source end marker');

  const source = app.slice(start, end);
  const context = {
    URL,
    currentLang: () => 'id',
  };

  vm.runInNewContext(`${source}
globalThis.commandBuilder = {
  buildFormatString,
  buildCommand,
  renderCommandParts,
  formatCommand,
  shellQuote,
  validateUrl,
  parseStoredOptions,
  serializeOptionsForStorage,
  sanitizeStoredUrl,
};
`, context);

  return context.commandBuilder;
}

function baseOptions(overrides = {}) {
  return {
    os: 'unix',
    audioOnly: false,
    audioFormat: 'm4a',
    audioQuality: 0,
    videoFormat: 'best',
    resolution: 'best',
    writeSubs: false,
    writeAutoSubs: false,
    embedSubs: false,
    subLangs: 'en,id',
    writeThumbnail: false,
    embedThumbnail: false,
    addMetadata: false,
    sponsorBlock: false,
    downloadPlaylist: false,
    playlistStart: null,
    playlistEnd: null,
    mergeFormat: null,
    outputTemplate: '%(title)s.%(ext)s',
    rateLimit: '',
    cookiesBrowser: '',
    cookiesFileEnabled: false,
    cookiesFilePath: 'cookie.txt',
    multiline: false,
    ...overrides,
  };
}

function commandParts(overrides = {}) {
  const builder = loadCommandBuilder();
  const url = overrides.url || 'https://youtube.com/watch?v=AAAAAAAAAAA';
  const options = baseOptions(overrides.options || {});
  return builder.buildCommand({ url, options });
}

function assertPlainEqual(actual, expected) {
  assert.deepEqual(JSON.parse(JSON.stringify(actual)), expected);
}

test('buildFormatString uses modern default and resolution selectors', () => {
  const { buildFormatString } = loadCommandBuilder();

  assert.equal(buildFormatString(baseOptions()), 'bv*+ba/b');
  assert.equal(
    buildFormatString(baseOptions({ resolution: '1080' })),
    'bv*[height<=1080]+ba/b[height<=1080]',
  );
  assert.equal(
    buildFormatString(baseOptions({ videoFormat: 'mp4', resolution: '1080' })),
    'bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080][ext=mp4]',
  );
  assert.equal(
    buildFormatString(baseOptions({ videoFormat: 'webm', resolution: '720' })),
    'bv*[height<=720][ext=webm]+ba[ext=opus]/b[height<=720][ext=webm]',
  );
  assert.equal(buildFormatString(baseOptions({ resolution: 'worst' })), 'bv*+ba/b');
});

test('buildCommand generates explicit playlist behavior and output template', () => {
  assertPlainEqual(commandParts(), [
    'yt-dlp',
    '-f',
    'bv*+ba/b',
    '--no-playlist',
    '-o',
    '%(title)s.%(ext)s',
    'https://youtube.com/watch?v=AAAAAAAAAAA',
  ]);

  assertPlainEqual(commandParts({
    url: 'https://youtube.com/playlist?list=PLaaaaaaaaaaaaaaaa',
    options: {
      downloadPlaylist: true,
      playlistStart: 2,
      playlistEnd: 5,
      outputTemplate: '%(playlist_index)s - %(title)s.%(ext)s',
    },
  }), [
    'yt-dlp',
    '-f',
    'bv*+ba/b',
    '--yes-playlist',
    '-o',
    '%(playlist_index)s - %(title)s.%(ext)s',
    '--playlist-start',
    '2',
    '--playlist-end',
    '5',
    'https://youtube.com/playlist?list=PLaaaaaaaaaaaaaaaa',
  ]);
});

test('buildCommand handles MP4, WebM, and lowest video modes', () => {
  assertPlainEqual(commandParts({
    options: { videoFormat: 'mp4', resolution: '1080', mergeFormat: 'mp4' },
  }).slice(0, 6), [
    'yt-dlp',
    '-f',
    'bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080][ext=mp4]',
    '--merge-output-format',
    'mp4',
    '--no-playlist',
  ]);

  assertPlainEqual(commandParts({
    options: { videoFormat: 'webm', resolution: '720' },
  }).slice(0, 4), [
    'yt-dlp',
    '-f',
    'bv*[height<=720][ext=webm]+ba[ext=opus]/b[height<=720][ext=webm]',
    '--no-playlist',
  ]);

  assertPlainEqual(commandParts({
    options: { resolution: 'worst' },
  }).slice(0, 6), [
    'yt-dlp',
    '-f',
    'bv*+ba/b',
    '-S',
    '+size,+br,+res,+fps',
    '--no-playlist',
  ]);
});

test('buildCommand keeps audio-only separate from video options', () => {
  assertPlainEqual(commandParts({
    options: {
      audioOnly: true,
      audioFormat: 'mp3',
      audioQuality: 0,
      videoFormat: 'mp4',
      mergeFormat: 'mp4',
    },
  }).slice(0, 6), [
    'yt-dlp',
    '-x',
    '--audio-format',
    'mp3',
    '--audio-quality',
    '0',
  ]);

  assert.equal(commandParts({
    options: {
      audioOnly: true,
      videoFormat: 'mp4',
      mergeFormat: 'mp4',
    },
  }).includes('--merge-output-format'), false);
});

test('buildCommand makes browser cookies and file cookies mutually exclusive', () => {
  assert.equal(commandParts({
    options: {
      cookiesBrowser: 'chrome',
      cookiesFileEnabled: false,
    },
  }).includes('--cookies-from-browser'), true);

  const fileCookieParts = commandParts({
    options: {
      cookiesBrowser: 'chrome',
      cookiesFileEnabled: true,
      cookiesFilePath: 'cookies/private.txt',
    },
  });

  assert.equal(fileCookieParts.includes('--cookies-from-browser'), false);
  assertPlainEqual(fileCookieParts.slice(-3), [
    '--cookies',
    'cookies/private.txt',
    'https://youtube.com/watch?v=AAAAAAAAAAA',
  ]);
});

test('renderCommandParts quotes user-controlled values for each shell', () => {
  const { renderCommandParts, formatCommand } = loadCommandBuilder();
  const parts = [
    'yt-dlp',
    '-f',
    'bv*+ba/b',
    '-o',
    "%(title)s 'quoted'.%(ext)s",
    'https://youtube.com/watch?v=AAAAAAAAAAA&list=PLbbbbbbbb',
  ];

  assert.equal(
    formatCommand(renderCommandParts(parts, 'unix'), 'unix', false),
    "yt-dlp -f 'bv*+ba/b' -o '%(title)s '\\''quoted'\\''.%(ext)s' 'https://youtube.com/watch?v=AAAAAAAAAAA&list=PLbbbbbbbb'",
  );

  assert.equal(
    formatCommand(renderCommandParts(parts, 'powershell'), 'powershell', false),
    "yt-dlp -f 'bv*+ba/b' -o '%(title)s ''quoted''.%(ext)s' 'https://youtube.com/watch?v=AAAAAAAAAAA&list=PLbbbbbbbb'",
  );
});

test('validateUrl treats watch URLs with list parameter as playlists', () => {
  const { validateUrl } = loadCommandBuilder();

  assertPlainEqual(
    validateUrl('https://youtube.com/watch?v=AAAAAAAAAAA&list=PLbbbbbbbb'),
    { valid: true, type: 'playlist', message: '' },
  );
  assert.equal(validateUrl('not-a-youtube-url').valid, false);
});

test('parseStoredOptions accepts versioned storage and rejects invalid values', () => {
  const { parseStoredOptions } = loadCommandBuilder();
  const raw = JSON.stringify({
    version: 1,
    options: {
      lang: 'en',
      os: 'powershell',
      audioOnly: true,
      audioQuality: 4,
      videoFormat: '<script>',
      resolution: '9999',
      writeSubs: 'yes',
      outputTemplate: '%(title)s.%(ext)s',
      cookiesFileEnabled: true,
      cookiesBrowser: 'chrome',
      playlistStart: 10,
      playlistEnd: 3,
      unexpected: 'ignored',
    },
  });

  assertPlainEqual(parseStoredOptions(raw), {
    lang: 'en',
    audioOnly: true,
    audioQuality: 4,
    outputTemplate: '%(title)s.%(ext)s',
    cookiesFileEnabled: true,
    playlistStart: 10,
    mergeFormat: null,
    cookiesBrowser: '',
    playlistEnd: null,
    os: 'powershell',
  });
});

test('parseStoredOptions migrates legacy storage shape', () => {
  const { parseStoredOptions } = loadCommandBuilder();
  const raw = JSON.stringify({
    videoFormat: 'mp4',
    resolution: '1080',
    mergeFormat: 'mp4',
    multiline: false,
  });

  assertPlainEqual(parseStoredOptions(raw), {
    videoFormat: 'mp4',
    resolution: '1080',
    mergeFormat: 'mp4',
    multiline: false,
  });
  assertPlainEqual(parseStoredOptions('{not json'), {});
});

test('serializeOptionsForStorage writes the versioned shape and sanitized options only', () => {
  const { serializeOptionsForStorage } = loadCommandBuilder();
  const serialized = JSON.parse(serializeOptionsForStorage({
    ...baseOptions(),
    url: 'https://youtube.com/watch?v=AAAAAAAAAAA',
    videoFormat: 'webm',
    resolution: '720',
    audioQuality: 99,
    unknown: true,
  }));

  assert.equal(serialized.version, 1);
  assert.equal(serialized.options.url, undefined);
  assert.equal(serialized.options.unknown, undefined);
  assert.equal(serialized.options.audioQuality, undefined);
  assert.equal(serialized.options.videoFormat, 'webm');
  assert.equal(serialized.options.resolution, '720');
});

test('sanitizeStoredUrl only restores recognized YouTube URLs', () => {
  const { sanitizeStoredUrl } = loadCommandBuilder();

  assert.equal(
    sanitizeStoredUrl(' https://youtube.com/watch?v=AAAAAAAAAAA '),
    'https://youtube.com/watch?v=AAAAAAAAAAA',
  );
  assert.equal(sanitizeStoredUrl('javascript:alert(1)'), '');
  assert.equal(sanitizeStoredUrl('https://example.com/watch?v=AAAAAAAAAAA'), '');
});
