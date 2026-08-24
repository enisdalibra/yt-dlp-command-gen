// ============================================================
// === ICONS (string constants — safe to use as innerHTML) ===
// ============================================================
const ICON_SUN = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const ICON_MOON = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
const ICON_CHECK = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICON_CLIP = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M17 4h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2"/><path d="M9 12h6M9 16h4"/></svg>`;
const ICON_X = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;

// ============================================================
// === STATE ===
// ============================================================
const DEFAULT_STATE = {
  lang: 'en',
  url: '',
  urlType: null,
  videoFormat: 'best',
  resolution: 'best',
  audioOnly: false,
  audioFormat: 'm4a',
  audioQuality: 0,
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
  useGlobalExe: false,
  multiline: true,
  os: 'unix',
  activePreset: null,
};

let state = structuredClone(DEFAULT_STATE);

// ============================================================
// === I18N (Indonesia / English) ===
// ============================================================
const I18N = {
  id: {
    brandTagline: 'Generate perintah yt-dlp siap pakai',
    pageTitle: 'yt-dlp Command Generator',
    switchLanguageLabel: 'Ganti bahasa ke English',
    toggleThemeLabel: 'Ganti mode gelap/terang',
    urlSectionLabel: 'URL YouTube',
    urlInputAriaLabel: 'URL YouTube',
    clearUrlLabel: 'Hapus URL',
    presetsSectionLabel: 'Preset cepat',
    presetButtonLabel: presetName => `Terapkan preset ${presetName}`,

    presets: {
      'best-video': { label: 'Video Terbaik', desc: 'Kualitas terbaik, format otomatis' },
      'hd-mp4': { label: '1080p MP4', desc: 'Full HD, kompatibilitas tinggi' },
      'audio-mp3': { label: 'Audio MP3', desc: 'Ekstrak audio, kualitas terbaik' },
      'youtube-music-audio': { label: 'Audio YouTube Music', desc: 'Untuk music.youtube.com' },
      'playlist': { label: 'Playlist', desc: 'Unduh seluruh playlist' },
    },

    formatVideoSectionLabel: 'Format Video',
    videoFormats: {
      best: { label: 'Kualitas Terbaik', desc: 'Otomatis' },
      mp4: { label: 'MP4 Saja', desc: 'ext=mp4' },
      webm: { label: 'WebM Saja', desc: 'ext=webm' },
      'audio-only': { label: 'Audio Saja', desc: '-x flag' },
    },
    resolutionLabel: 'Resolusi',
    resolutions: {
      best: 'Tersedia terbaik',
      2160: '4K (2160p)',
      1440: '2K (1440p)',
      1080: '1080p',
      720: '720p',
      480: '480p',
      360: '360p',
      worst: 'Terendah (hemat kuota)',
    },

    audioFormatSectionLabel: 'Format Audio',
    audioFormatGroupLabel: 'Format Audio',
    audioFormatRadios: {
      m4a: { label: 'M4A', desc: 'Default' },
      mp3: { label: 'MP3', desc: 'Populer' },
      opus: { label: 'Opus', desc: 'Efisien' },
      wav: { label: 'WAV', desc: 'Lossless' },
    },
    audioQualityLabelText: 'Kualitas Audio',
    audioQualityRangeMin: '0 (Terbaik)',
    audioQualityRangeMax: '9 (Terkecil)',
    audioOnlyToggleLabel: 'Ekstrak audio saja',
    audioOnlyToggleAriaLabel: 'Ekstrak audio saja',

    advancedOptionsTitle: 'Opsi Lanjutan',
    advancedOptionsToggleLabel: 'Tampilkan atau sembunyikan opsi lanjutan',
    subtitlesTitle: 'Subtitel',
    thumbnailsTitle: 'Thumbnail',
    extrasTitle: 'Ekstra',
    playlistTitle: 'Playlist',
    networkTitle: 'Jaringan',
    outputTemplateTitle: 'Output Template',

    checkbox: {
      'cb-write-subs': 'Unduh subtitles',
      'cb-auto-subs': 'Subtitles otomatis',
      'cb-embed-subs': 'Sisipkan subtitles',
      'cb-write-thumb': 'Unduh thumbnail',
      'cb-embed-thumb': 'Sisipkan thumbnail',
      'cb-metadata': 'Tambahkan metadata',
      'cb-sponsorblock': 'SponsorBlock',
      'cb-playlist': 'Unduh playlist',
      'cb-cookies-file': 'Cookies dari file cookie.txt',
      'cb-global-exe': 'Gunakan yt-dlp global (sudah di PATH)',
    },

    subtitleLanguagesLabel: 'Bahasa Subtitel',
    playlistRangeLabel: 'Rentang Playlist (opsional)',
    playlistStartLabel: 'Mulai',
    playlistEndLabel: 'Selesai',
    playlistStartAriaLabel: 'Mulai playlist',
    playlistEndAriaLabel: 'Selesai playlist',

    rateLimitLabel: 'Rate limit',
    rateLimitPlaceholder: 'misal: 2M, 500K (kosongkan untuk tanpa limit)',
    rateLimitInvalid: 'Rate limit tidak dikenali. Gunakan angka byte atau suffix K/M/G, misal: 500K, 2M.',
    embedThumbnailWav: '--embed-thumbnail tidak didukung untuk audio WAV. Pilih format audio lain atau gunakan "Download thumbnail".',
    cookiesBrowserLabel: 'Cookies dari Browser',
    noCookiesOption: 'Tidak menggunakan cookies',
    cookiesFilePathLabel: 'Path cookie.txt',

    ffmpegRequiredHint: 'Opsi yang dipilih membutuhkan <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">ffmpeg</code>. Pastikan sudah terinstall dan tersedia di PATH.',
    cookies403Tip: 'Dapatkan error <strong>HTTP 403</strong> atau "Sign in to confirm you\'re not a bot"? YouTube memblokir unduhan tanpa cookies. Aktifkan <strong>Cookies dari Browser</strong> atau cookie.txt di bagian Jaringan.',

    filenameTemplateLabel: 'Template Nama File',
    templatePresetsLabel: 'Preset template nama file',
    osFormatTitle: 'Format OS',
    osCommandFormatLabel: 'Format command untuk OS',
    generatedCommandTitle: 'Perintah yang dihasilkan',
    generatedCommandAriaLabel: 'Perintah yt-dlp yang dihasilkan',
    multilineToggleLabel: 'Ubah format multiline',
    multilineButtonText: 'Multiline',

    hint: {
      'windows-cmd': 'Jalankan di <strong>Command Prompt</strong> dari folder tempat <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">yt-dlp.exe</code> berada. Atau sertakan path lengkap ke file exe.',
      powershell: 'Jalankan di <strong>PowerShell</strong> dari folder tempat <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">yt-dlp.exe</code> berada. Atau sertakan path lengkap ke file exe.',
      unix: 'Paste command di atas ke terminal. Pastikan <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">yt-dlp</code> sudah terinstall di sistem kamu.',
    },

    audioQualityPrefix: 'Kualitas',
    audioQualityBest: 'Terbaik',
    audioQualitySmallest: 'Terkecil',

    toast: {
      presetApplied: presetName => `Preset '${presetName}' diterapkan`,
      copied: 'Command berhasil disalin!',
      copyButtonLabel: 'Salin Perintah',
      copiedButtonLabel: 'Tersalin!',
      dismissLabel: 'Tutup notifikasi',
      unsafeWindowsCmd: 'Command ini mengandung karakter yang tidak aman untuk Windows CMD.',
      enterValidUrl: 'Masukkan URL YouTube yang valid terlebih dahulu.',
      playlistSuggested: 'URL ini juga berisi playlist. Centang "Unduh playlist" jika ingin mengunduh semuanya.',
    },

    footer: {
      copy: '© 2025 yt-dlp Command Generator — Tool ini hanya generate command CLI.',
      install: 'Pastikan yt-dlp sudah terinstall di sistem kamu.',
      docs: 'Dokumentasi',
      installation: 'Instalasi',
      warning: 'Patuhi hak cipta. Tool ini tidak bertanggung jawab atas penggunaan yang melanggar Terms of Service YouTube atau hukum yang berlaku.',
    },
  },

  en: {
    brandTagline: 'Generate ready-to-use yt-dlp commands',
    pageTitle: 'yt-dlp Command Generator',
    switchLanguageLabel: 'Switch language to Bahasa Indonesia',
    toggleThemeLabel: 'Toggle dark/light mode',
    urlSectionLabel: 'YouTube URL',
    urlInputAriaLabel: 'YouTube URL',
    clearUrlLabel: 'Clear URL',
    presetsSectionLabel: 'Quick presets',
    presetButtonLabel: presetName => `Apply ${presetName} preset`,

    presets: {
      'best-video': { label: 'Best Video', desc: 'Best quality, auto format' },
      'hd-mp4': { label: '1080p MP4', desc: 'Full HD, high compatibility' },
      'audio-mp3': { label: 'Audio MP3', desc: 'Extract audio, best quality' },
      'youtube-music-audio': { label: 'YouTube Music Audio', desc: 'Audio for music.youtube.com' },
      'playlist': { label: 'Playlist', desc: 'Download entire playlist' },
    },

    formatVideoSectionLabel: 'Video Format',
    videoFormats: {
      best: { label: 'Best quality', desc: 'Auto' },
      mp4: { label: 'MP4 only', desc: 'ext=mp4' },
      webm: { label: 'WebM only', desc: 'ext=webm' },
      'audio-only': { label: 'Audio only', desc: '-x flag' },
    },
    resolutionLabel: 'Resolution',
    resolutions: {
      best: 'Best available',
      2160: '4K (2160p)',
      1440: '2K (1440p)',
      1080: '1080p',
      720: '720p',
      480: '480p',
      360: '360p',
      worst: 'Lowest (saves quota)',
    },

    audioFormatSectionLabel: 'Audio Format',
    audioFormatGroupLabel: 'Audio Format',
    audioFormatRadios: {
      m4a: { label: 'M4A', desc: 'Default' },
      mp3: { label: 'MP3', desc: 'Popular' },
      opus: { label: 'Opus', desc: 'Efficient' },
      wav: { label: 'WAV', desc: 'Lossless' },
    },
    audioQualityLabelText: 'Audio Quality',
    audioQualityRangeMin: '0 (Best)',
    audioQualityRangeMax: '9 (Smallest)',
    audioOnlyToggleLabel: 'Extract audio only',
    audioOnlyToggleAriaLabel: 'Extract audio only',

    advancedOptionsTitle: 'Advanced Options',
    advancedOptionsToggleLabel: 'Show or hide advanced options',
    subtitlesTitle: 'Subtitles',
    thumbnailsTitle: 'Thumbnails',
    extrasTitle: 'Extras',
    playlistTitle: 'Playlist',
    networkTitle: 'Network',
    outputTemplateTitle: 'Output Template',

    checkbox: {
      'cb-write-subs': 'Download subtitles',
      'cb-auto-subs': 'Auto-generated subtitles',
      'cb-embed-subs': 'Embed subtitles',
      'cb-write-thumb': 'Download thumbnail',
      'cb-embed-thumb': 'Embed thumbnail',
      'cb-metadata': 'Add metadata',
      'cb-sponsorblock': 'SponsorBlock',
      'cb-playlist': 'Download playlist',
      'cb-cookies-file': 'Cookies from cookie.txt file',
      'cb-global-exe': 'Use global yt-dlp (on PATH)',
    },

    subtitleLanguagesLabel: 'Subtitle Languages',
    playlistRangeLabel: 'Playlist range (optional)',
    playlistStartLabel: 'Start',
    playlistEndLabel: 'End',
    playlistStartAriaLabel: 'Playlist start',
    playlistEndAriaLabel: 'Playlist end',

    rateLimitLabel: 'Rate limit',
    rateLimitPlaceholder: 'e.g. 2M, 500K (leave blank for unlimited)',
    rateLimitInvalid: 'Rate limit not recognized. Use bytes or a K/M/G suffix, e.g. 500K, 2M.',
    embedThumbnailWav: '--embed-thumbnail is not supported for WAV audio. Pick another audio format or use "Download thumbnail" instead.',
    cookiesBrowserLabel: 'Cookies from Browser',
    noCookiesOption: 'Do not use cookies',
    cookiesFilePathLabel: 'Path to cookie.txt',

    ffmpegRequiredHint: 'The selected options require <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">ffmpeg</code>. Make sure it is installed and available on your PATH.',
    cookies403Tip: 'Getting <strong>HTTP 403</strong> or "Sign in to confirm you\'re not a bot"? YouTube blocks downloads without cookies. Enable <strong>Cookies from Browser</strong> or cookie.txt in the Network section.',

    filenameTemplateLabel: 'Filename Template',
    templatePresetsLabel: 'Filename template presets',
    osFormatTitle: 'OS Format',
    osCommandFormatLabel: 'OS command format',
    generatedCommandTitle: 'Generated Command',
    generatedCommandAriaLabel: 'Generated yt-dlp command',
    multilineToggleLabel: 'Toggle multiline format',
    multilineButtonText: 'Multiline',

    hint: {
      'windows-cmd': 'Run in <strong>Command Prompt</strong> from the folder where <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">yt-dlp.exe</code> is located. Or provide the full path to the exe file.',
      powershell: 'Run in <strong>PowerShell</strong> from the folder where <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">yt-dlp.exe</code> is located. Or provide the full path to the exe file.',
      unix: 'Paste the command above into your terminal. Make sure <code style="font-family:var(--font-mono);background:var(--bg-input);padding:1px 6px;border-radius:4px;font-size:12px;">yt-dlp</code> is installed on your system.',
    },

    audioQualityPrefix: 'Quality',
    audioQualityBest: 'Best',
    audioQualitySmallest: 'Smallest',

    toast: {
      presetApplied: presetName => `Preset '${presetName}' applied`,
      copied: 'Command copied!',
      copyButtonLabel: 'Copy Command',
      copiedButtonLabel: 'Copied!',
      dismissLabel: 'Dismiss notification',
      unsafeWindowsCmd: 'This command contains characters unsafe for Windows CMD.',
      enterValidUrl: 'Enter a valid YouTube URL first.',
      playlistSuggested: 'This URL also contains a playlist. Tick "Download playlist" to grab everything.',
    },

    footer: {
      copy: '© 2025 yt-dlp Command Generator — This tool only generates CLI commands.',
      install: 'Make sure yt-dlp is installed on your system.',
      docs: 'Documentation',
      installation: 'Installation',
      warning: 'Respect copyright. This tool is not responsible for use that violates YouTube Terms of Service or applicable law.',
    },
  },
};

