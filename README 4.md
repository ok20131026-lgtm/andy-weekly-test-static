# Andy Weekly Test Maker - Static Version

Vercel 배포 실패를 피하기 위한 정적 HTML 버전입니다.

## 구성

- Unit 1~12 전체 포함
- 유닛별 20문항
- 전체 240문항
- 단어장 xlsm의 영영정의와 영영해석 기준
- 영영정의형 4지선다
- 힌트 버튼 클릭 시 영영해석 표시
- 답 체크 후 모든 선지 한글뜻 표시
- 정답 녹색 + 정답 라벨
- 선택 오답 빨간색 + 오답 라벨
- 홈 버튼 / 이전 문제 / 다음 문제 / 오답 복습 포함

## 배포 방법

이 버전은 Next.js가 아닙니다. npm install이 없습니다.

GitHub 저장소 루트에 아래 파일만 올리세요.

- index.html
- style.css
- script.js
- data.js
- README.md

Vercel에서 Import할 때 Framework Preset은 `Other` 또는 `Static`으로 두고,
Build Command와 Output Directory는 비워두세요.
