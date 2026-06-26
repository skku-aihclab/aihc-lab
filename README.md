# AI-Healthcare Lab 홈페이지

성균관대학교 시스템경영공학과 AI-Healthcare Lab 연구실 홈페이지

공개 주소: https://skku-aihclab.github.io/aihc-lab/

---

## 📁 폴더 구조

```
.
├── index.html              # 페이지 뼈대 (거의 수정할 일 없음)
├── styles.css              # 디자인/색상/레이아웃 (디자인 바꿀 때만)
├── app.js                  # 동작 로직 (수정할 일 없음)
├── data/                   # ★ 콘텐츠는 여기서 수정합니다 ★
│   ├── projects.json       # 연구 프로젝트
│   ├── publications.json   # 논문 (저널·학회·진행중)
│   ├── partners.json       # 협력기관 로고
│   ├── courses.json        # 강의
│   │                       #  ↓ 멤버·Activity: 항목 하나 = 파일 하나 (폴더형)
│   ├── members/            # 멤버 (한 명 = 파일 하나, group 으로 분류)
│   │   ├── _index.json     #   멤버 목록 (파일 이름들)
│   │   ├── 신민영.json       #   멤버 1명
│   │   └── ...
│   ├── notices/            # 공지 (모집·내부 대회 등)
│   │   ├── _index.json     #   글 목록 (파일 이름들)
│   │   ├── recruit.json    #   공지 1건
│   │   └── ...
│   ├── news/               # 연구실 소식 (행사·수상·학위심사)
│   ├── conferences/        # 학회 참가
│   ├── posts/              # 뉴스레터 (학생 후기/블로그)
│   └── studies/            # 학부생 스터디 기록
└── images/                 # ★ 사진은 여기에 올립니다 ★
    ├── members/            # 멤버·교수 사진
    ├── partners/           # 협력기관 / 프로젝트 지원기관 로고
    ├── news/               # News(연구실 소식) 사진
    ├── conferences/        # 학회 사진
    ├── posts/              # 뉴스레터(후기) 사진
    ├── study/              # 스터디 사진
    └── site/               # 로고, 메인 사진(hero.jpeg), 소개 영상(intro.mp4)
```

> **핵심:** 평소엔 `data/` 의 JSON 파일과 `images/` 의 사진만 만지면 됩니다.

---

## ✏️ 콘텐츠 수정 방법

`data/` 안의 `.json` 파일을 내려받아 편집 후 다시 올리면 됩니다.

### 멤버 추가 — `data/members/<이름>.json` (Activity 와 동일한 폴더형)
멤버도 **한 명 = 파일 하나** 입니다. 새 멤버를 넣을 때:
1. `data/members/` 에 `<이름>.json` 파일을 만들고 아래 형식으로 작성합니다. — 예: `data/members/홍길동.json`
2. `data/members/_index.json` 의 목록에 그 **이름(파일명)** 을 한 줄 추가합니다. (목록의 순서대로 화면에 표시됩니다)
```json
{
  "id": "홍길동",
  "group": "masters",
  "ko": "홍길동",
  "en": "Hong, Gildong",
  "init": "GH",
  "img": "홍길동.png",
  "degree": "석사과정",
  "email": "gildong@g.skku.edu",
  "education": ["B.S. 통계학, 성균관대학교 (2025)", "M.S. 산업공학, 성균관대학교 (2025 – Present)"],
  "ri": ["Healthcare", "NLP"],
  "blocks": [ { "p": "프로필 상세 페이지에 블로그처럼 길게 쓰는 본문입니다." } ]
}
```
- `id` 파일명과 동일하게 · `group` 소속 그룹 = `masters`(석사) / `undergraduate`(학부) / `parttime`(비학위) / `alumni`(졸업생) — 이 값으로 어느 묶음에 표시될지 정해집니다.

**카드(목록)에 보이는 것:** `ko` 한글 이름 · `en` 영문 이름 · `ri` 연구 관심사 태그 · `img` 사진(`init` 은 사진 없을 때 표시되는 이니셜)

**카드를 클릭하면 나오는 상세 페이지**에 아래가 추가로 표시됩니다 (비워 두면 그 줄은 숨겨짐):
- `degree` 지위 — 예: `"석사과정"`, `"박사과정"`
- `email` 이메일 주소
- `education` 학력 — 여러 줄 가능. **입학·졸업 연도는 여기에 적습니다**: `["B.S. ... (2025)", "M.S. ... (2025 – Present)"]`
- `blocks` **자기소개 본문** — 블로그처럼 길게 작성. `{ "p": "문단" }`(글) / `{ "img": "사진.png", "cap": "설명" }`(사진)을 순서대로. 본문 사진은 `images/members/` 에 올립니다.

- `img`/사진: 적은 파일명과 **똑같은 이름**의 사진을 `images/members/` 에 올리면 자동 표시됩니다. 사진이 없으면 `img` 를 `""` 로 두면 이니셜이 보입니다.

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

### Activity (공지·소식·학회·후기·스터디·앨범)
Activity 메뉴는 5개 섹션(`notices` · `news` · `conferences` · `posts` · `studies`)으로 나뉩니다.
각 섹션은 **글 하나 = 파일 하나** 로 관리합니다.

