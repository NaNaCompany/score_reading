# Updates

## 2026-10-31

- Added self-referencing canonical and Open Graph URL, a sitemap.xml containing the public root page, allow-all robots.txt, ads.txt, an app icon, and a subtle More Apps footer link.
- Applied the verified NaNa Lab GA4, GTM including noscript, Google AdSense, and Cloudflare Web Analytics on the served HTML. The shared source helper is tools/publisher-tracking.mjs; regenerate metadata using node tools/site_metadata.mjs. Local/test hosts do not initialize publisher requests. Page-view URLs exclude query strings and fragments; no uploaded file, score content or other input is sent as a custom event.
- Registered one Korean representative card and the app sitemap leaf in the NaNa Lab directory. Catalog descriptions are translated in eight secondary UI languages; this app itself currently serves Korean.
- Static/source preservation and runtime checks, public deployment/readback, and browser-verification limits are recorded separately in the workspace release evidence. Browser automation stopped because it could not confidently determine the current Windows browser URL; no browser QA completion is claimed.


## 2026-10-31 — 제공 악보 샘플 추가

- 사용자가 공개 샘플로 제공한 라흐마니노프 Op. 39 No. 6(121마디)·바르톡 Allegro barbaro(224마디)를 samples/에 추가했다.
- 요청한 identification 요소와 모든 하위 항목만 제거했다. 나머지 입력 바이트·음표·마디·색상 속성은 유지하고 원본 첨부 파일은 변경하지 않았다. 두 앱에 동일 SHA-256 파일을 제공한다. samples/manifest.json에 출처 파일명·변경 내역·해시를 기록했다.
- 첫 화면에 샘플 버튼 2개를 추가하고 클릭 시 MusicXML을 불러오도록 연결했다. 오래된 base64 샘플과 존재하지 않는 버튼 참조를 제거했다. 로딩 중 중복 실행 방지·실패 시 오류 표시/버튼 복원을 추가했다. 제목/작곡가 표시 보충과 라흐마니노프의 기존 샘플 템포 168 설정을 유지했다.
- 기존 GA4·GTM+noscript·AdSense·Cloudflare, canonical·sitemap·robots·More Apps를 유지했다. 샘플 XML은 HTML 페이지가 아니므로 태그나 중복 sitemap URL을 삽입하지 않았다. 정적 파일·런타임 mock·공개 배포 대조 결과는 workspace .tools/music-samples-20261031/에 기록한다. 실제 브라우저 렌더링/오디오 검증은 별도다.
