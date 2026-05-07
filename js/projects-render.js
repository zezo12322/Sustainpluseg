/* projects-render.js — local reads from Sanity, production reads from data/projects.json */

(async function () {
  const SANITY_PROJECT_ID = 'dpltiixd';
  const SANITY_DATASET = 'production';
  const SANITY_API_VERSION = '2025-01-01';

  const isAr = document.documentElement.lang === 'ar';
  const base = isAr ? '../' : '';
  const lang = isAr ? 'ar' : 'en';

  const lbl = {
    view: isAr ? 'عرض التفاصيل' : 'View Details',
    prefix: isAr ? 'عرض المشروع: ' : 'View: ',
  };

  function isLocalhost() {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }

  async function fetchProjectsFromSanity() {
    const query = `
      *[_type == "project"] | order(order asc) {
        _id,
        titleEn,
        titleAr,
        descriptionEn,
        descriptionAr,
        categoryEn,
        categoryAr,
        featured,
        order,
        "image": image.asset->url
      }
    `;

    const url =
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}` +
      `?query=${encodeURIComponent(query)}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Sanity request failed: ${res.status}`);
    }

    const data = await res.json();

    return (data.result || []).map((project) => ({
      id: project._id,
      category: project.categoryEn || '',
      featured: Boolean(project.featured),
      image: project.image || '',
      icon: 'fa-solid fa-leaf',

      en: {
        title: project.titleEn || '',
        tag: project.categoryEn || '',
        shortDesc: project.descriptionEn || '',
        fullDesc: project.descriptionEn || '',
      },

      ar: {
        title: project.titleAr || '',
        tag: project.categoryAr || '',
        shortDesc: project.descriptionAr || '',
        fullDesc: project.descriptionAr || '',
      },
    }));
  }

  async function fetchProjectsFromJson() {
    const res = await fetch(`${base}data/projects.json`);
    if (!res.ok) throw new Error(res.status);

    const data = await res.json();
    return data.projects || [];
  }

  async function loadProjects() {
    if (isLocalhost()) {
      try {
        console.log('[projects-render] loading projects from Sanity API');
        return await fetchProjectsFromSanity();
      } catch (e) {
        console.warn('[projects-render] Sanity failed, falling back to projects.json:', e);
        return await fetchProjectsFromJson();
      }
    }

    console.log('[projects-render] loading projects from data/projects.json');
    return await fetchProjectsFromJson();
  }

  let projects;

  try {
    projects = await loadProjects();
  } catch (e) {
    console.error('[projects-render] failed to load projects:', e);
    return;
  }

  const grid = document.getElementById('projectsGrid');
  const featuredGrid = document.getElementById('featuredProjectsGrid');

  if (grid) {
    grid.innerHTML = projects.map((p, i) => cardHTML(p, i)).join('');
    if (window.AOS) AOS.refresh();
    initFilter();
  }

  if (featuredGrid) {
    const featured = projects.filter((p) => p.featured).slice(0, 3);
    featuredGrid.innerHTML = featured.map((p, i) => cardHTML(p, i)).join('');
    if (window.AOS) AOS.refresh();
  }

  function esc(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function cardHTML(p, i) {
    const t = p[lang] || {};
    const iconEsc = esc(p.icon || 'fa-solid fa-leaf');
    const title = esc(t.title);
    const tag = esc(t.tag);
    const desc = esc(t.fullDesc);
    const shortDesc = esc(t.shortDesc);
    const image = p.image ? esc(p.image) : '';
    const category = esc(p.category);

    return `<article class="project-card" data-filter="${category}"
      data-modal="true"
      data-img="${image}"
      data-title="${title}"
      data-tag="${tag}"
      data-desc="${desc}"
      tabindex="0" role="button"
      aria-label="${lbl.prefix}${title}"
      data-aos="fade-up" data-aos-delay="${i * 60}">
      <div class="project-thumb ${image ? '' : 'img-placeholder'}">
  ${
    image
      ? `<img src="${image}" alt="${title}" width="600" height="375" loading="lazy"
        onerror="this.parentElement.classList.add('img-placeholder');this.style.display='none';this.parentElement.innerHTML='<i class=&quot;${iconEsc}&quot; style=&quot;font-size:4rem;color:var(--primary)&quot;></i>'" />`
      : `<i class="${iconEsc}" style="font-size:4rem;color:var(--primary)"></i>`
  }
  <div class="project-overlay" aria-hidden="true">
    <span class="project-overlay-btn"><i class="fa-solid fa-eye"></i> ${lbl.view}</span>
  </div>
</div>
      <div class="project-info">
        <span class="project-tag">${tag}</span>
        <h3>${title}</h3>
        <p>${shortDesc}</p>
      </div>
    </article>`;
  }

  function initFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    if (!btns.length) return;

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const f = btn.dataset.filter;

        document.querySelectorAll('.project-card[data-filter]').forEach((c) => {
          c.classList.toggle('hidden', f !== 'all' && c.dataset.filter !== f);
        });
      });
    });
  }
})();