> **📌 새 글 올리는 법 (2단계)**
> 1. `data/<섹션>/` 폴더에 `<id>.json` 파일을 새로 만들고 글 1건(아래 형식)을 적습니다. — 예: `data/notices/recruit-2027.json`
> 2. 같은 폴더의 `_index.json` 의 목록에 그 **id(파일명, 확장자 제외)** 를 한 줄 추가합니다.
>    ```json
>    ["recruit", "healthcare-agentic-ai-challenge-2026", "recruit-2027"]
>    ```
> 글을 지울 때는 파일 삭제 + `_index.json` 에서 그 줄을 빼면 됩니다. (화면 순서는 게시일/고정 기준으로 자동 정렬되므로 목록 순서는 상관없습니다.)

> **공통:** 모든 글에는 고유 `id` (파일명과 동일)와 게시일 `posted` 를 적습니다. `posted` 형식은 `"2026-06-26"` (연-월-일). **올린 날짜를 기본으로 적되, 원하면 언제든 수정**할 수 있습니다. 화면에는 `2026.06.26` 으로 표시됩니다.
> `blocks` 는 본문이며 `{ "p": "문단" }` (글) 또는 `{ "img": "사진.png", "cap": "설명" }` (사진)을 순서대로 넣습니다.

아래는 각 파일(`data/<섹션>/<id>.json`)에 들어갈 **글 1건의 형식**입니다.

**① 공지 — `data/notices/<id>.json`** (게시판형 리스트, 모집 글은 맨 위 고정)
```json
{ "id": "comp-2026", "pinned": false, "tag": "대회", "posted": "2026-07-01",
  "deadline": "2026-07-20", "title": "공지 제목",
  "link": "https://신청링크", "linkText": "신청하기",
  "blocks": [ { "p": "공지 본문" } ] }
```
- `pinned` 가 `true` 면 항상 맨 위에 고정됩니다(연구자 모집 글에 사용). · `deadline` 마감일(선택) · `link`/`linkText` 신청·바로가기 버튼(선택)

**② 연구실 소식 — `data/news/<id>.json`** (행사·수상·학위논문 심사 등, 카드형)
```json
{ "id": "award-2026", "tag": "수상", "term": "2026 · Spring", "posted": "2026-06-01",
  "title": "소식 제목", "hero": "대표사진.png", "blocks": [ { "p": "본문" } ] }
```
- 사진은 `images/news/` 에 올립니다. · `hero` 대표 사진(없으면 `""`)

**③ 학회 — `data/conferences/<id>.json`** (학회 참가 기록, 카드형)
```json
{ "id": "kiie-2026", "tag": "Conference", "venue": "대한산업공학회", "term": "2026 · Spring",
  "posted": "2026-06-23", "date": "2026년 6월 18일 - 21일 · 제주", "title": "학회 제목",
  "hero": "대표사진.png", "blocks": [ { "p": "본문" }, { "img": "사진.png", "cap": "설명" } ] }
```
- 사진은 `images/conferences/` 에 올립니다. · `date` 학회 일정/장소 · `venue` 학회명(선택)

**④ 뉴스레터 — `data/posts/<id>.json`** (학회 후기 인터뷰, 작성자 표시)

질문 4개는 **고정**입니다. 글마다 `answers` 에 답 4개만 채우면 자동으로 인터뷰 형식(Q1~Q4)으로 표시됩니다.
> Q1. 학회에 가기 전 가장 기대했던 점은 무엇이었나요?
> Q2. 현장에서 가장 기억에 남았던 발표, 사람, 장면은 무엇이었나요?
> Q3. 이번 학회를 통해 새롭게 알게 되거나 생각이 바뀐 부분이 있나요?
> Q4. AIHC Lab 구성원으로서 앞으로 어떤 연구를 해보고 싶어졌나요?
```json
{ "id": "review-1", "tag": "학회 후기", "author": "홍길동", "authorImg": "홍길동.png",
  "conf": "KIIE 2026", "posted": "2026-06-25", "title": "후기 제목",
  "excerpt": "목록에 보일 짧은 미리보기", "hero": "대표사진.png",
  "answers": ["Q1 답변", "Q2 답변", "Q3 답변", "Q4 답변"],
  "photos": ["사진1.jpeg", "사진2.jpeg"] }
```
- `author` 작성자 · `authorImg` 작성자 사진(`images/members/` 파일명) · `conf` 관련 학회 · `excerpt` 카드 미리보기(없으면 첫 답변 사용)
- `answers` 답변 4개(빈 답은 자동 생략) · `photos` 답변 아래 붙는 사진(선택) · `hero` 대표 사진 · 사진은 모두 `images/posts/` 에
- 인터뷰가 아닌 자유형 글을 쓰고 싶으면 `answers` 대신 `blocks`(②③ 와 동일)을 쓰면 됩니다.

**⑤ 스터디 — `data/studies/<id>.json`** (스터디 기록, 게시판형)
```json
{ "id": "ml-2026", "tag": "논문 리뷰", "topic": "머신러닝 기초", "members": "참여자 이름들",
  "posted": "2026-06-26", "title": "스터디 제목", "link": "https://자료링크", "linkText": "자료 보기",
  "blocks": [ { "p": "본문" } ] }
```
- `topic` 주제 · `members` 참여자 · `link`/`linkText` 발표자료·노션 링크(선택) · 사진은 `images/study/`

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
약 1분 뒤 https://skku-aihclab.github.io/aihc-lab/ 에 자동 반영됩니다.