function currentLang() {
  return state.lang === 'en' ? 'en' : 'id';
}

function applyText(selector, text, attrName) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (attrName) el.setAttribute(attrName, text);
  else el.textContent = text;
}

function setSvgSectionLabelText(selector, text) {
  const el = document.querySelector(selector);
  if (!el) return;
  const svg = el.querySelector('svg');
  if (!svg) {
    el.textContent = text;
    return;
  }
  const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
  if (textNode) textNode.textContent = ' ' + text + ' ';
  else el.appendChild(document.createTextNode(' ' + text + ' '));
}

function setRadioText(groupId, value, label, desc) {
  const radio = document.querySelector(`#${groupId} input[value="${value}"]`);
  if (!radio) return;
  const opt = radio.closest('label');
  if (!opt) return;
  const labelEl = opt.querySelector('.radio-label');
  const descEl = opt.querySelector('.radio-desc');
  if (labelEl) labelEl.textContent = label;
  if (descEl) descEl.textContent = desc;
}

function setCheckboxText(checkboxId, text) {
  const cb = document.getElementById(checkboxId);
  if (!cb) return;
  const item = cb.closest('label');
  if (!item) return;
  const labelEl = item.querySelector('.checkbox-label');
  if (labelEl) labelEl.textContent = text;
}

