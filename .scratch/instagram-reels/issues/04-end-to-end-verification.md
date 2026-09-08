# 04: End-to-End Reels Verification

**What to build:** Verify the complete flow: user enters a Reels URL, the app detects it, generates a command with `--reels`, and the command works correctly.

**Blocked by:** 01 (URL detection), 02 (preset), 03 (UI)

**Status:** ready-for-agent

- [ ] Entering a Reels URL (e.g., `https://www.instagram.com/reel/ABC123/`) triggers `--reels` flag in the generated command
- [ ] The generated command is syntactically valid and can be executed by yt-dlp
- [ ] The command successfully downloads the Reel (or at least validates the URL and flag combination)
- [ ] All existing Reels options (resolution, audio quality, thumbnails, etc.) work with Reels URLs
- [ ] The build process (`npm run build`) completes without errors
- [ ] The generated `index.html` is updated and functional

**Notes:**
- Test with both valid and invalid Reels URLs
- Test with different Reels resolutions and audio qualities
- Ensure the build pipeline still works end-to-end