# AI-Healthcare Lab 홈페이지

성균관대학교 시스템경영공학과 AI-Healthcare Lab 연구실 홈페이지입니다.

공개 주소: https://myshin22.github.io/aihc-lab/

---

## 📁 폴더 구조

```
.
├── index.html              # 페이지 뼈대 (거의 수정할 일 없음)
├── styles.css              # 디자인/색상/레이아웃 (디자인 바꿀 때만)
├── app.js                  # 동작 로직 (수정할 일 없음)
├── data/                   # ★ 콘텐츠는 여기서 수정합니다 ★
│   ├── members.json        # 멤버 (석사·학부·비학위·졸업생)
│   ├── projects.json       # 연구 프로젝트
│   ├── publications.json   # 논문 (저널·학회·진행중)
│   ├── news.json           # 학회 참가 등 소식
│   ├── seminars.json       # 세미나
│   ├── albums.json         # 앨범
│   ├── partners.json       # 협력기관 로고
│   └── courses.json        # 강의
└── images/                 # ★ 사진은 여기에 올립니다 ★
    ├── members/            # 멤버·교수 사진
    ├── partners/           # 협력기관 / 프로젝트 지원기관 로고
    ├── news/               # 뉴스 기사 사진
    └── site/               # 로고, 메인 사진(hero.jpeg), 소개 영상(intro.mp4)
```

> **핵심:** 평소엔 `data/` 의 JSON 파일과 `images/` 의 사진만 만지면 됩니다.

---

## ✏️ 콘텐츠 수정 방법

`data/` 안의 `.json` 파일을 내려받아 편집 후 다시 올리면 됩니다.

### 멤버 추가 — `data/members.json`
4개 그룹(`masters`, `undergraduate`, `parttime`, `alumni`)이 있습니다. 해당 그룹 배열에 한 줄 추가:
```json
{ "ko": "홍길동", "en": "Gildong Hong", "init": "GH", "img": "홍길동.png", "ri": ["Healthcare", "NLP"] }
```
- `ko` 한글 이름 · `en` 영문/소속 · `init` 사진 없을 때 보일 이니셜 · `ri` 연구 관심사(태그)
- `img` 에 적은 파일명과 **똑같은 이름**의 사진을 `images/members/` 에 올리면 자동 표시됩니다. 사진이 없으면 `img` 를 `""` 로 두면 이니셜이 보입니다.

### 프로젝트 추가 — `data/projects.json`
```json
{ "cat": "Healthcare", "t": "프로젝트 제목", "f": "한국연구재단", "icon": "한국연구재단.jpg", "p": "2026.03 - 2031.02" }
```
- `cat` 분류 · `t` 제목 · `f` 지원기관 · `p` 기간
- `icon` 은 지원기관 로고 파일명. `images/partners/` 에 있는 파일을 적으면 카드에 로고가 표시됩니다.

### 논문 추가 — `data/publications.json`
3개 그룹이 있습니다.
- `journals` (저널): `{ "y": "2025", "a": "저자", "t": "제목", "v": "학술지 정보", "d": "https://doi.org/..." }` — `d`(DOI)는 선택
- `conferences` (학회): `{ "y": "2025", "a": "저자", "t": "제목", "v": "학회 정보" }`
- `inProgress` (진행중): `{ "a": "저자", "t": "제목", "v": "Submitted", "s": "prog" }` — `s` 는 `"prog"`(제출) 또는 `"rev"`(수정중)

### 뉴스/세미나/앨범 추가 — `data/news.json` · `seminars.json` · `albums.json`
```json
{
  "id": "kiie-2026-spring",
  "tag": "Conference",
  "term": "2026 · Spring",
  "date": "2026년 6월 ...",
  "title": "기사 제목",
  "hero": "대표사진.png",
  "blocks": [
    { "p": "본문 문단입니다." },
    { "img": "사진1.png", "cap": "사진 설명" }
  ]
}
```
- `hero` 대표 사진, `blocks` 안의 `img` 사진은 모두 해당 폴더(`images/news/` 등)에 올립니다.
- 카드는 좌우로 넘기는 캐러셀로 표시됩니다.

### 강의 / 협력기관
- `data/courses.json`: `{ "term": "Spring 2026", "cur": true, "c": ["과목1", "과목2"] }` — `cur` 가 `true` 면 Current 배지
- `data/partners.json`: `{ "img": "로고.png", "e": "기관 영문명" }` — 로고는 `images/partners/` 에 업로드

---

## 🖼 사진 올리는 법
1. 사진을 알맞은 `images/<폴더>/` 에 업로드
2. JSON 파일의 해당 항목 `img` / `hero` / `icon` 에 **올린 파일명과 똑같이** 적기
3. 한글 파일명도 됩니다. (예: `신민영.png`)

---

## ⚠️ JSON 작성 주의사항
- 모든 키와 값은 **큰따옴표** `"..."` 로 감쌉니다. (작은따옴표 ✗)
- 항목 사이에는 쉼표 `,` , **마지막 항목 뒤에는 쉼표를 넣지 않습니다.**
- 값 안에 큰따옴표를 쓰려면 `\"` 로 적습니다. 예: `"제목 \"인용\" 입니다"`

---

## 👀 로컬에서 미리보기
`index.html` 을 더블클릭해서 열면 데이터가 안 보입니다(브라우저 보안 정책). 아래처럼 간단한 서버를 띄워야 합니다.

```bash
cd aihc-lab          # 이 폴더에서
python3 -m http.server 8000
```
그 후 브라우저에서 http://localhost:8000 접속. (Ctrl+C 로 종료)

> GitHub Pages(실제 사이트)에서는 이런 제약 없이 그대로 잘 보입니다.

---

## 🚀 변경사항 게시하기
GitHub 웹에서 수정하면 **Commit changes** 누르는 즉시 반영됩니다.
로컬에서 수정했다면:
```bash
git add -A
git commit -m "내용 수정 설명"
git push
```
약 1분 뒤 https://myshin22.github.io/aihc-lab/ 에 자동 반영됩니다.
