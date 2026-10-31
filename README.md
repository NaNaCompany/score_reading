# 초견 도우미

MusicXML 악보의 변화표·셈여림·아티큘레이션을 색상으로 표시하고 재생·출력하는 정적 웹앱입니다.

공개: https://nanalab.kr/score_reading/

GitHub Pages는 main 브랜치 루트를 배포합니다. 기존 렌더링·오디오·PDF 관련 라이브러리와 기능은 유지합니다.

## 사이트 메타데이터·게시자 통합

`node tools/site_metadata.mjs`로 canonical, 4대 태그와 GTM noscript, sitemap.xml, robots.txt, ads.txt를 재생성합니다. `node --test tests/publisher.test.mjs`로 로컬 요청 차단과 입력값 제외를 검사합니다.

## 샘플 악보

첫 화면에서 라흐마니노프 Op. 39 No. 6 또는 바르톡 Allegro barbaro를 바로 열 수 있습니다. 사용자가 공개 샘플로 제공한 MusicXML에서 `<identification>`과 하위 요소만 제거한 파일이며 색상·악보 데이터는 유지합니다. 원본 첨부는 변경하지 않았습니다. `samples/manifest.json`에 파일명·해시·변경 내역을 기록합니다. 샘플은 클릭할 때만 가져오며 곡명·작곡가가 없는 파일은 표시용 정보를 보충합니다.

## 공유 미리보기 이미지

`python tools/build_og.py`로 1200×630 PNG와 `assets/og.json`을 생성하고 `node tools/site_metadata.mjs`로 OG·Twitter 메타태그를 갱신합니다. 이미지 생성에는 Pillow와 한글 시스템 폰트가 필요합니다. 기본 폰트 폴더는 `C:/Windows/Fonts`이며 `--font-dir`로 변경할 수 있습니다. 폰트 파일·외부 이미지·업로드 악보는 배포 자산에 포함하지 않습니다.
