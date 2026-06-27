/* ===================================================================
   AI-Healthcare Lab — app.js
   콘텐츠(멤버·프로젝트·논문·공지·학회 등)는 data/ 폴더의 JSON 파일에서 불러옵니다.
   내용을 바꾸려면 이 파일이 아니라 data/*.json 을 편집하세요.
   =================================================================== */

const $ = id => document.getElementById(id);
const enc = s => encodeURIComponent(s);

const palette = [
  'linear-gradient(140deg,#0d2a52,#0064E0)',
  'linear-gradient(140deg,#1C2B33,#3A4248)',
  'linear-gradient(140deg,#3a2a6b,#6B4FBB)',
  'linear-gradient(140deg,#063a36,#0e7c70)'
];

/* 데이터 보관 (data 폴더의 JSON 로드 후 채워짐) — open/render 함수들이 참조 */
let notices = [], news = [], conferences = [], posts = [], studies = [];

/* 날짜 포맷: "2026-06-26" → "2026.06.26". 날짜 형식이 아니면(예: "상시") 그대로 표시 */
function fmtDate(s) {
  if (!s) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s).trim());
  return m ? `${m[1]}.${m[2]}.${m[3]}` : s;
}

/* ---------- People ---------- */
const memberMap = {};
const GROUP_LABEL = { masters: 'Master Student', undergraduate: 'Undergraduate Student', parttime: 'Part-time Master Student', alumni: 'Alumni' };
const GROUP_GRID = { masters: 'masterGrid', undergraduate: 'ugGrid', parttime: 'ptGrid', alumni: 'alumniGrid' };
/* 멤버 파일(data/members/*.json)들을 group 필드 기준으로 분류해 카드 렌더 + 상세용 lookup 등록 */
function setupMembers(arr) {
  const buckets = {};
  arr.forEach((m, i) => {
    m._group = GROUP_LABEL[m.group] || '';
    m._bg = palette[i % palette.length];
    memberMap[m.id] = m;
    (buckets[m.group] || (buckets[m.group] = [])).push(m);
  });
  Object.keys(GROUP_GRID).forEach(g => {
    const el = $(GROUP_GRID[g]);
    if (!el) return;
    const items = buckets[g] || [];
    el.innerHTML = items.map(pc).join('');
    /* 멤버가 없는 그룹은 제목까지 숨김 (예: 비학위 인원이 없을 때) */
    const empty = items.length === 0;
    el.style.display = empty ? 'none' : '';
    const heading = el.previousElementSibling;
    if (heading && heading.classList.contains('sub-head')) heading.style.display = empty ? 'none' : '';
  });
}
/* 지위 한 줄(영문) — role 이 있으면 그걸, 없으면 소속 그룹 라벨 */
function memberRole(m) {
  return m.role || m._group || '';
}
/* 입학 시점(admit: "YYYY-spring"|"YYYY-fall") 기준으로 현재 석사 학기 자동 계산.
   봄학기=3~8월, 가을학기=9~12월(1~2월은 직전 가을). 석사는 최대 4학기. */
