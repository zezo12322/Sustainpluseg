const fs = require('fs')
const path = require('path')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01'

const outputPath = path.join(__dirname, 'data', 'projects.json')

async function main() {
  if (!projectId) {
    console.log('[build] No SANITY_PROJECT_ID found. Keeping existing data/projects.json')
    return
  }

  console.log(`[build] Fetching from Sanity project: ${projectId}/${dataset}`)

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
  `

  const url =
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(query)}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`[build] Sanity request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const sanityProjects = data.result || []

  const projects = sanityProjects.map((project) => ({
    id: project._id,
    category: project.categoryEn || '',
    featured: Boolean(project.featured),
    image: project.image || null,
    icon: null,

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
  }))

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  fs.writeFileSync(
    outputPath,
    JSON.stringify({ projects }, null, 2),
    'utf8'
  )

  console.log(`[build] Wrote ${projects.length} projects → data/projects.json`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})