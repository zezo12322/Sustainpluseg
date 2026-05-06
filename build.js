/**
 * build.js — fetches projects from Sanity and writes data/projects.json
 *
 * Usage:
 *   node build.js
 *
 * Env vars required (set in Netlify dashboard):
 *   SANITY_PROJECT_ID  — your Sanity project ID
 *   SANITY_DATASET     — default: "production"
 *
 * If SANITY_PROJECT_ID is not set, the script exits cleanly
 * and the existing data/projects.json is used as-is.
 *
 * Sanity document schema expected:
 * {
 *   _type: "project",
 *   _id: string,
 *   category: "energy" | "water" | "eia" | "training" | "industry",
 *   image: { asset: { _ref: string } },   // or imageUrl: string
 *   icon: string,          // e.g. "fa-solid fa-earth-africa"
 *   featured: boolean,
 *   en: { title, tag, shortDesc, fullDesc },
 *   ar: { title, tag, shortDesc, fullDesc },
 *   order: number
 * }
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');

const projectId  = process.env.SANITY_PROJECT_ID;
const dataset    = process.env.SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';
const outFile    = path.join(__dirname, 'data', 'projects.json');

if (!projectId) {
  console.log('[build] SANITY_PROJECT_ID not set — skipping fetch, using existing data/projects.json');
  process.exit(0);
}

const query = encodeURIComponent(`
  *[_type == "project"] | order(order asc) {
    "id":       _id,
    category,
    "image":    coalesce(imageUrl, image.asset->url),
    icon,
    featured,
    "en": { "title": en.title, "tag": en.tag, "shortDesc": en.shortDesc, "fullDesc": en.fullDesc },
    "ar": { "title": ar.title, "tag": ar.tag, "shortDesc": ar.shortDesc, "fullDesc": ar.fullDesc }
  }
`);

const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${query}`;

console.log(`[build] Fetching from Sanity project: ${projectId}/${dataset}`);

https.get(url, res => {
  let raw = '';
  res.on('data', chunk => raw += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`[build] Sanity returned HTTP ${res.statusCode}`);
      process.exit(1);
    }
    try {
      const { result } = JSON.parse(raw);
      if (!Array.isArray(result) || result.length === 0) {
        console.warn('[build] Sanity returned empty result — keeping existing JSON');
        process.exit(0);
      }
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, JSON.stringify({ projects: result }, null, 2), 'utf8');
      console.log(`[build] Wrote ${result.length} projects → data/projects.json`);
    } catch (e) {
      console.error('[build] Parse error:', e.message);
      process.exit(1);
    }
  });
}).on('error', e => {
  console.error('[build] Network error:', e.message);
  process.exit(1);
});