function semIndex(year, month) {
  if (month >= 3 && month <= 8) return year * 2;      // 봄학기
  if (month >= 9) return year * 2 + 1;                // 가을학기
  return (year - 1) * 2 + 1;                          // 1~2월 → 직전 가을
}
function masterTerm(m) {
  if (!m || !m.admit) return (m && m.degree) || '';
  const [y, t] = String(m.admit).split('-');
  const admitIdx = (+y) * 2 + (t === 'fall' ? 1 : 0);
  const d = new Date();
  const n = semIndex(d.getFullYear(), d.getMonth() + 1) - admitIdx + 1;
  if (n < 1) return '입학 예정';
  if (n > 4) return '수료';
  return `석사 ${n}학기`;
}
/* 카드: 클릭 전에도 사진·이름·지위·기간·관심사·학력·이메일을 모두 표시 (클릭 시 블로그 본문 추가) */
const pc = p => {
  const ri = (p.ri || []).filter(Boolean).join(', ');
  const edu = (p.education || []).filter(Boolean);
  return `<div class="person-card reveal" data-open="member:${p.id}">
    <div class="pc-avatar" style="background:${p._bg}">${p.img ? `<img src="images/members/${enc(p.img)}" alt="${p.en || p.ko}" onerror="this.remove()">` : (p.init || '')}</div>
    <h4 class="pc-name">${p.en ? `${p.en} <span class="pc-ko">(${p.ko})</span>` : p.ko}</h4>
    <div class="pc-role">${memberRole(p)}</div>
    ${p.admit ? `<div class="pc-term">${masterTerm(p)}</div>` : ''}
    <div class="pc-divider"></div>
    ${ri ? `<div class="pc-sec"><h5>Research Interests</h5><p>${ri}</p></div>` : ''}
    ${edu.length ? `<div class="pc-sec"><h5>Education</h5><p>${edu.join('<br>')}</p></div>` : ''}
    ${p.email ? `<div class="pc-sec pc-email"><h5>Email</h5><a href="mailto:${p.email}" onclick="event.stopPropagation()">${p.email}</a></div>` : ''}
  </div>`;
};

/* ---------- Member 상세 페이지 (블로그형 — blocks 로 사진·긴 글 작성 가능) ---------- */
function openMember(id) {
  const m = memberMap[id]; if (!m) return;
  const avatar = `<div class="md-avatar" style="background:${m._bg}">${m.img ? `<img src="images/members/${enc(m.img)}" alt="${m.en || m.ko}" onerror="this.remove()">` : ''}${m.init || ''}</div>`;
  const tags = (m.ri || []).filter(Boolean).map(t => `<span class="mini-tag">${t}</span>`).join('');
  const rows = [];
  if (m.email) rows.push(`<div class="md-row"><span class="md-k">Email</span><a class="md-v" href="mailto:${m.email}">${m.email}</a></div>`);
  const edu = (m.education && m.education.length) ? `<div class="md-sec"><h3>Education</h3><ul class="md-edu">${m.education.map(e => `<li>${e}</li>`).join('')}</ul></div>` : '';
  const body = (m.blocks || []).map(b => {
    if (b.p) return `<p>${b.p}</p>`;
    if (b.img) return `<figure><div class="imgbox"><img src="images/members/${enc(b.img)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div><figcaption>${b.cap || ''}</figcaption></figure>`;
    return '';
  }).join('');
  const story = body ? `<div class="md-bio">${body}</div>` : '';
  $('memberMount').innerHTML = `
    <div class="crumb"><a data-go="members" data-scroll="m-students">Members</a> › <span>${m.ko}</span></div>
    <div class="md-head">
      ${avatar}
      <div class="md-info">
        <div class="md-group">${memberRole(m)}${m.admit ? ` · ${masterTerm(m)}` : ''}</div>
        <h1>${m.ko}</h1>
        ${m.en ? `<div class="md-en">${m.en}</div>` : ''}
        ${tags ? `<div class="tag-line md-tags">${tags}</div>` : ''}
        ${rows.join('')}
      </div>
    </div>
    ${edu}
    ${story}
    <button class="back-btn" data-go="members" data-scroll="m-students">← Members 목록으로</button>`;
  go('member-detail');
}

/* ---------- 공용 상세 기사 (Notice / News / Conference / Newsletter / Study 공유) ---------- */
const SECTIONS = {
  notice:     { list: () => notices,     folder: 'notice',      label: 'Notice',      anchor: 'ac-notice' },
  news:       { list: () => news,        folder: 'news',        label: 'News',        anchor: 'ac-news' },
  conference: { list: () => conferences, folder: 'conferences', label: 'Conferences', anchor: 'ac-conf' },
  post:       { list: () => posts,       folder: 'posts',       label: 'Newsletter',  anchor: 'ac-letter' },
  study:      { list: () => studies,     folder: 'study',       label: 'Study',       anchor: 'ac-study' }
};

