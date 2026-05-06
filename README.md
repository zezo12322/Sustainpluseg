# Sustain Plus Website

Clean, fast, bilingual (EN/AR) environmental consultancy website. No WordPress, no heavy frameworks — pure HTML, CSS, JavaScript.

## File Structure

```
SUSTAINPLUS/
├── index.html              # EN Home
├── about.html              # EN About
├── services.html           # EN Services
├── projects.html           # EN Projects
├── contact.html            # EN Contact
├── ar/
│   ├── index.html          # AR Home (RTL)
│   ├── about.html          # AR About
│   ├── services.html       # AR Services
│   ├── projects.html       # AR Projects
│   └── contact.html        # AR Contact
├── css/
│   └── styles.css          # All styles + CSS variables + RTL support
├── js/
│   └── main.js             # Theme toggle, AOS, Swiper, modal, form validation
├── images/
│   ├── hero/               # Hero + section background images
│   ├── projects/           # Project thumbnail images
│   └── clients/            # Client logo images (client-1.png … client-15.png)
└── README.md
```

## Deploy

### Static hosting (simplest)
Upload the entire `SUSTAINPLUS/` folder to any static host:
- **Netlify**: drag-and-drop the folder at netlify.com/drop
- **Vercel**: `vercel deploy` from this directory
- **GitHub Pages**: push to a repo, enable Pages on `main` branch root
- **cPanel / FTP**: upload contents to `public_html/`

No build step required — open `index.html` directly in a browser for local preview.

## Add Images

Replace placeholder references with real WebP images:

| Path | Usage | Recommended size |
|------|-------|-----------------|
| `images/hero/hero-bg.jpg` | Hero background (all pages) | 1920×1080px |
| `images/hero/about-teaser.jpg` | Home about split | 800×600px |
| `images/hero/about-main.jpg` | About page split | 800×600px |
| `images/hero/consulting.jpg` | Services consulting section | 600×450px |
| `images/hero/permits.jpg` | Services permits section | 600×450px |
| `images/hero/training.jpg` | Services training section | 600×450px |
| `images/projects/project-1.jpg` … `project-9.jpg` | Project cards | 600×375px |
| `images/clients/client-1.png` … `client-15.png` | Logo carousel | 280×140px (transparent PNG) |

Export images as WebP for best performance. The HTML already includes `loading="lazy"` and `onerror` fallbacks (Font Awesome icons display if images are missing).

## Add a New Project

1. Open `projects.html` (and `ar/projects.html` for Arabic).
2. Copy any existing `<article class="project-card">` block.
3. Update these `data-*` attributes:
   - `data-filter` — category slug: `eia` | `water` | `energy` | `industry` | `training`
   - `data-img` — path to thumbnail image
   - `data-title` — project name (shown in modal header)
   - `data-tag` — category label (shown in modal)
   - `data-desc` — full description paragraph (shown in modal)
4. Update `aria-label` to match the new title.
5. Add the thumbnail to `images/projects/`.

## Add a New Service

1. Open `services.html`.
2. Copy an existing `<section class="service-section" id="...">` block.
3. Give it a unique `id` (e.g. `id="new-service"`).
4. Add a matching anchor in the sticky services nav bar at the top of the page.
5. Update the footer links on all pages to include the new service.
6. Mirror changes in `ar/services.html` with Arabic content.

## Contact Form Setup

The form uses [Formspree](https://formspree.io) — free for up to 50 submissions/month.

1. Sign up at formspree.io.
2. Create a new form — copy the endpoint (e.g. `https://formspree.io/f/xabc1234`).
3. In `contact.html` **and** `ar/contact.html`, replace:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   with your actual endpoint.
4. Test by submitting the form — responses appear in your Formspree dashboard and are emailed to your account.

## Switch / Add Languages

### Switch between EN and AR
Every page has a **language switcher** in the header (EN / AR buttons). The switcher links are `hreflang` anchors pointing to the counterpart page.

To update the target URL (e.g. after deploying to a custom domain):
- Search for `https://www.sustainplus-eg.com` across all files and replace with your domain.
- Update the `<link rel="alternate" hreflang="...">` tags in each `<head>` to match.

### Add a third language
1. Create a new folder, e.g. `fr/`.
2. Copy all EN HTML files into `fr/` and translate content.
3. If the language is RTL, add `dir="rtl"` to `<html>` and `class="rtl"` to `<body>`.
4. Add a third button to the `.lang-switcher` div on every page.
5. Add `<link rel="alternate" hreflang="fr" href="...">` to all pages.

## Theme (Light / Dark Mode)

Toggle button in the header switches between light and dark. Preference saved in `localStorage` key `sp-theme`.

To change colors, edit CSS variables at the top of `css/styles.css`:
```css
:root           { /* light mode */ }
[data-theme="dark"] { /* dark mode */ }
```

## Libraries Used (CDN — no npm required)

| Library | Version | Purpose |
|---------|---------|---------|
| [Swiper.js](https://swiperjs.com) | 11 | Client logo carousel |
| [AOS](https://michalsnik.github.io/aos/) | 2.3.4 | Scroll animations |
| [Font Awesome](https://fontawesome.com) | 6.5.0 | Icons |
| [Cairo (Google Fonts)](https://fonts.google.com/specimen/Cairo) | — | Arabic + UI font |

All loaded from CDN — no local installation needed.

## Customise Brand Colors

```css
/* css/styles.css — top of file */
:root {
  --primary:       #1e6b3f;   /* main green */
  --primary-dark:  #14502e;   /* hover / gradient dark end */
  --primary-light: #2d9b5a;   /* lighter green accent */
  --accent:        #f0a500;   /* amber CTA buttons */
}
```

Change these four variables to rebrand the entire site instantly.
