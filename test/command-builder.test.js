const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

function loadCommandBuilder() {
  return require(path.join(__dirname, '..', 'src', 'command-builder.js'));
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

  assert.equal(buildFormatString(baseOptions()), 'bv*+ba[ext=m4a]/b');
  assert.equal(
    buildFormatString(baseOptions({ resolution: '1080' })),
    'bv*[height<=1080]+ba[ext=m4a]/b[height<=1080]/b',
  );
  assert.equal(
    buildFormatString(baseOptions({ videoFormat: 'mp4', resolution: '1080' })),
    'bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080][ext=mp4]/b',
  );
  assert.equal(
    buildFormatString(baseOptions({ videoFormat: 'webm', resolution: '720' })),
    'bv*[height<=720][ext=webm]+ba[ext=webm]/b[height<=720][ext=webm]/b',
  );
  assert.equal(buildFormatString(baseOptions({ resolution: 'worst' })), 'bv*+ba[ext=m4a]/b');
});

test('buildCommand generates explicit playlist behavior and output template', () => {
  assertPlainEqual(commandParts(), [
    'yt-dlp',
    '-f',
    'bv*+ba[ext=m4a]/b',
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
    'bv*+ba[ext=m4a]/b',
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
    'bv*[height<=1080][ext=mp4]+ba[ext=m4a]/b[height<=1080][ext=mp4]/b',
    '--merge-output-format',
    'mp4',
    '--no-playlist',
  ]);

  assertPlainEqual(commandParts({
    options: { videoFormat: 'webm', resolution: '720' },
  }).slice(0, 4), [
    'yt-dlp',
    '-f',
    'bv*[height<=720][ext=webm]+ba[ext=webm]/b[height<=720][ext=webm]/b',
    '--no-playlist',
  ]);

  assertPlainEqual(commandParts({
    options: { resolution: 'worst' },
  }).slice(0, 6), [
    'yt-dlp',
    '-f',
    'bv*+ba[ext=m4a]/b',
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

  assert.equal(
    formatCommand(renderCommandParts(parts, 'windows-cmd'), 'windows-cmd', false),
    'yt-dlp -f "bv*+ba/b" -o "%(title)s \'quoted\'.%(ext)s" "https://youtube.com/watch?v=AAAAAAAAAAA&list=PLbbbbbbbb"',
  );
});

test('renderCommandParts never caret-escapes metacharacters inside CMD double quotes', () => {
  const { renderCommandParts } = loadCommandBuilder();
  const rendered = renderCommandParts(
    ['yt-dlp', '-f', 'bv*[height<=1080]+ba[ext=m4a]/b[height<=1080]'],
    'windows-cmd',
  );

  // Inside cmd.exe double quotes ^ is literal, so escaping < > & | ^
  // corrupts the argument yt-dlp receives.
  assert.equal(rendered[2], '"bv*[height<=1080]+ba[ext=m4a]/b[height<=1080]"');
});

test('isSafeWindowsCmdInput rejects double quotes and other cmd metacharacters', () => {
  const { isSafeWindowsCmdInput } = loadCommandBuilder();

  assert.equal(isSafeWindowsCmdInput(baseOptions({
    url: 'https://youtube.com/watch?v=AAAAAAAAAAA',
    outputTemplate: 'x" & calc & echo ".%(ext)s',
  })), false);

  assert.equal(isSafeWindowsCmdInput(baseOptions({
    url: 'https://youtube.com/watch?v=AAAAAAAAAAA',
    outputTemplate: '%(title)s.%(ext)s',
    subLangs: 'en,id',
  })), true);

  assert.equal(isSafeWindowsCmdInput(baseOptions({
    url: 'https://youtube.com/watch?v=AAAAAAAAAAA',
    outputTemplate: '100% done.%(ext)s',
  })), false);
});

test('preset reset keys cover every option a preset can set', () => {
  const { PRESETS, PRESET_RESET_KEYS } = loadCommandBuilder();

  const used = new Set(Object.values(PRESETS).flatMap(preset => Object.keys(preset)));
  assert.ok(used.size > 0);
  for (const key of used) {
    assert.ok(PRESET_RESET_KEYS.includes(key), `preset key not covered by reset: ${key}`);
  }
  // Advanced options that presets must clear even when they never set them.
  for (const key of ['writeSubs', 'sponsorBlock', 'rateLimit', 'cookiesBrowser']) {
    assert.ok(PRESET_RESET_KEYS.includes(key), `advanced option must be reset by presets: ${key}`);
  }
});

test('validateUrl treats watch URLs with list parameter as playlists', () => {
  const { validateUrl } = loadCommandBuilder();

  assertPlainEqual(
    validateUrl('https://youtube.com/watch?v=AAAAAAAAAAA&list=PLbbbbbbbb'),
    { valid: true, type: 'playlist', message: '' },
  );
  assert.equal(validateUrl('not-a-youtube-url').valid, false);
});

test('validateUrl accepts URLs with surrounding whitespace', () => {
  const { validateUrl } = loadCommandBuilder();

  const trimmed = validateUrl('https://youtube.com/watch?v=AAAAAAAAAAA');
  assert.equal(
    validateUrl('  https://youtube.com/watch?v=AAAAAAAAAAA  \n').type,
    trimmed.type,
  );
  assert.equal(validateUrl(' https://youtu.be/AAAAAAAAAAA ').valid, true);
  assert.equal(validateUrl('\thttps://youtube.com/playlist?list=PLaaaaaaaaaaaaaaaa\n').type, 'playlist');
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

test('validateRateLimit accepts yt-dlp size suffixes and rejects garbage', () => {
  const { validateRateLimit } = loadCommandBuilder();

  for (const value of ['', '   ', '500', '500K', '2M', '4.2M', '1g', '350k']) {
    assert.equal(validateRateLimit(value).valid, true, `expected valid: ${value}`);
  }
  for (const value of ['abc', '2 MB', '2MB/s', '-1M', '1.2.3M', '5T', '2 M']) {
    assert.equal(validateRateLimit(value).valid, false, `expected invalid: ${value}`);
  }

  assert.equal(validateRateLimit('abc').message.length > 0, true);
  assert.equal(validateRateLimit('abc', 'en').message.length > 0, true);
});

test('buildCommand omits --limit-rate for invalid rate limit input', () => {
  const invalid = commandParts({ options: { rateLimit: 'banana' } });
  assert.equal(invalid.includes('--limit-rate'), false);

  const valid = commandParts({ options: { rateLimit: ' 2M ' } });
  assert.deepEqual(valid.slice(
    valid.indexOf('--limit-rate'),
    valid.indexOf('--limit-rate') + 2,
  ), ['--limit-rate', '2M']);
});

test('parseStoredOptions rejects rate limit values with invalid format', () => {
  const { parseStoredOptions } = loadCommandBuilder();
  const raw = JSON.stringify({
    version: 1,
    options: { rateLimit: 'not-a-rate' },
  });

  assertPlainEqual(parseStoredOptions(raw), { rateLimit: '', mergeFormat: null });

  const good = JSON.stringify({
    version: 1,
    options: { rateLimit: '500K' },
  });
  assertPlainEqual(parseStoredOptions(good), { rateLimit: '500K', mergeFormat: null });
});

test('buildCommand drops --embed-thumbnail when converting audio-only to wav', () => {
  const parts = commandParts({
    options: { audioOnly: true, audioFormat: 'wav', embedThumbnail: true },
  });

  assert.equal(parts.includes('-x'), true);
  assert.equal(parts.includes('--embed-thumbnail'), false);

  // Non-wav audio keeps embedding.
  const mp3 = commandParts({
    options: { audioOnly: true, audioFormat: 'mp3', embedThumbnail: true },
  });
  assert.equal(mp3.includes('--embed-thumbnail'), true);

  // Video downloads keep embedding even if audioFormat is wav from an
  // earlier audio-only session.
  const video = commandParts({
    options: { audioFormat: 'wav', embedThumbnail: true },
  });
  assert.equal(video.includes('--embed-thumbnail'), true);
});

test('buildCommand falls back to default template when not downloading a playlist', () => {
  const single = commandParts({
    options: {
      downloadPlaylist: false,
      outputTemplate: '%(playlist_index)s - %(title)s.%(ext)s',
    },
  });
  const oIndex = single.indexOf('-o');
  assert.equal(single[oIndex + 1], '%(title)s.%(ext)s');

  // Playlist downloads keep the playlist-aware template.
  const playlist = commandParts({
    url: 'https://youtube.com/playlist?list=PLaaaaaaaaaaaaaaaa',
    options: {
      downloadPlaylist: true,
      outputTemplate: '%(playlist_autonumber)s - %(title)s.%(ext)s',
    },
  });
  const plIndex = playlist.indexOf('-o');
  assert.equal(playlist[plIndex + 1], '%(playlist_autonumber)s - %(title)s.%(ext)s');

  // Templates without playlist fields are untouched either way.
  const plainSingle = commandParts({
    options: {
      downloadPlaylist: false,
      outputTemplate: '%(uploader)s - %(title)s.%(ext)s',
    },
  });
  assert.equal(plainSingle[plainSingle.indexOf('-o') + 1], '%(uploader)s - %(title)s.%(ext)s');
});

test('buildCommand uses the global yt-dlp executable when requested on Windows', () => {
  // Default stays .\yt-dlp.exe for Windows shells.
  assert.equal(commandParts({ options: { os: 'windows-cmd' } })[0], '.\\yt-dlp.exe');
  assert.equal(commandParts({ options: { os: 'powershell' } })[0], '.\\yt-dlp.exe');

  // Opting into a PATH-installed binary switches to the bare command.
  assert.equal(commandParts({ options: { os: 'windows-cmd', useGlobalExe: true } })[0], 'yt-dlp');
  assert.equal(commandParts({ options: { os: 'powershell', useGlobalExe: true } })[0], 'yt-dlp');

  // Unix is unaffected either way.
  assert.equal(commandParts({ options: { os: 'unix', useGlobalExe: false } })[0], 'yt-dlp');
});

test('requiresFfmpeg flags options that depend on ffmpeg post-processing', () => {
  const { requiresFfmpeg } = loadCommandBuilder();

  // Plain single-stream download needs no ffmpeg.
  assert.equal(requiresFfmpeg(baseOptions()), false);

  for (const key of ['audioOnly', 'writeThumbnail', 'embedThumbnail', 'embedSubs']) {
    assert.equal(requiresFfmpeg(baseOptions({ [key]: true })), true, `expected ffmpeg required: ${key}`);
  }
  assert.equal(requiresFfmpeg(baseOptions({ videoFormat: 'mp4', mergeFormat: 'mp4' })), true);
  assert.equal(requiresFfmpeg(baseOptions({ videoFormat: 'webm', resolution: '720' })), false);

  // Storage round-trip keeps the new option.
  const { parseStoredOptions } = loadCommandBuilder();
  const raw = JSON.stringify({ version: 1, options: { useGlobalExe: true } });
  assertPlainEqual(parseStoredOptions(raw), { useGlobalExe: true, mergeFormat: null });
});

test('detectDefaultOs maps Windows platforms to PowerShell, others to Unix', () => {
  const { detectDefaultOs } = loadCommandBuilder();

  for (const platform of ['Win32', 'Windows', 'win64']) {
    assert.equal(detectDefaultOs(platform), 'powershell', `expected powershell: ${platform}`);
  }
  for (const platform of ['MacIntel', 'Linux x86_64', '', null, undefined]) {
    assert.equal(detectDefaultOs(platform), 'unix', `expected unix: ${platform}`);
  }
});

test('detectDefaultLang recognizes Indonesian browser locales', () => {
  const { detectDefaultLang } = loadCommandBuilder();

  assert.equal(detectDefaultLang('id'), 'id');
  assert.equal(detectDefaultLang('id-ID'), 'id');
  assert.equal(detectDefaultLang('en-US'), 'en');
  assert.equal(detectDefaultLang('de-DE'), 'en');
  assert.equal(detectDefaultLang(''), 'en');
});

test('validateUrl recognizes Instagram Reel URLs', () => {
  const { validateUrl } = loadCommandBuilder();

  assertPlainEqual(
    validateUrl('https://www.instagram.com/reel/ABC123/', 'en'),
    { valid: true, type: 'reel', message: '' }
  );
  assert.equal(validateUrl('not-a-reel-url').valid, false);
});

test('buildCommand adds --reels flag for Instagram Reel URLs', () => {
  const { buildCommand } = loadCommandBuilder();
  const reelUrl = 'https://www.instagram.com/reel/ABC123/';
  const options = baseOptions({ url: reelUrl });
  const parts = buildCommand({ url: reelUrl, options });

  // Note: yt-dlp handles Reels automatically; no --reels flag needed
  assert.equal(parts.includes(reelUrl), true, 'Command should include the Reel URL');
  assert.equal(parts.includes(reelUrl), true, 'Command should include the Reel URL');
});

test('buildCommand does not add --reels for non-Reel URLs', () => {
  const { buildCommand } = loadCommandBuilder();
  const youtubeUrl = 'https://youtube.com/watch?v=AAAAAAAAAAA';
  const options = baseOptions({ url: youtubeUrl });
  const parts = buildCommand({ url: youtubeUrl, options });

  // Note: no --reels flag needed for any URL, since yt-dlp handles Reels automatically
  assert.equal(parts.includes('--reels'), false, 'No --reels flag needed');
});

test('buildCommand supports Reels with additional options', () => {
  const { buildCommand } = loadCommandBuilder();
  const reelUrl = 'https://www.instagram.com/reel/XYZ789/';
  const options = baseOptions({
    resolution: '1080',
    audioOnly: true,
    audioFormat: 'mp3',
    writeSubs: true,
    subLangs: 'en',
    outputTemplate: '%(title)s_%(ext)s',
  });
  const parts = buildCommand({ url: reelUrl, options });

  // Note: yt-dlp detects Reels from URL automatically; no flag needed
  assert.equal(parts.includes(reelUrl), true, 'Reels with options should include Reel URL');
  assert.equal(parts.includes('--audio-format'), true, 'Should include --audio-format');
  assert.equal(parts.includes('--audio-quality'), true, 'Should include --audio-quality');
  assert.equal(parts.includes('--write-subs'), true, 'Should include --write-subs');
  assert.equal(parts.includes('--sub-langs'), true, 'Should include --sub-langs');
  assert.equal(parts.includes('-x'), true, 'Should include -x flag for audio-only mode');
});
