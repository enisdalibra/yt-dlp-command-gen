# 03: Reels Preset UI Integration

**What to build:** Add the "Instagram Reels" preset button to the UI and ensure it integrates properly with the existing preset system.

**Blocked by:** 02 (preset definition)

**Status:** ready-for-agent

- [ ] The "Instagram Reels" preset button appears in the presets section of the UI
- [ ] Clicking the button applies the correct defaults (see ticket 02)
- [ ] The button is marked as unchecked initially (unless previously selected)
- [ ] The UI reflects the correct preset status (active/inactive)
- [ ] No regression in existing presets (best-video, hd-mp4, etc.)

**Notes:**
- Follow the existing pattern for preset buttons (ID, label, aria-label, SVG icon)
- The button should appear alongside other presets in the "Presets Section"
- The button should be clickable and trigger the preset application