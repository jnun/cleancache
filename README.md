# Clean Cache

**One-click cache clearing for the site you're looking at.** No digging through settings. No nuking your entire browser. Just the site you care about.

Clean Cache is a Chrome extension built for developers, QA engineers, and anyone who's tired of the "clear browsing data" dance.

---

## What It Does

Three actions, zero ambiguity:

| Action | What gets cleared |
|---|---|
| **Clear files** | HTTP cache, service worker cache, cache storage |
| **Reset session** | Cookies, localStorage, IndexedDB, service workers |
| **Nuke this site** | Everything above. All of it. Gone. |

Click a button, the data clears, the tab reloads. That's it.

## Why It's Safe

This matters. Browser extensions have access to sensitive data, and you should be skeptical of every one you install. Here's why Clean Cache earns your trust:

- **Origin-scoped only.** Every operation targets the current site's origin and nothing else. It cannot touch other tabs, other sites, or your browser history.
- **Minimal permissions.** The extension requests exactly two permissions -- and here's exactly what each one does:
  - **`activeTab`** -- Required to detect the currently active tab and its site URL when you open the extension. This is how it targets data clearing to the current site only, rather than all sites. It does not read page content.
  - **`browsingData`** -- Required to remove browsing data for the active site only, including cookies, cache, and storage, when you select Clear Files, Reset Session, or Nuke This Site. It does not clear all browser data.
- **No network access.** Clean Cache makes zero network requests. No analytics, no telemetry, no phoning home. Your data stays on your machine.
- **No background activity.** The service worker only runs when you click a button. It doesn't watch your browsing, inject scripts, or run in the background.
- **Confirmation on destructive actions.** The "Nuke this site" button requires explicit confirmation before executing.
- **Fully auditable.** The entire extension is ~200 lines of vanilla JavaScript across two files. No dependencies, no build step, no minification. Read every line in five minutes.

## Why You'd Use It

**You're a developer** and you just pushed a fix for a caching bug. You need to verify it works with a clean slate -- not by opening an incognito window and re-logging in, not by clearing your entire browser and losing all your sessions. Just this site.

**You're doing QA** and testing a login flow. You need to reset cookies and session data for one origin, over and over, without touching anything else.

**You're debugging a service worker** and you need to blow away the registration and cached assets without thinking about which checkboxes to tick in DevTools.

**You're tired of `chrome://settings/clearBrowserData`** and want something that takes one click instead of six.

## Install

### From source (developer mode)

1. Clone this repo
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder
5. Pin the extension to your toolbar

### From the Chrome Web Store

*Coming soon.*

## Tech

- Chrome Manifest V3
- Vanilla JavaScript, no dependencies
- Service worker architecture (no persistent background page)
- `chrome.browsingData` API for scoped data removal

## License

MIT
