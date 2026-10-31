# Updates

## 2026-10-31

- Added self-referencing canonical and Open Graph URL, a sitemap.xml containing the public root page, allow-all robots.txt, ads.txt, an app icon, and a subtle More Apps footer link.
- Applied the verified NaNa Lab GA4, GTM including noscript, Google AdSense, and Cloudflare Web Analytics on the served HTML. The shared source helper is tools/publisher-tracking.mjs; regenerate metadata using node tools/site_metadata.mjs. Local/test hosts do not initialize publisher requests. Page-view URLs exclude query strings and fragments; no uploaded file, score content or other input is sent as a custom event.
- Registered one Korean representative card and the app sitemap leaf in the NaNa Lab directory. Catalog descriptions are translated in eight secondary UI languages; this app itself currently serves Korean.
- Static/source preservation and runtime checks, public deployment/readback, and browser-verification limits are recorded separately in the workspace release evidence. Browser automation stopped because it could not confidently determine the current Windows browser URL; no browser QA completion is claimed.