function articleMeta(type, n) {
  const m = [];
  if (n.tag) m.push(`<span class="badge">${n.tag}</span>`);
  if (n.posted) m.push(`<span class="adate">게시일 ${fmtDate(n.posted)}</span>`);
  if (type === 'conference' && n.date) m.push(`<span class="adate">${n.date}</span>`);
  if (type === 'notice' && n.deadline) m.push(`<span class="adate">마감 ${fmtDate(n.deadline)}</span>`);
  if (type === 'post' && (n.conf || n.author)) m.push(`<span class="adate">${n.conf || n.author}</span>`);
  if (type === 'study') {
    if (n.topic) m.push(`<span class="adate">${n.topic}</span>`);
    if (n.members) m.push(`<span class="adate">${n.members}</span>`);
  }
  return m.join('');
}

/* Newsletter(카드뉴스 인터뷰) 고정 질문 — 후기 종류별로 질문만 정의하고,
   글에서는 people[].qa[]에 답(a)과 사진(img)만 채우면 됩니다 */
const POST_QUESTIONS = {
  '학회 후기': [
    '간단한 자기소개 부탁드립니다!',
    '학회 중 기억에 남는 순간이 언제인가요?',
    '학회 소감과 앞으로의 계획이 있나요?'
  ],
  '실험 후기': [
    '간단한 자기소개 부탁드립니다!',
    '이번에 어떤 실험에 참여하셨나요?',
    '실험하면서 가장 기억에 남는 순간은 무엇인가요?',
    '실험 후기와 앞으로의 계획이 있나요?'
  ]
};
const DEFAULT_QUESTIONS = POST_QUESTIONS['학회 후기'];

/* 글 데이터를 참여자(people) 배열로 정규화 — 구버전(answers/단일 작성자)도 호환 */
function postPeople(p) {
  if (Array.isArray(p.people)) return p.people;
  if (Array.isArray(p.answers))
    return [{ author: p.author, authorImg: p.authorImg, interests: p.interests,
              term: p.term, qa: p.answers.map(a => ({ a })) }];
  return null;
}

