import { GITHUB_BRANCH, GITHUB_REPO, GITHUB_USERNAME } from '../lib/const'

export const packageJson = (template: string) =>
  `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/templates/${template}/package.json`

export const tarFile = () =>
  `https://codeload.github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/tar.gz/${GITHUB_BRANCH}`

export const templatePath = (template: string) =>
  `${GITHUB_REPO}-${GITHUB_BRANCH}/templates/${template}`
