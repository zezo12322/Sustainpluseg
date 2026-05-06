/* projects-render.js — fetches data/projects.json and renders cards dynamically */
(async function () {
  const isAr = document.documentElement.lang === 'ar';
  const base  = isAr ? '../' : '';
  const lang  = isAr ? 'ar' : 'en';
  const lbl = {
    view:   isAr ? 'عرض التفاصيل' : 'View Details',
    prefix: isAr ? 'عرض المشروع: ' : 'View: ',
  };

  let projects;
  try {
    const res = await fetch(`${base}data/projects.json`);
    if (!res.ok) throw new Error(res.status);
    projects = (await res.json()).projects;
  } catch (e) {
    console.error('[projects-render] failed to load projects.json:', e);
    return;
  }

  const grid         = document.getElementById('projectsGrid');
  const featuredGrid = document.getElementById('featuredProjectsGrid');

  if (grid) {
    grid.innerHTML = projects.map((p, i) => cardHTML(p, i)).join('');
    if (window.AOS) AOS.refresh();
    initFilter();
  }

  if (featuredGrid) {
    const featured = projects.filter(p => p.featured).slice(0, 3);
    featuredGrid.innerHTML = featured.map((p, i) => cardHTML(p, i)).join('');
    if (window.AOS) AOS.refresh();
  }

  function cardHTML(p, i) {
    const t       = p[lang];
    const iconEsc = (p.icon || 'fa-solid fa-leaf').replace(/"/g, '&quot;');
    const title   = t.title.replace(/"/g, '&quot;');
    const tag     = t.tag.replace(/"/g, '&quot;');
    const desc    = t.fullDesc.replace(/"/g, '&quot;');
    return `<article class="project-card" data-filter="${p.category}"
      data-modal="true"
      data-img="${p.image}"
      data-title="${title}"
      data-tag="${tag}"
      data-desc="${desc}"
      tabindex="0" role="button"
      aria-label="${lbl.prefix}${title}"
      data-aos="fade-up" data-aos-delay="${i * 60}">
      <div class="project-thumb">
        <img src="${p.image}" alt="${title}" width="600" height="375" loading="lazy"
          onerror="this.parentElement.classList.add('img-placeholder');this.style.display='none';this.parentElement.innerHTML='<i class=&quot;${iconEsc}&quot; style=&quot;font-size:4rem;color:var(--primary)&quot;></i>'" />
        <div class="project-overlay" aria-hidden="true">
          <span class="project-overlay-btn"><i class="fa-solid fa-eye"></i> ${lbl.view}</span>
        </div>
      </div>
      <div class="project-info">
        <span class="project-tag">${t.tag}</span>
        <h3>${t.title}</h3>
        <p>${t.shortDesc}</p>
      </div>
    </article>`;
  }

  function initFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const f = btn.dataset.filter;
        document.querySelectorAll('.project-card[data-filter]').forEach(c => {
          c.classList.toggle('hidden', f !== 'all' && c.dataset.filter !== f);
        });
      });
    });
  }
})();