function openArticle(type, id) {
  const sec = SECTIONS[type]; if (!sec) return;
  const n = sec.list().find(x => x.id === id); if (!n) return;
  /* 포스트(뉴스레터) 이미지는 글마다 폴더로 분리: images/posts/<글id>/ */
  const f = type === 'post' ? `posts/${n.id}` : sec.folder;
  const fig = im => `<figure><div class="imgbox"><img src="images/${f}/${enc(im)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div></figure>`;
  let body = (n.blocks || []).map(b => {
    if (b.p) return `<p>${b.p}</p>`;
    if (b.img) return `<figure><div class="imgbox"><img src="images/${f}/${enc(b.img)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div><figcaption>${b.cap || ''}</figcaption></figure>`;
    return '';
  }).join('');
  const people = type === 'post' ? postPeople(n) : null;
  if (people) {
    const qs = POST_QUESTIONS[n.tag] || DEFAULT_QUESTIONS;
    body = people.map(person => {
      /* 프로필 정보는 멤버 데이터(data/members)에서 재사용 — 글에는 이름·답변만 채우면 됨 */
      const mem = memberMap[person.author] || {};
      const photoFile = person.authorImg || mem.img;
      const photo = photoFile
        ? `<div class="iv-photo"><img src="images/members/${enc(photoFile)}" alt="${person.author || ''}" onerror="this.parentElement.classList.add('noimg');this.remove()"></div>`
        : '<div class="iv-photo noimg"></div>';
      const program = person.program || masterTerm(mem) || '';
      const interests = person.interests || (mem.ri || []).filter(Boolean).join(', ');
      const email = person.email || mem.email || '';
      const meta = [];
      if (interests) meta.push(`<dt>Research Interests</dt><dd>${interests}</dd>`);
      if (email) meta.push(`<dt>Email</dt><dd><a href="mailto:${email}" onclick="event.stopPropagation()">${email}</a></dd>`);
      const qa = qs.map((q, i) => {
        const item = (person.qa && person.qa[i]) || {};
        const a = (item.a || '').trim();
        if (!a) return '';
        const shot = item.img
          ? `<div class="iv-shot"><img src="images/${f}/${enc(item.img)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div>`
          : '';
        return `<div class="iv-block">
          <div class="iv-q"><span>${q}</span></div>
          <div class="iv-row${item.img ? '' : ' nophoto'}">${shot}<div class="iv-bubble">${a}</div></div>
        </div>`;
      }).join('');
      return `<section class="iv-card">
        <div class="iv-head">
          <div class="iv-id">
            <h3 class="iv-name">${person.author || ''}${program ? `<span>${program}</span>` : ''}</h3>
            ${meta.length ? `<dl class="iv-meta">${meta.join('')}</dl>` : ''}
          </div>
          ${photo}
        </div>
        <div class="iv-qa">${qa}</div>
      </section>`;
    }).join('');
  }
  const hero = (n.hero && type !== 'post') ? `<div class="imgbox"><img src="images/${f}/${enc(n.hero)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div>` : '';
  const ext = n.link && !n.link.startsWith('mailto:');
  const link = n.link ? `<p style="margin-top:28px"><a class="btn btn-cobalt" href="${n.link}"${ext ? ' target="_blank" rel="noopener"' : ''}>${n.linkText || '바로가기 →'}</a></p>` : '';
  /* 첨부파일 — files/<섹션폴더>/<글id>/<파일명>. 항목: "파일.pdf" 또는 {file,label} */
  const attach = (n.attachments && n.attachments.length) ? `<div class="attach"><div class="attach-h">첨부파일</div>${n.attachments.map(a => {
    const file = typeof a === 'string' ? a : a.file;
    const label = (typeof a === 'object' && a.label) || file;
    return `<a class="att-item" href="files/${f}/${enc(n.id)}/${enc(file)}" download><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg><span>${label}</span></a>`;
  }).join('')}</div>` : '';
  $('articleMount').innerHTML = `
    <div class="crumb"><a data-go="activity" data-scroll="${sec.anchor}">Activity</a> › <a data-go="activity" data-scroll="${sec.anchor}">${sec.label}</a> › <span>${n.title}</span></div>
    <h1>${n.title}</h1>
    <div class="ameta">${articleMeta(type, n)}</div>
    ${hero}
    ${body}
    ${attach}
    ${link}
    <button class="back-btn" data-go="activity" data-scroll="${sec.anchor}">← ${sec.label} 목록으로</button>`;
  go('article-detail');
}

