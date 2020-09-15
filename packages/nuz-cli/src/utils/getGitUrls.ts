import {
  GITHUB_DEFAULT_BRANCH,
  GITHUB_ORGANIZATION,
  GITHUB_REPOSITORY,
} from '../lib/const'

export function packageJson(template: string): string {
  return `https://api.github.com/repos/${GITHUB_ORGANIZATION}/${GITHUB_REPOSITORY}/contents/templates/${template}/package.json`
}

export function tarFile(): string {
  return `https://codeload.github.com/${GITHUB_ORGANIZATION}/${GITHUB_REPOSITORY}/tar.gz/${GITHUB_DEFAULT_BRANCH}`
}

export function templatePath(template: string): string {
  return `${GITHUB_REPOSITORY}-${GITHUB_DEFAULT_BRANCH}/packages/nuz-cli/examples/${template}`
}
