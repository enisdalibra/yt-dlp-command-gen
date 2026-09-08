# Spec: Instagram Reels Download Support

## Problem Statement

The yt-dlp-command-gen tool currently supports downloading YouTube videos, but lacks support for Instagram Reels. Users want to be able to download Instagram Reels (short-form vertical videos) directly using the same command-line interface. Instagram Reels are hosted at `instagram.com/reel/{reel_id}/` URLs and require the `--reels` flag to properly handle their special properties (short duration, vertical orientation, etc.).

## Solution

Extend the command generator to:
1. Detect Instagram Reels URLs (those containing `/reel/` in the path)
2. Automatically add the `--reels` flag when a Reels URL is detected
3. Provide a dedicated "Instagram Reels" preset with optimized defaults
4. Ensure all existing Reels options (resolution, audio quality, thumbnails, etc.) work correctly with Reels

## User Stories

1. **Basic Reels Download** – As a user, I want to download an Instagram Reel so that I can watch it offline on my device.
2. **Custom Resolution** – As a user, I want to specify resolution (e.g., 1080p) for a Reel so that I can choose between high and low quality based on my connection.
3. **Audio Extraction** – As a user, I want to extract audio from a Reel so that I can listen to the video without displaying it visually.
4. **Subtitles** – As a user, I want to download a Reel with subtitles embedded so that I can watch it with captions.
5. **Standard Formats** – As a user, I want Reels to be downloaded in MP4 format so that they are compatible with most media players.
6. **Multiple Reels** – As a user, I want to download several Reels at once so that I can collect a collection of short videos.

## Implementation Decisions

- **URL Detection**: Use the presence of `/reel/` in the URL path as the indicator for Reels. This follows the same pattern used by yt-dlp for identifying Reel URLs.
- **Flag**: Use the `--reels` flag (already supported by yt-dlp) which tells yt-dlp to treat the URL as a Reel and apply Reels-specific processing (e.g., proper aspect ratio, duration limits).
- **Preset**: Create a new preset called "Instagram Reels" with defaults optimized for Reels (best video format, 1080p resolution, MP4 output, audio extraction enabled).
- **Compatibility**: All existing Reels options (resolution, audio quality, thumbnails, metadata, sponsor removal) should continue to work with Reels URLs.
- **Error Handling**: If a URL is not a valid Reel, the tool should display a helpful error message indicating that Reels support is not available for that URL.

## Testing Decisions

- **Test Cases**:
  - Valid Reels URL (`https://www.instagram.com/reel/ABC123/`) → command includes `--reels` flag
  - Invalid URL (non-Reel) → appropriate error message
  - Reel with custom resolution → `--reels` + `--resolution` combination
  - Reel with audio extraction → `--reels` + `--audio-quality`
  - Reel playlist → `--reels` + `--yes-playlist`
- **Verification**: Run the command builder with sample Reels URLs and verify the generated command contains `--reels`.
- **Edge Cases**: Handle Reels with long URLs, special characters in IDs, and mixed-language URLs.

## Out of Scope

- Downloading Instagram Posts (static images/videos posted outside Reels)
- Converting Reels to other formats beyond what yt-dlp provides (e.g., WebM)
- Capturing Reels frames or creating slideshows
- Supporting Reels from TikTok or other platforms
- Advanced Reels-specific features (e.g., multi-lingual captions beyond subtitles)

## Further Notes

- The `--reels` flag in yt-dlp is designed specifically for Instagram Reels and handles many edge cases automatically (duration capping, aspect ratio, etc.). Our job is to detect Reels URLs and apply this flag appropriately.
- We should also consider adding a "Instagram Reels" quick-preset in the UI for one-click access.
- The implementation should be backward-compatible – existing functionality for YouTube videos must remain unchanged.