/* ---------- 게시판형 리스트 (Notice / Study 공유) ---------- */
function renderBoard(mountId, items, type) {
  const sorted = [...items].sort((a, b) =>
    (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || String(b.posted || '').localeCompare(String(a.posted || '')));
  $(mountId).innerHTML = sorted.map(it => `<div class="nb-row reveal" data-open="${type}:${it.id}">
    <div class="nb-main">
      ${it.pinned ? '<span class="pin">📌 고정</span>' : ''}
      ${it.tag ? `<span class="nb-tag">${it.tag}</span>` : ''}
      <span class="nb-title">${it.title}</span>
    </div>
    <div class="nb-meta">
      ${it.deadline ? `<span class="nb-deadline">마감 ${fmtDate(it.deadline)}</span>` : ''}
      <span class="nb-date">${fmtDate(it.posted)}</span>
    </div>
  </div>`).join('') || '<div class="nb-empty">아직 등록된 글이 없습니다.</div>';
}

/* ---------- 학회 카드 그리드 ---------- */
function cardThumb(folder, hero) {
  const icon = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="M21 15l-5-5L5 21"/></svg>';
  if (hero) return `<div class="cthumb"><img src="images/${folder}/${enc(hero)}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='${icon.replace(/'/g, "&#39;")}'"></div>`;
  return `<div class="cthumb">${icon}</div>`;
}
function renderCardGrid(mountId, items, type, folder) {
  const sorted = [...items].sort((a, b) => String(b.posted || '').localeCompare(String(a.posted || '')));
  $(mountId).innerHTML = sorted.map(c => `<div class="conf-card reveal" data-open="${type}:${c.id}">
    ${cardThumb(folder, c.hero)}
    <div class="conf-body">
      <div class="conf-term">${c.term || fmtDate(c.posted)}</div>
      <h4>${c.title}</h4>
      <div class="conf-foot"><span class="ctag">${c.tag || ''}</span><span class="nb-date">${fmtDate(c.posted)}</span></div>
    </div>
  </div>`).join('') || '<div class="nb-empty">아직 등록된 글이 없습니다.</div>';
}

/* ---------- 뉴스레터(블로그) 카드 ---------- */
/* 후기 종류 아이콘 — 행사 단위 글이라 특정 작성자 사진 대신 표시 */
function postIcon(tag) {
  if (tag === '실험 후기')
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v5.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 8.5V3"/><path d="M7.5 14h9"/></svg>';
  if (tag === '학회 후기')
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h18v11H3z"/><path d="M12 15v4"/><path d="M8 21h8"/></svg>';
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13v14H4z"/><path d="M17 8h3v9a2 2 0 0 1-2 2h-1"/><path d="M7 8h7M7 12h7M7 16h4"/></svg>';
}
/* 대표사진 썸네일 — 아이콘을 깔고 hero(images/posts) 사진으로 덮음. 사진 없거나 로드 실패 시 아이콘 노출 */
function postThumb(p) {
  const img = p.hero ? `<img src="images/posts/${enc(p.id)}/${enc(p.hero)}" alt="" onerror="this.remove()">` : '';
  return `<div class="cthumb thumb-ph">${postIcon(p.tag)}${img}</div>`;
}
function renderPostGrid() {
  const sorted = [...posts].sort((a, b) => String(b.posted || '').localeCompare(String(a.posted || '')));
  $('postGrid').innerHTML = sorted.map(p => {
    const people = postPeople(p) || [];
    const sub = `${fmtDate(p.posted)}${people.length ? ` · ${people.length}명 참여` : ''}`;
    const lead = people[0] || {};
    const excerpt = p.excerpt || (lead.qa && lead.qa.find(x => x && x.a) || {}).a || '';
    return `<div class="post-card reveal" data-open="post:${p.id}">
    ${postThumb(p)}
    <div class="conf-body">
      <div class="conf-term">${p.conf || ''}</div>
      <h4>${p.title}</h4>
      ${excerpt ? `<p class="post-excerpt">${excerpt}</p>` : ''}
      <div class="conf-foot"><span class="ctag">${p.tag || '후기'}</span><span class="nb-date">${sub}</span></div>
    </div>
  </div>`;
  }).join('') || '<div class="nb-empty">아직 등록된 글이 없습니다.</div>';
}

/* ---------- 홈 'Lab News' — 공지/학회/뉴스레터 최신 묶음 ---------- */
function renderLatest() {
  const merged = [
    ...notices.filter(n => !n.pinned).map(n => ({ n, t: 'notice' })),
    ...news.map(n => ({ n, t: 'news' })),
    ...conferences.map(n => ({ n, t: 'conference' })),
    ...posts.map(n => ({ n, t: 'post' }))
  ].sort((a, b) => String(b.n.posted || '').localeCompare(String(a.n.posted || ''))).slice(0, 5);
  $('latestNews').innerHTML = merged.map(({ n, t }) =>
    `<div class="news-row reveal" data-open="${t}:${n.id}"><span class="nt"><span class="rtag">${n.tag || ''}</span>${n.title}</span><span class="nd">${fmtDate(n.posted)}</span></div>`).join('');
}

/* ---------- Publications renderers ---------- */
const progItem = p => { const b = p.s === 'rev' ? '<span class="badge badge-rev">Under Revision</span>' : '<span class="badge badge-prog">Submitted</span>'; return `<div class="pub-item reveal"><div class="pub-year">${b}</div><div class="pub-body"><div class="ptitle">${p.t}</div><div class="pauthors">${p.a}</div><div class="pvenue">${p.v}</div></div></div>`; };
const jItem = p => { const v = p.d ? `${p.v} · <a href="${p.d}" target="_blank">DOI</a>` : p.v; return `<div class="pub-item reveal"><div class="pub-year">${p.y}<span class="badge badge-journal">Journal</span></div><div class="pub-body"><div class="ptitle">${p.t}</div><div class="pauthors">${p.a}</div><div class="pvenue">${v}</div></div></div>`; };
const cItem = p => `<div class="pub-item reveal"><div class="pub-year">${p.y}<span class="badge badge-conf">Conf.</span></div><div class="pub-body"><div class="ptitle">${p.t}</div><div class="pauthors">${p.a}</div><div class="pvenue">${p.v}</div></div></div>`;

/* ---------------- ROUTING ---------------- */
const pages = document.querySelectorAll('.page');
const pills = document.querySelectorAll('.pill[data-page]');
function setTab(tab) {
  document.querySelectorAll('.subtab').forEach(x => x.classList.toggle('active', x.dataset.pub === tab));
  document.querySelectorAll('.pub-group').forEach(x => x.classList.remove('active'));
  const g = $('pub-' + tab); if (g) g.classList.add('active');
}
function go(id, scrollTo, tab) {
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  const pillId = (id === 'article-detail') ? 'activity' : (id === 'member-detail') ? 'members' : id;
  pills.forEach(p => p.classList.toggle('active', p.dataset.page === pillId));
  if (id === 'publications' && tab) setTab(tab);
  closeDrawer();
  setTimeout(() => {
    if (scrollTo) { const el = $(scrollTo); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }
    else { window.scrollTo({ top: 0, behavior: 'auto' }); }
    runReveal(); runCounters();
  }, 50);
}
document.addEventListener('click', e => {
  const cb = e.target.closest('[data-track]');
  if (cb) { e.preventDefault(); const tr = $(cb.dataset.track); if (tr) tr.scrollBy({ left: (+cb.dataset.dir) * Math.max(tr.clientWidth * 0.8, 320), behavior: 'smooth' }); return; }
  const op = e.target.closest('[data-open]');
  if (op) { e.preventDefault(); const s = op.dataset.open; const i = s.indexOf(':'); const type = s.slice(0, i), id = s.slice(i + 1); if (type === 'member') openMember(id); else openArticle(type, id); return; }
  const t = e.target.closest('[data-go]');
  if (t) { e.preventDefault(); go(t.dataset.go, t.dataset.scroll, t.dataset.tab); }
});
document.querySelectorAll('.subtab').forEach(t => t.addEventListener('click', () => { setTab(t.dataset.pub); setTimeout(runReveal, 40); }));

/* mobile drawer */
const drawer = $('drawer');
function closeDrawer() { drawer.classList.remove('open'); }
$('hamburger').addEventListener('click', () => drawer.classList.add('open'));
$('drawerClose').addEventListener('click', closeDrawer);
drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });
document.querySelectorAll('.dtoggle').forEach(b => b.addEventListener('click', () => {
  const g = b.parentElement; g.classList.toggle('open');
  b.querySelector('span').textContent = g.classList.contains('open') ? '-' : '+';
}));

