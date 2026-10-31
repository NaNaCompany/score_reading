# 초견 도우미

MusicXML 악보의 변화표·셈여림·아티큘레이션을 색상으로 표시하고 재생·출력하는 정적 웹앱입니다.

공개: https://nanalab.kr/score_reading/

GitHub Pages는 main 브랜치 루트를 배포합니다. 기존 렌더링·오디오·PDF 관련 라이브러리와 기능은 유지합니다.

## 사이트 메타데이터·게시자 통합

`node tools/site_metadata.mjs`로 canonical, 4대 태그와 GTM noscript, sitemap.xml, robots.txt, ads.txt를 재생성합니다. `node --test tests/publisher.test.mjs`로 로컬 요청 차단과 입력값 제외를 검사합니다.
