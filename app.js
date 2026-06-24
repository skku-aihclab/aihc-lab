/* ===================================================================
   AI-Healthcare Lab — app.js
   콘텐츠(멤버·프로젝트·논문·뉴스 등)는 data/ 폴더의 JSON 파일에서 불러옵니다.
   내용을 바꾸려면 이 파일이 아니라 data/*.json 을 편집하세요.
   =================================================================== */

const $ = id => document.getElementById(id);

const palette = [
  'linear-gradient(140deg,#0d2a52,#0064E0)',
  'linear-gradient(140deg,#1C2B33,#3A4248)',
  'linear-gradient(140deg,#3a2a6b,#6B4FBB)',
  'linear-gradient(140deg,#063a36,#0e7c70)'
];

/* 데이터 보관 (data/*.json 로드 후 채워짐) — open* 함수들이 참조 */
let news = [], seminars = [], albums = [];

/* ---------- People ---------- */
const pc = (p, i) => `<div class="person-card reveal"><div class="p-avatar" style="background:${palette[i % palette.length]}">${p.img ? `<img src="images/members/${encodeURIComponent(p.img)}" alt="${p.en}" onerror="this.remove()">` : ''}${p.init}</div><h4>${p.ko}</h4><div class="en">${p.en}</div><div class="tag-line">${p.ri.map(t => `<span class="mini-tag">${t}</span>`).join('')}</div></div>`;

/* ---------- Carousels (News / Seminar / Album) ---------- */
function cardThumb(folder, hero) {
  const icon = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="M21 15l-5-5L5 21"/></svg>';
  if (hero) return `<div class="cthumb"><img src="images/${folder}/${encodeURIComponent(hero)}" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='${icon.replace(/'/g, "&#39;")}'"></div>`;
  return `<div class="cthumb">${icon}</div>`;
}
function renderCarousel(trackId, items, folder, attr) {
  $(trackId).innerHTML = items.map(it => `<div class="ccard" ${attr}="${it.id}">
    ${cardThumb(folder, it.hero)}
    <div class="cbody"><div class="cdate">${it.term}</div><h4>${it.title}</h4><span class="ctag">${it.tag}</span></div>
  </div>`).join('');
}

/* ---------- News article ---------- */
const newsById = id => news.find(n => n.id === id);
function openNews(id) {
  const n = newsById(id); if (!n) return;
  const body = n.blocks.map(b => {
    if (b.p) return `<p>${b.p}</p>`;
    if (b.img) return `<figure><div class="imgbox"><img src="images/news/${encodeURIComponent(b.img)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div><figcaption>${b.cap || ''}</figcaption></figure>`;
    return '';
  }).join('');
  $('newsArticle').innerHTML = `
    <div class="crumb"><a data-go="activity" data-scroll="ac-news">Activity</a> › <a data-go="activity" data-scroll="ac-news">News</a> › <span>${n.title}</span></div>
    <h1>${n.title}</h1>
    <div class="ameta"><span class="badge">${n.tag}</span><span class="adate">${n.date}</span></div>
    <div class="imgbox"><img src="images/news/${encodeURIComponent(n.hero)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div>
    ${body}
    <button class="back-btn" data-go="activity" data-scroll="ac-news">← News 목록으로</button>`;
  go('news-detail');
}

