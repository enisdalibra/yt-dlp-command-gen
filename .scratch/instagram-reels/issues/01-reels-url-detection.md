# 01: Reels URL Detection and --reels Flag

**What to build:** The command generator should recognize Instagram Reels URLs (those containing `/reel/` in the path) and automatically add the `--reels` flag when building the yt-dlp command.

**Blocked by:** None (standalone logic change)

**Status:** ready-for-agent

- [ ] `validateUrl()` returns `type: "reel"` for URLs containing `/reel/`
- [ ] `buildCommand()` adds `--reels` flag when a Reels URL is detected
- [ ] The generated command for a Reels URL includes `--reels`
- [ ] Non-Reels URLs are unaffected (no `--reels` flag added)
- [ ] Unit tests cover Reels URL detection and flag emission

**Notes:**
- Instagram Reels URLs follow the pattern `https://www.instagram.com/reel/{reel_id}/`
- The `--reels` flag is already supported by yt-dlp and handles duration limits, aspect ratio, and other Reels-specific processing
- This change is isolated to the command builder logic; no UI changes required