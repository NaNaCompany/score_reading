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


## 2026-10-31 — OG 공유 이미지

- 앱별 1200×630 정적 PNG 대표 이미지를 신규 제작했다. 악보 암기는 마디 퍼즐, 초견 도우미는 변화표·셈여림·표현 기호 색상 표시를 원본 절차적 그래픽으로 표현한다. 외부 이미지나 사용자가 업로드한 악보는 사용하지 않았다. 설치된 시스템 폰트로 렌더했으며 폰트 파일은 배포하지 않는다.
- 이미지 파일명에 SHA-256 접두사를 넣고 assets/og.json에 실제 치수·MIME·해시·alt를 기록했다. tools/build_og.py로 재생성하고 tools/site_metadata.mjs로 적용한다.
- OG title/description/type/locale/site_name/url/image와 image secure_url/type/width/height/alt, Twitter summary_large_image/title/description/image/alt를 소스 생성기에 추가했다. HTTPS 절대 URL 사용, 중복 필드 없음과 재생성 멱등성을 검사했다. 규격 참고: https://ogp.me/.
- 기존 앱 body와 런타임, 진입 화면/최근 악보 배너·샘플·색상·진도·4대 게시자 태그·GTM noscript·사이트맵·robots는 보존했다. OG 이미지 자체는 픽셀로 열어 검토했다. 실제 카톡·X에서 공유한 화면이나 플랫폼 미리보기 캐시 갱신은 별도 검증이며 완료로 주장하지 않는다.
- 배포 SHA, 공개 HTML·PNG·bot User-Agent 응답 대조 결과: workspace .tools/music-og-20261031/의 static-check.json·publish.json·live-check.json·completion.json.