/* ---------------- REVEAL ---------------- */
let io;
function runReveal() {
  const els = document.querySelectorAll('.page.active .reveal:not(.in)');
  if (!io) { io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }); }
  els.forEach(el => io.observe(el));
}
/* ---------------- COUNTERS ---------------- */
let cio;
function runCounters() {
  const nums = document.querySelectorAll('.page.active .num[data-count]:not(.done)');
  if (!cio) { cio = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { animateCount(e.target); e.target.classList.add('done'); cio.unobserve(e.target); } }); }, { threshold: 0.4 }); }
  nums.forEach(n => cio.observe(n));
}
function animateCount(el) {
  const target = +el.dataset.count; const dur = 1100; const start = performance.now();
  function step(now) { const p = Math.min((now - start) / dur, 1); const e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(target * e); if (p < 1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}

/* ---------------- INIT: load data/*.json then render ---------------- */
async function init() {
  const j = f => fetch('data/' + f, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error('불러오기 실패: ' + f); return r.json(); });
  /* 폴더형 컬렉션 로더: data/<dir>/_index.json 의 글 목록을 읽어 각 글 파일을 불러옵니다.
     글 추가는 data/<dir>/ 에 <id>.json 을 만들고 _index.json 목록에 id 한 줄을 더하면 됩니다. */
  const coll = async dir => {
    const ids = await j(dir + '/_index.json');
    const items = await Promise.all(ids.map(id =>
      j(dir + '/' + encodeURIComponent(id) + '.json').catch(e => { console.warn('건너뜀:', dir + '/' + id, e.message); return null; })
    ));
    return items.filter(Boolean);
  };
  let members, projects, partners, pubs, courses, noticesD, newsD, confD, postsD, studiesD;
  try {
    [members, projects, partners, pubs, courses,
      noticesD, newsD, confD, postsD, studiesD] = await Promise.all([
      coll('members'), j('projects.json'), j('partners.json'), j('publications.json'), j('courses.json'),
      coll('notices'), coll('news'), coll('conferences'), coll('posts'), coll('studies')
    ]);
  } catch (err) {
    console.error(err);
    return;
  }
  notices = noticesD; news = newsD; conferences = confD; posts = postsD; studies = studiesD;

  /* People */
  setupMembers(members);

  /* Projects */
  const projLogo = (pr, cls) => pr.icon ? `<img class="proj-logo${cls}" src="images/partners/${enc(pr.icon)}" alt="${pr.f}" onerror="this.remove()">` : '';
  $('projList').innerHTML = projects.map(pr => `<div class="proj-card reveal"><div class="proj-main">${projLogo(pr, '')}<div><div class="pt">${pr.t}</div><div class="pf">${pr.f}</div></div></div><div class="proj-period">${pr.p}</div></div>`).join('');
  $('latestProj').innerHTML = projects.slice(0, 3).map(pr => `<div class="lp-card reveal" data-go="research" data-scroll="r-projects"><div class="cat">${pr.cat}</div><h4>${pr.t}</h4><div class="lp-funder">${projLogo(pr, ' sm')}<span class="pf">${pr.f}</span></div><div class="per">${pr.p}</div></div>`).join('');

  /* Activity */
  renderBoard('noticeBoard', notices, 'notice');
  renderCardGrid('newsGrid', news, 'news', 'news');
  renderCardGrid('confGrid', conferences, 'conference', 'conferences');
  renderPostGrid();
  renderBoard('studyBoard', studies, 'study');
  renderLatest();

  /* Partners */
  $('partnerRow').innerHTML = partners.map(p => `<div class="partner reveal"><img class="plogo" src="images/partners/${enc(p.img)}" alt="${p.e}"></div>`).join('');

  /* Publications */
  $('pub-journal').innerHTML = pubs.journals.map(jItem).join('');
  $('pub-conf').innerHTML = pubs.conferences.map(cItem).join('');
  $('pub-prog').innerHTML = pubs.inProgress.map(progItem).join('');
  $('pub-all').innerHTML = pubs.journals.map(jItem).join('') + pubs.conferences.map(cItem).join('');

  /* Courses */
  $('courseGrid').innerHTML = courses.map(c => `<div class="course-card reveal"><div class="term">${c.cur ? '<span class="badge badge-success">Current</span>' : '<span class="badge badge-past">Past</span>'}<h4>${c.term}</h4></div><ul>${c.c.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('');

  runReveal(); runCounters();
}
init();
