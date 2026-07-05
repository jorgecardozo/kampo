// Genera public/version.json con la info del deploy.
// En Vercel usa las env VERCEL_GIT_*; en local usa git. Corre en cada build/dev.
const { execSync } = require('child_process')
const { writeFileSync, mkdirSync } = require('fs')
const { join } = require('path')

const git = (cmd) => {
  try {
    return execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return ''
  }
}

const sha = process.env.VERCEL_GIT_COMMIT_SHA || git('rev-parse HEAD')

let pkgVersion = '0.0.0'
try {
  pkgVersion = require(join(process.cwd(), 'package.json')).version || pkgVersion
} catch {}

const info = {
  // "version": tag exacto de git (ej: v1.2.0) o la versión de package.json.
  version: git('describe --tags --exact-match') || `v${pkgVersion}`,
  commit: sha || '',
  commitShort: sha ? sha.slice(0, 7) : '',
  message: process.env.VERCEL_GIT_COMMIT_MESSAGE || git('log -1 --pretty=%s'),
  branch: process.env.VERCEL_GIT_COMMIT_REF || git('rev-parse --abbrev-ref HEAD'),
  author: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || git('log -1 --pretty=%an'),
  commitDate: git('log -1 --pretty=%cI') || '',
  buildDate: new Date().toISOString(),
  env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  repo:
    process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
      ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
      : 'jorgecardozo/kampo',
}

try {
  mkdirSync(join(process.cwd(), 'public'), { recursive: true })
} catch {}
writeFileSync(join(process.cwd(), 'public', 'version.json'), JSON.stringify(info, null, 2))
console.log(`[version] ${info.version} · ${info.commitShort} · ${info.env}`)