function setAdvancedTitle(checkboxId, text) {
  const cb = document.getElementById(checkboxId);
  if (!cb) return;
  const section = cb.closest('.advanced-section');
  if (!section) return;
  const title = section.querySelector('.advanced-section-title');
  if (title) title.textContent = text;
}

function applyLanguage(lang = currentLang()) {
  const t = I18N[lang] || I18N.id;
  document.documentElement.lang = lang;
  document.title = t.pageTitle;

  // Header
  const tagline = document.querySelector('.brand-tagline');
  if (tagline) tagline.textContent = t.brandTagline;

  const urlSectionLabel = document.querySelector('#url-section > label.section-label');
  if (urlSectionLabel) {
    const textNode = Array.from(urlSectionLabel.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
    if (textNode) textNode.textContent = ' ' + t.urlSectionLabel + ' ';
  }
  applyText('#url-input', t.urlInputAriaLabel, 'aria-label');
  const clearUrlBtn = document.getElementById('clear-url-btn');
  if (clearUrlBtn) {
    clearUrlBtn.title = t.clearUrlLabel;
    clearUrlBtn.setAttribute('aria-label', t.clearUrlLabel);
  }

  // Language toggle button text
  const langBtn = document.getElementById('lang-btn');
  const langIcon = document.getElementById('lang-icon');
  if (langIcon) langIcon.textContent = lang === 'en' ? 'EN' : 'ID';
  if (langBtn) {
    langBtn.title = t.switchLanguageLabel;
    langBtn.setAttribute('aria-label', t.switchLanguageLabel);
  }
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.title = t.toggleThemeLabel;
    themeBtn.setAttribute('aria-label', t.toggleThemeLabel);
  }

  // Presets
  const presetsSection = document.getElementById('presets-section');
  if (presetsSection) presetsSection.setAttribute('aria-label', t.presetsSectionLabel);
  Object.entries(t.presets).forEach(([presetId, info]) => {
    const btn = document.querySelector(`#presets-section .preset-btn[data-preset="${presetId}"]`);
    if (!btn) return;
    const lbl = btn.querySelector('.preset-label');
    const desc = btn.querySelector('.preset-desc');
    if (lbl) lbl.textContent = info.label;
    if (desc) desc.textContent = info.desc;
    btn.setAttribute('aria-label', t.presetButtonLabel(info.label));
  });

  // Format video
  setSvgSectionLabelText('#format-card .section-label', t.formatVideoSectionLabel);
  setRadioText('video-format-group', 'best', t.videoFormats.best.label, t.videoFormats.best.desc);
  setRadioText('video-format-group', 'mp4', t.videoFormats.mp4.label, t.videoFormats.mp4.desc);
  setRadioText('video-format-group', 'webm', t.videoFormats.webm.label, t.videoFormats.webm.desc);
  setRadioText('video-format-group', 'audio-only', t.videoFormats['audio-only'].label, t.videoFormats['audio-only'].desc);

  applyText('#resolution-section label[for="resolution-select"]', t.resolutionLabel);
  Object.entries(t.resolutions).forEach(([val, text]) => {
    const opt = document.querySelector(`#resolution-select option[value="${val}"]`);
    if (opt) opt.textContent = text;
  });

  // Format audio
  setSvgSectionLabelText('#audio-card .section-label', t.audioFormatSectionLabel);
  const audioCardSecondaryLabel = document.getElementById('audio-format-group-label');
  if (audioCardSecondaryLabel) audioCardSecondaryLabel.textContent = t.audioFormatGroupLabel;

  setRadioText('audio-format-group', 'm4a', t.audioFormatRadios.m4a.label, t.audioFormatRadios.m4a.desc);
  setRadioText('audio-format-group', 'mp3', t.audioFormatRadios.mp3.label, t.audioFormatRadios.mp3.desc);
  setRadioText('audio-format-group', 'opus', t.audioFormatRadios.opus.label, t.audioFormatRadios.opus.desc);
  setRadioText('audio-format-group', 'wav', t.audioFormatRadios.wav.label, t.audioFormatRadios.wav.desc);

  // Slider labels
  const sliderLabels = document.querySelectorAll('#audio-card .slider-labels span');
  if (sliderLabels && sliderLabels.length >= 2) {
    sliderLabels[0].textContent = t.audioQualityRangeMin;
    sliderLabels[1].textContent = t.audioQualityRangeMax;
  }
  const aqInput = document.getElementById('audio-quality-slider');
  if (aqInput) {
    const fg = aqInput.closest('.form-group');
    const label = fg ? fg.querySelector('label') : null;
    if (label) label.textContent = t.audioQualityLabelText;
  }
  const toggleLabel = document.querySelector('#audio-only-toggle .toggle-label');
  if (toggleLabel) toggleLabel.textContent = t.audioOnlyToggleLabel;
  const audioOnlyToggle = document.getElementById('audio-only-toggle');
  if (audioOnlyToggle) audioOnlyToggle.setAttribute('aria-label', t.audioOnlyToggleAriaLabel);

  // Advanced header and sections
  setSvgSectionLabelText('#advanced-toggle .section-label', t.advancedOptionsTitle);
  const advancedToggle = document.getElementById('advanced-toggle');
  if (advancedToggle) advancedToggle.setAttribute('aria-label', t.advancedOptionsToggleLabel);
  applyText('#playlist-range-label', t.playlistRangeLabel);
  const subLangInput = document.getElementById('sub-langs-input');
  if (subLangInput) subLangInput.setAttribute('aria-label', t.subtitleLanguagesLabel);

  setAdvancedTitle('cb-write-subs', t.subtitlesTitle);
  setAdvancedTitle('cb-write-thumb', t.thumbnailsTitle);
  setAdvancedTitle('cb-metadata', t.extrasTitle);
  setAdvancedTitle('cb-playlist', t.playlistTitle);
  setAdvancedTitle('rate-limit-input', t.networkTitle);
  setAdvancedTitle('output-template-input', t.outputTemplateTitle);
  const osSectionTitle = document.querySelector('.pill-group[role="group"]')?.closest('.advanced-section')?.querySelector('.advanced-section-title');
  if (osSectionTitle) osSectionTitle.textContent = t.osFormatTitle;

  // Checkbox labels
  Object.entries(t.checkbox).forEach(([cbId, text]) => setCheckboxText(cbId, text));

  // Subtitles languages label
  applyText('label[for="sub-langs-input"]', t.subtitleLanguagesLabel);
  applyText('label[for="playlist-start"]', t.playlistStartLabel);
  applyText('label[for="playlist-end"]', t.playlistEndLabel);
  applyText('#playlist-start', t.playlistStartAriaLabel, 'aria-label');
  applyText('#playlist-end', t.playlistEndAriaLabel, 'aria-label');

  // Rate limit & cookies labels
  applyText('label[for="rate-limit-input"]', t.rateLimitLabel);
  const rateLimit = document.getElementById('rate-limit-input');
  if (rateLimit) {
    rateLimit.placeholder = t.rateLimitPlaceholder;
    rateLimit.setAttribute('aria-label', t.rateLimitLabel);
  }
  applyText('label[for="cookies-browser-select"]', t.cookiesBrowserLabel);
  const noCookiesOption = document.querySelector('#cookies-browser-select option[value=""]');
  if (noCookiesOption) noCookiesOption.textContent = t.noCookiesOption;
  applyText('label[for="cookies-file-input"]', t.cookiesFilePathLabel);
  applyText('label[for="output-template-input"]', t.filenameTemplateLabel);
  applyText('#cookies-browser-select', t.cookiesBrowserLabel, 'aria-label');
  applyText('#cookies-file-input', t.cookiesFilePathLabel, 'aria-label');
  applyText('#output-template-input', t.filenameTemplateLabel, 'aria-label');
  const templateChips = document.querySelector('.template-chips');
  if (templateChips) templateChips.setAttribute('aria-label', t.templatePresetsLabel);
  const osGroup = document.querySelector('.pill-group[role="group"]');
  if (osGroup) osGroup.setAttribute('aria-label', t.osCommandFormatLabel);

  // Output card
  applyText('#output-card h2', t.generatedCommandTitle);
  applyText('#command-output', t.generatedCommandAriaLabel, 'aria-label');
  const fmtBtn = document.getElementById('format-toggle-btn');
  if (fmtBtn) {
    fmtBtn.setAttribute('aria-label', t.multilineToggleLabel);
    fmtBtn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          ${t.multilineButtonText}`;
  }
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.innerHTML = ICON_CLIP + ' ' + t.toast.copyButtonLabel;
    copyBtn.setAttribute('aria-label', t.toast.copyButtonLabel);
  }
  applyFooterLanguage(t);

  // URL validation text (agar sesuai bahasa)
  const urlInput = document.getElementById('url-input');
  const msgEl = document.getElementById('url-validation-msg');
  if (urlInput && msgEl) {
    const val = state.url || '';
    if (!val.trim()) {
      urlInput.classList.remove('error');
      msgEl.textContent = '';
      showUrlMeta(null);
    } else {
      const vr = validateUrl(val, currentLang());
      if (vr.valid) {
        urlInput.classList.remove('error');
        msgEl.textContent = '';
        showUrlMeta(vr.type);
      } else {
        urlInput.classList.add('error');
        msgEl.textContent = vr.message;
        showUrlMeta(null);
      }
    }
  }
}

function applyFooterLanguage(t) {
  const copy = document.getElementById('footer-copy-main');
  if (copy) copy.textContent = t.footer.copy;
  const install = document.getElementById('footer-install-note');
  if (install) install.textContent = t.footer.install;
  const docs = document.getElementById('footer-docs-link');
  if (docs) docs.textContent = t.footer.docs;
  const installation = document.getElementById('footer-install-link');
  if (installation) installation.textContent = t.footer.installation;
  const warning = document.getElementById('footer-warning');
  if (warning) warning.textContent = t.footer.warning;
}

// ============================================================
// === COMMAND BUILDER ===
// ============================================================
// buildFormatString, buildCommand, shellQuote, renderCommandParts,
// formatCommand, syntaxHighlight, escapeHtml, validateUrl and the storage
// sanitizers live in src/command-builder.js (inlined by scripts/build.js).

function canCopyCommand() {
  const urlResult = validateUrl(state.url || '');
  if (!urlResult.valid) return false;
  return state.os !== 'windows-cmd' || isSafeWindowsCmdInput(state);
}

// ============================================================
// === UI UPDATER ===
// ============================================================
function updateUI() {
  const options = { ...state };
  const parts = buildCommand({ url: state.url, options });
  const rawCommand = formatCommand(renderCommandParts(parts, state.os), state.os, state.multiline);
  const highlighted = syntaxHighlight(parts, state.os, state.multiline);
  const t = I18N[currentLang()];

  // Update command display
  document.getElementById('command-code').innerHTML = highlighted;

  // OS badge
  const osBadge = document.getElementById('os-badge');
  const osLabels = { 'unix': 'Unix', 'windows-cmd': 'CMD', 'powershell': 'PowerShell' };
  osBadge.textContent = osLabels[state.os] || 'Unix';

  // Format toggle button label
  const fmtBtn = document.getElementById('format-toggle-btn');
  fmtBtn.setAttribute('aria-pressed', String(state.multiline));

  // The copy button stays clickable so the click handler can explain WHY a
  // command cannot be copied instead of being a silently dead control.
  const copyBtn = document.getElementById('copy-btn');
  copyBtn.setAttribute('aria-label', t.toast.copyButtonLabel);

  // Inline safety warning for windows-cmd output whose user-controlled
  // values contain characters cmd.exe would parse as syntax (% " newline).
  // The command stays visible for inspection but must not be pasted.
  const cmdUnsafe = state.os === 'windows-cmd' && !isSafeWindowsCmdInput(state);
  const warnEl = document.getElementById('cmd-safety-warning');
  if (warnEl) {
    warnEl.hidden = !cmdUnsafe;
    if (cmdUnsafe) warnEl.textContent = t.toast.unsafeWindowsCmd;
  }

  // Free-text rate limit: show an inline error for values yt-dlp would
  // reject; the builder already omits --limit-rate for them.
  const rateInput = document.getElementById('rate-limit-input');
  const rateMsg = document.getElementById('rate-limit-validation-msg');
  if (rateInput && rateMsg) {
    const vr = validateRateLimit(state.rateLimit || '', currentLang());
    rateInput.classList.toggle('error', !vr.valid);
    rateMsg.textContent = vr.valid ? '' : vr.message;
  }

  // Embedding cover art is impossible in WAV containers, so the checkbox is
  // disabled and any stale checked state is explained instead of silently
  // dropped from the generated command.
  const embedThumbBlocked = state.audioOnly && state.audioFormat === 'wav';
  const embedThumbCb = document.getElementById('cb-embed-thumb');
  if (embedThumbCb) {
    embedThumbCb.disabled = embedThumbBlocked;
    embedThumbCb.setAttribute('aria-disabled', String(embedThumbBlocked));
  }
  const embedWarn = document.getElementById('embed-thumb-warning');
  if (embedWarn) {
    const showEmbedWarn = embedThumbBlocked && !!state.embedThumbnail;
    embedWarn.hidden = !showEmbedWarn;
    if (showEmbedWarn) embedWarn.textContent = t.embedThumbnailWav;
  }

  // The global-exe choice only changes the command on Windows shells.
  const globalExeGroup = document.getElementById('global-exe-group');
  if (globalExeGroup) globalExeGroup.hidden = state.os === 'unix';

  // Contextual hints below the generated command: ffmpeg requirement and
  // the cookies/403 bot-detection tip when no cookie source is active.
  const ffmpegHint = document.getElementById('ffmpeg-hint');
  if (ffmpegHint) {
    const needsFfmpeg = requiresFfmpeg(state);
    ffmpegHint.hidden = !needsFfmpeg;
    if (needsFfmpeg) ffmpegHint.innerHTML = t.ffmpegRequiredHint;
  }
  const cookiesTip = document.getElementById('cookies-tip');
  if (cookiesTip) {
    const noCookies = !state.cookiesBrowser && !state.cookiesFileEnabled;
    cookiesTip.hidden = !noCookies;
    if (noCookies) cookiesTip.innerHTML = t.cookies403Tip;
  }

  // Resolution section visibility
  const resSection = document.getElementById('resolution-section');
  if (state.audioOnly || state.videoFormat === 'audio-only') {
    resSection.classList.add('hidden');
    resSection.setAttribute('aria-hidden', 'true');
    document.getElementById('resolution-select').disabled = true;
  } else {
    resSection.classList.remove('hidden');
    resSection.setAttribute('aria-hidden', 'false');
    document.getElementById('resolution-select').disabled = false;
  }

  // Playlist range visibility
  const plRange = document.getElementById('playlist-range-section');
  const playlistStartInput = document.getElementById('playlist-start');
  const playlistEndInput = document.getElementById('playlist-end');
  if (state.downloadPlaylist) {
    plRange.classList.remove('hidden');
    plRange.setAttribute('aria-hidden', 'false');
    playlistStartInput.disabled = false;
    playlistEndInput.disabled = false;
    playlistStartInput.setAttribute('aria-disabled', 'false');
    playlistEndInput.setAttribute('aria-disabled', 'false');
  } else {
    plRange.classList.add('hidden');
    plRange.setAttribute('aria-hidden', 'true');
    playlistStartInput.disabled = true;
    playlistEndInput.disabled = true;
    playlistStartInput.setAttribute('aria-disabled', 'true');
    playlistEndInput.setAttribute('aria-disabled', 'true');
  }

  // Audio quality label
  const aq = state.audioQuality;
  const qualLabel = aq === 0 ? t.audioQualityBest : aq === 9 ? t.audioQualitySmallest : `${aq}`;
  document.getElementById('audio-quality-label').textContent = `${t.audioQualityPrefix}: ${aq} (${qualLabel})`;
  document.getElementById('audio-quality-slider').setAttribute('aria-valuetext', `${aq} (${qualLabel})`);

  // Hint text — menyesuaikan OS
  const hintEl = document.getElementById('command-hint');
  const osKey = state.os === 'windows-cmd' ? 'windows-cmd' : state.os === 'powershell' ? 'powershell' : 'unix';
  hintEl.innerHTML = t.hint[osKey];

  // Save to localStorage
  saveOptions();

  // Store raw command for clipboard
  document.getElementById('command-output').dataset.raw = rawCommand;
}

function updateRadioStyles(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.radio-option').forEach(opt => {
    const radio = opt.querySelector('input[type="radio"]');
    opt.classList.toggle('selected', radio && radio.checked);
  });
}

function updateCheckboxStyle(el) {
  const cb = el.querySelector('input[type="checkbox"]');
  el.classList.toggle('checked', cb && cb.checked);
}

// ============================================================
// === TOAST SYSTEM ===
// ============================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');

  const msg = document.createElement('span');
  msg.textContent = message; // XSS safe

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-icon';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', I18N[currentLang()].toast.dismissLabel);
  closeBtn.innerHTML = ICON_X;
  closeBtn.addEventListener('click', () => dismissToast(toast));

  toast.appendChild(msg);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  setTimeout(() => dismissToast(toast), 3000);
}

function dismissToast(toast) {
  if (!toast.parentNode) return;
  toast.style.animation = 'slideOut 0.3s ease-out forwards';
  toast.addEventListener('animationend', () => toast.remove(), { once: true });
}

// ============================================================
// === DARK MODE ===
// ============================================================
function initTheme() {
  let stored;
  try { stored = localStorage.getItem('ytdlp-theme'); } catch(e) {}
  const system = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = ['dark', 'light'].includes(stored) ? stored : (system ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ytdlp-theme', next); } catch(e) {}
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  icon.innerHTML = theme === 'dark' ? ICON_SUN : ICON_MOON;
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  }
}

// ============================================================
// === LOCALSTORAGE ===
// ============================================================
const STORAGE_KEYS = {
  url:     'ytdlp-last-url',
  options: 'ytdlp-options',
  theme:   'ytdlp-theme',
};

function saveOptions() {
  try {
    localStorage.setItem(STORAGE_KEYS.options, serializeOptionsForStorage(state));
    const safeUrl = sanitizeStoredUrl(state.url);
    if (safeUrl) localStorage.setItem(STORAGE_KEYS.url, safeUrl);
    else localStorage.removeItem(STORAGE_KEYS.url);
  } catch(e) {}
}

function loadOptions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.options);
    if (saved) {
      Object.assign(state, parseStoredOptions(saved));
    }
    const savedUrl = localStorage.getItem(STORAGE_KEYS.url);
    const safeUrl = sanitizeStoredUrl(savedUrl);
    if (safeUrl) state.url = safeUrl;

    // Drop the legacy preset-only merge flag when it no longer matches the
    // selected format. This also repairs values written by older versions.
    if (state.audioOnly || state.videoFormat !== 'mp4') {
      state.mergeFormat = DEFAULT_STATE.mergeFormat;
    }
  } catch(e) {}
}

// ============================================================
// === SYNC UI FROM STATE ===
// ============================================================
function syncUIFromState() {
  // URL
  const urlInput = document.getElementById('url-input');
  urlInput.value = state.url || '';
  toggleClearBtn(state.url);
  if (state.url) {
    const vr = validateUrl(state.url, currentLang());
    showUrlMeta(vr.type);
  }

  // Video format radios
  document.querySelectorAll('input[name="videoFormat"]').forEach(r => {
    const val = state.audioOnly ? 'audio-only' : state.videoFormat;
    r.checked = (r.value === val);
  });
  updateRadioStyles('video-format-group');

  // Resolution
  const resEl = document.getElementById('resolution-select');
  resEl.value = state.resolution || 'best';

  // Audio format radios
  document.querySelectorAll('input[name="audioFormat"]').forEach(r => {
    r.checked = (r.value === state.audioFormat);
  });
  updateRadioStyles('audio-format-group');

  // Audio quality
  document.getElementById('audio-quality-slider').value = state.audioQuality || 0;

  // Audio only toggle
  const aoTrack = document.getElementById('audio-only-track');
  aoTrack.classList.toggle('active', !!state.audioOnly);
  const aoToggle = document.getElementById('audio-only-toggle');
  if (aoToggle) aoToggle.setAttribute('aria-checked', String(!!state.audioOnly));

  // Checkboxes
  setCheckbox('cb-write-subs',  state.writeSubs);
  setCheckbox('cb-auto-subs',   state.writeAutoSubs);
  setCheckbox('cb-embed-subs',  state.embedSubs);
  setCheckbox('cb-write-thumb', state.writeThumbnail);
  setCheckbox('cb-embed-thumb', state.embedThumbnail);
  setCheckbox('cb-metadata',    state.addMetadata);
  setCheckbox('cb-sponsorblock',state.sponsorBlock);
  setCheckbox('cb-playlist',    state.downloadPlaylist);
  setCheckbox('cb-global-exe',  state.useGlobalExe);

  // Sub langs
  document.getElementById('sub-langs-input').value = state.subLangs || 'en,id';

  // Output template
  document.getElementById('output-template-input').value = state.outputTemplate || '%(title)s.%(ext)s';

  // Rate limit
  document.getElementById('rate-limit-input').value = state.rateLimit || '';

  // Cookies
  const cookiesBrowserSelect = document.getElementById('cookies-browser-select');
  if (cookiesBrowserSelect) {
    cookiesBrowserSelect.value = state.cookiesFileEnabled ? '' : (state.cookiesBrowser || '');
    cookiesBrowserSelect.disabled = !!state.cookiesFileEnabled;
    cookiesBrowserSelect.setAttribute('aria-disabled', String(!!state.cookiesFileEnabled));
  }

  // Cookies file
  setCheckbox('cb-cookies-file', state.cookiesFileEnabled);
  const cookiesFileInput = document.getElementById('cookies-file-input');
  if (cookiesFileInput) {
    cookiesFileInput.value = state.cookiesFilePath || 'cookie.txt';
    cookiesFileInput.disabled = !state.cookiesFileEnabled;
    cookiesFileInput.setAttribute('aria-disabled', String(!state.cookiesFileEnabled));
  }
  syncCookieControls();

  // Playlist range
  document.getElementById('playlist-start').value = state.playlistStart || '';
  document.getElementById('playlist-end').value   = state.playlistEnd || '';

  // OS pills
  document.querySelectorAll('[data-os]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.os === state.os);
    btn.setAttribute('aria-pressed', String(btn.dataset.os === state.os));
  });

  // Multiline toggle
  const fmtBtn = document.getElementById('format-toggle-btn');
  fmtBtn.classList.toggle('btn-primary', state.multiline);
  fmtBtn.classList.toggle('btn-ghost', !state.multiline);

  // Active preset
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === state.activePreset);
    btn.setAttribute('aria-pressed', String(btn.dataset.preset === state.activePreset));
  });

  updateUI();
}

function setCheckbox(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.checked = !!val;
  const item = el.closest('.checkbox-item');
  if (item) item.classList.toggle('checked', !!val);
}

function syncCookieControls() {
  const browserSelect = document.getElementById('cookies-browser-select');
  const fileCheckbox = document.getElementById('cb-cookies-file');
  const fileInput = document.getElementById('cookies-file-input');
  const fileEnabled = !!state.cookiesFileEnabled;

  if (browserSelect) {
    browserSelect.disabled = fileEnabled;
    browserSelect.value = fileEnabled ? '' : (state.cookiesBrowser || '');
    browserSelect.setAttribute('aria-disabled', String(fileEnabled));
  }
  if (fileCheckbox) {
    fileCheckbox.checked = fileEnabled;
    const item = fileCheckbox.closest('.checkbox-item');
    if (item) item.classList.toggle('checked', fileEnabled);
  }
  if (fileInput) {
    fileInput.disabled = !fileEnabled;
    fileInput.value = state.cookiesFilePath || 'cookie.txt';
    fileInput.setAttribute('aria-disabled', String(!fileEnabled));
  }
}

// ============================================================
// === URL META BADGES ===
// ============================================================
function showUrlMeta(type) {
  const meta = document.getElementById('url-meta');
  meta.innerHTML = '';
  if (!type) return;
  const isEn = currentLang() === 'en';
  const labels = {
    video:    ['badge-video',    'Video'],
    short:    ['badge-short',    'Short'],
    playlist: ['badge-playlist', 'Playlist'],
    shortUrl: ['badge-video',    'Video'],
    channel:  ['badge-video',    isEn ? 'Channel' : 'Kanal'],
    music:    ['badge-video',    isEn ? 'Music' : 'Musik'],
  };
  if (labels[type]) {
    const badge = document.createElement('span');
    badge.className = `badge ${labels[type][0]}`;
    badge.textContent = labels[type][1];
    meta.appendChild(badge);
  }
}

function toggleClearBtn(url) {
  const btn = document.getElementById('clear-url-btn');
  const visible = !!(url && url.trim());
  btn.style.display = visible ? 'flex' : 'none';
  btn.setAttribute('aria-hidden', String(!visible));
}

// ============================================================
// === EVENT HANDLERS ===
// ============================================================
function initEventHandlers() {

  // URL input
  const urlInput = document.getElementById('url-input');
  urlInput.addEventListener('input', () => {
    const val = urlInput.value;
    state.url = val;
    state.activePreset = null;
    toggleClearBtn(val);

    const msgEl = document.getElementById('url-validation-msg');
    if (!val.trim()) {
      urlInput.classList.remove('error');
      msgEl.textContent = '';
      showUrlMeta(null);
      state.urlType = null;
    } else {
      const vr = validateUrl(val, currentLang());
      if (vr.valid) {
        urlInput.classList.remove('error');
        msgEl.textContent = '';
        const prevType = state.urlType;
        state.urlType = vr.type;
        showUrlMeta(vr.type);
        // A watch URL that also carries a list id is *suggested* as a
        // playlist (badge + one-time toast), never forced: the user stays
        // in control of the "download playlist" checkbox.
        if (vr.type === 'playlist' && prevType !== 'playlist' && !state.downloadPlaylist) {
          showToast(I18N[currentLang()].toast.playlistSuggested, 'info');
        }
      } else {
        urlInput.classList.add('error');
        msgEl.textContent = vr.message;
        state.urlType = null;
        showUrlMeta(null);
      }
    }
    updateUI();
  });

  // Clear URL button
  document.getElementById('clear-url-btn').addEventListener('click', () => {
    urlInput.value = '';
    state.url = '';
    state.urlType = null;
    toggleClearBtn('');
    document.getElementById('url-validation-msg').textContent = '';
    urlInput.classList.remove('error');
    showUrlMeta(null);
    urlInput.focus();
    updateUI();
  });

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetId = btn.dataset.preset;
      const preset = PRESETS[presetId];
      if (!preset) return;

      // Reset every command-affecting option to its default so leftover
      // advanced options (SponsorBlock, cookies, subtitles, ...) can never
      // leak into the preset's generated command.
      PRESET_RESET_KEYS.forEach(key => {
        state[key] = DEFAULT_STATE[key];
      });

      Object.assign(state, preset);
      state.activePreset = presetId;

      const t = I18N[currentLang()];
      const presetName = (t.presets && t.presets[presetId] && t.presets[presetId].label) ? t.presets[presetId].label : presetId;
      showToast(t.toast.presetApplied(presetName), 'info');
      syncUIFromState();
    });
  });

  // Video format radios
  document.getElementById('video-format-group').addEventListener('change', e => {
    if (e.target.type !== 'radio') return;
    const val = e.target.value;
    if (val === 'audio-only') {
      state.audioOnly = true;
      state.videoFormat = 'best';
    } else {
      state.audioOnly = false;
      state.videoFormat = val;
    }
    const aoTrack = document.getElementById('audio-only-track');
    aoTrack.classList.toggle('active', state.audioOnly);
    const aoToggle = document.getElementById('audio-only-toggle');
    if (aoToggle) aoToggle.setAttribute('aria-checked', String(state.audioOnly));
    state.activePreset = null;
    updateRadioStyles('video-format-group');
    updateUI();
  });

  // Resolution
  document.getElementById('resolution-select').addEventListener('change', e => {
    state.resolution = e.target.value;
    state.activePreset = null;
    updateUI();
  });

  // Audio format radios
  document.getElementById('audio-format-group').addEventListener('change', e => {
    if (e.target.type !== 'radio') return;
    state.audioFormat = e.target.value;
    state.activePreset = null;
    updateRadioStyles('audio-format-group');
    updateUI();
  });

  // Audio quality slider
  document.getElementById('audio-quality-slider').addEventListener('input', e => {
    state.audioQuality = parseInt(e.target.value, 10);
    updateUI();
  });

  // Audio only toggle
  document.getElementById('audio-only-toggle').addEventListener('click', () => {
    state.audioOnly = !state.audioOnly;
    const aoTrack = document.getElementById('audio-only-track');
    aoTrack.classList.toggle('active', state.audioOnly);
    document.getElementById('audio-only-toggle').setAttribute('aria-checked', String(state.audioOnly));
    // Sync radio
    const radios = document.querySelectorAll('input[name="videoFormat"]');
    radios.forEach(r => {
      if (r.value === 'audio-only') r.checked = state.audioOnly;
      else if (r.value === state.videoFormat) r.checked = !state.audioOnly;
    });
    updateRadioStyles('video-format-group');
    state.activePreset = null;
    updateUI();
  });

  // Checkboxes
  [
    ['cb-write-subs',  () => { state.writeSubs     = !state.writeSubs; }],
    ['cb-auto-subs',   () => { state.writeAutoSubs  = !state.writeAutoSubs; }],
    ['cb-embed-subs',  () => { state.embedSubs      = !state.embedSubs; }],
    ['cb-write-thumb', () => { state.writeThumbnail = !state.writeThumbnail; }],
    ['cb-embed-thumb', () => { state.embedThumbnail = !state.embedThumbnail; }],
    ['cb-metadata',    () => { state.addMetadata    = !state.addMetadata; }],
    ['cb-sponsorblock',() => { state.sponsorBlock   = !state.sponsorBlock; }],
    ['cb-cookies-file',() => {
      state.cookiesFileEnabled = el.checked;
      // Mode eksklusif: kalau pakai cookie.txt, matikan pilihan cookie dari browser
      if (state.cookiesFileEnabled) state.cookiesBrowser = '';
      syncCookieControls();
    }],
    ['cb-playlist',    () => {
      state.downloadPlaylist = el.checked;
      updateUI();
    }],
    ['cb-global-exe',  () => {
      state.useGlobalExe = el.checked;
    }],
  ].forEach(([id, handler]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', () => {
      handler();
      const item = el.closest('.checkbox-item');
      if (item) item.classList.toggle('checked', el.checked);
      state.activePreset = null;
      updateUI();
    });
  });

  // Sub langs
  document.getElementById('sub-langs-input').addEventListener('input', e => {
    state.subLangs = e.target.value;
    updateUI();
  });

  // Output template input
  document.getElementById('output-template-input').addEventListener('input', e => {
    state.outputTemplate = e.target.value;
    state.activePreset = null;
    updateUI();
  });

  // Template chips
  document.querySelectorAll('.chip[data-template]').forEach(chip => {
    chip.addEventListener('click', () => {
      const tpl = chip.dataset.template;
      state.outputTemplate = tpl;
      document.getElementById('output-template-input').value = tpl;
      state.activePreset = null;
      updateUI();
    });
  });

  // Rate limit
  document.getElementById('rate-limit-input').addEventListener('input', e => {
    state.rateLimit = e.target.value;
    updateUI();
  });

  // Cookies browser
  document.getElementById('cookies-browser-select').addEventListener('change', e => {
    const val = e.target.value;
    state.cookiesBrowser = val;
    // Mode eksklusif: kalau pilih browser, matikan cookie.txt
    if (val) state.cookiesFileEnabled = false;
    syncCookieControls();
    updateUI();
  });

  // Cookies file (cookie.txt)
  const cookiesFileInput = document.getElementById('cookies-file-input');
  if (cookiesFileInput) {
    cookiesFileInput.addEventListener('input', e => {
      state.cookiesFilePath = e.target.value;
      updateUI();
    });
  }

  // Playlist range
  document.getElementById('playlist-start').addEventListener('input', e => {
    state.playlistStart = e.target.value ? parseInt(e.target.value, 10) : null;
    updateUI();
  });
  document.getElementById('playlist-end').addEventListener('input', e => {
    state.playlistEnd = e.target.value ? parseInt(e.target.value, 10) : null;
    updateUI();
  });

  // OS pills
  document.querySelectorAll('[data-os]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.os = btn.dataset.os;
      document.querySelectorAll('[data-os]').forEach(b => {
        b.classList.toggle('active', b.dataset.os === state.os);
        b.setAttribute('aria-pressed', String(b.dataset.os === state.os));
      });
      const labels = { 'unix': 'Unix', 'windows-cmd': 'CMD', 'powershell': 'PowerShell' };
      document.getElementById('os-badge').textContent = labels[state.os] || 'Unix';
      updateUI();
    });
  });

  // Multiline toggle
  const fmtBtn = document.getElementById('format-toggle-btn');
  fmtBtn.addEventListener('click', () => {
    state.multiline = !state.multiline;
    fmtBtn.classList.toggle('btn-primary', state.multiline);
    fmtBtn.classList.toggle('btn-ghost', !state.multiline);
    updateUI();
  });

  // Copy button
  const copyBtn = document.getElementById('copy-btn');
  let copyTimeout = null;
  copyBtn.addEventListener('click', async () => {
    const t = I18N[currentLang()];
    if (!canCopyCommand()) {
      const urlValid = validateUrl(state.url || '').valid;
      const message = urlValid ? t.toast.unsafeWindowsCmd : t.toast.enterValidUrl;
      showToast(message, 'error');
      return;
    }
    const raw = document.getElementById('command-output').dataset.raw || document.getElementById('command-code').textContent;
    try {
      await navigator.clipboard.writeText(raw);
    } catch(e) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = raw;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copyBtn.innerHTML = ICON_CHECK + ' ' + t.toast.copiedButtonLabel;
    copyBtn.classList.remove('btn-success');
    copyBtn.classList.add('btn-primary');
    showToast(t.toast.copied, 'success');
    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copyBtn.innerHTML = ICON_CLIP + ' ' + t.toast.copyButtonLabel;
      copyBtn.classList.remove('btn-primary');
      copyBtn.classList.add('btn-success');
    }, 2000);
  });

  // Language toggle
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      state.lang = state.lang === 'en' ? 'id' : 'en';
      applyLanguage(state.lang);
      updateUI();
    });
  }

  // Theme toggle
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);

  // Collapsible
  const advToggle = document.getElementById('advanced-toggle');
  advToggle.addEventListener('click', toggleCollapsible);
  advToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCollapsible();
    }
  });
}

function toggleCollapsible() {
  const header = document.getElementById('advanced-toggle');
  const body   = document.getElementById('advanced-body');
  const expanded = header.getAttribute('aria-expanded') === 'true';
  header.setAttribute('aria-expanded', String(!expanded));
  body.setAttribute('aria-hidden', String(expanded));
  body.inert = expanded;
  body.classList.toggle('open', !expanded);
}

// ============================================================
// === INIT ===
// ============================================================
function init() {
  initTheme();
  loadOptions();
  syncUIFromState();
  applyLanguage(state.lang);
  initEventHandlers();

  // Init multiline button classes
  const fmtBtn = document.getElementById('format-toggle-btn');
  fmtBtn.classList.add(state.multiline ? 'btn-primary' : 'btn-ghost');

  // Initialize command & language-dependent UI texts
  updateUI();
}

document.addEventListener('DOMContentLoaded', init);
