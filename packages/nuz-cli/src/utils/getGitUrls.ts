import { GITHUB_DEFAULT_BRANCH, GITHUB_REPOSITORY, GITHUB_ORGANIZATION } from '../lib/const'

export const packageJson = (template: string) =>
  `https://api.github.com/repos/${GITHUB_ORGANIZATION}/${GITHUB_REPOSITORY}/contents/templates/${template}/package.json`

export const tarFile = () =>
  `https://codeload.github.com/${GITHUB_ORGANIZATION}/${GITHUB_REPOSITORY}/tar.gz/${GITHUB_DEFAULT_BRANCH}`

export const templatePath = (template: string) =>
  `${GITHUB_REPOSITORY}-${GITHUB_DEFAULT_BRANCH}/templates/${template}`
