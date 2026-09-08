# 02: Instagram Reels Preset

**What to build:** Add a new "Instagram Reels" preset with optimized defaults for Reels downloads (best video format, 1080p resolution, MP4 output, audio extraction enabled).

**Blocked by:** None (standalone preset addition)

**Status:** ready-for-agent

- [ ] A new preset "Instagram Reels" is defined in `PRESETS`
- [ ] The preset sets `videoFormat: "best"`, `resolution: "1080"`, `outputTemplate: "%(title)s.%(ext)s"`, `audioQuality: 0`, `audioOnly: false`
- [ ] The preset resets all other options to their defaults (so leftover advanced options don't leak)
- [ ] The preset is properly listed in `PRESET_RESET_KEYS`
- [ ] Unit tests verify the preset applies the correct defaults

**Notes:**
- The preset should mirror the "best-video" preset but with Reels-optimized defaults
- This is independent of URL detection; it's a UI/configuration feature