/* ---------- Seminar / Album article (shared) ---------- */
function openDetail(list, id, folder, mountId, pageId, backScroll, crumbLabel) {
  const n = list.find(x => x.id === id); if (!n) return;
  const body = n.blocks.map(b => {
    if (b.p) return `<p>${b.p}</p>`;
    if (b.img) return `<figure><div class="imgbox"><img src="images/${folder}/${encodeURIComponent(b.img)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div><figcaption>${b.cap || ''}</figcaption></figure>`;
    return '';
  }).join('');
  const heroImg = n.hero ? `<div class="imgbox"><img src="images/${folder}/${encodeURIComponent(n.hero)}" alt="" onerror="this.parentElement.classList.add('noimg');this.remove()"></div>` : '';
  $(mountId).innerHTML = `
    <div class="crumb"><a data-go="activity" data-scroll="${backScroll}">Activity</a> › <a data-go="activity" data-scroll="${backScroll}">${crumbLabel}</a> › <span>${n.title}</span></div>
    <h1>${n.title}</h1>
    <div class="ameta"><span class="badge">${n.tag}</span><span class="adate">${n.date}</span></div>
    ${heroImg}
    ${body}
    <button class="back-btn" data-go="activity" data-scroll="${backScroll}">← ${crumbLabel} 목록으로</button>`;
  go(pageId);
}
const openSeminar = id => openDetail(seminars, id, 'seminar', 'seminarArticle', 'seminar-detail', 'ac-seminar', 'Seminar');
const openAlbum = id => openDetail(albums, id, 'album', 'albumArticle', 'album-detail', 'ac-album', 'Album');

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
  const pillId = (id === 'news-detail' || id === 'seminar-detail' || id === 'album-detail') ? 'activity' : id;
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
  const nt = e.target.closest('[data-news]');
  if (nt) { e.preventDefault(); openNews(nt.dataset.news); return; }
  const sm = e.target.closest('[data-seminar]');
  if (sm) { e.preventDefault(); openSeminar(sm.dataset.seminar); return; }
  const al = e.target.closest('[data-album]');
  if (al) { e.preventDefault(); openAlbum(al.dataset.album); return; }
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
  const j = f => fetch('data/' + f).then(r => { if (!r.ok) throw new Error('불러오기 실패: ' + f); return r.json(); });
  let members, projects, partners, pubs, courses, seminarsD, albumsD, newsD;
  try {
    [members, projects, newsD, seminarsD, albumsD, partners, pubs, courses] = await Promise.all([
      j('members.json'), j('projects.json'), j('news.json'), j('seminars.json'),
      j('albums.json'), j('partners.json'), j('publications.json'), j('courses.json')
    ]);
  } catch (err) {
    console.error(err);
    return;
  }
  news = newsD; seminars = seminarsD; albums = albumsD;

  /* People */
  $('masterGrid').innerHTML = members.masters.map(pc).join('');
  $('ugGrid').innerHTML = members.undergraduate.map(pc).join('');
  $('ptGrid').innerHTML = members.parttime.map(pc).join('');
  $('alumniGrid').innerHTML = members.alumni.map(pc).join('');

  /* Projects */
  const projLogo = (pr, cls) => pr.icon ? `<img class="proj-logo${cls}" src="images/partners/${encodeURIComponent(pr.icon)}" alt="${pr.f}" onerror="this.remove()">` : '';
  $('projList').innerHTML = projects.map(pr => `<div class="proj-card reveal"><div class="proj-main">${projLogo(pr, '')}<div><div class="pt">${pr.t}</div><div class="pf">${pr.f}</div></div></div><div class="proj-period">${pr.p}</div></div>`).join('');
  $('latestProj').innerHTML = projects.slice(0, 3).map(pr => `<div class="lp-card reveal" data-go="research" data-scroll="r-projects"><div class="cat">${pr.cat}</div><h4>${pr.t}</h4><div class="lp-funder">${projLogo(pr, ' sm')}<span class="pf">${pr.f}</span></div><div class="per">${pr.p}</div></div>`).join('');

  /* News */
  $('latestNews').innerHTML = news.map(n => `<div class="news-row reveal" data-news="${n.id}"><span class="nt"><span class="rtag">${n.tag}</span>${n.title}</span><span class="nd">${n.term.replace('2025 · ', '')} 2025</span></div>`).join('');
  renderCarousel('newsTrack', news, 'news', 'data-news');
  renderCarousel('seminarTrack', seminars, 'seminar', 'data-seminar');
  renderCarousel('albumTrack', albums, 'album', 'data-album');

  /* Partners */
  $('partnerRow').innerHTML = partners.map(p => `<div class="partner reveal"><img class="plogo" src="images/partners/${encodeURIComponent(p.img)}" alt="${p.e}"></div>`).join('');

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
