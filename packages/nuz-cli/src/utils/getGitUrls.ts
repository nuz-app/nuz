import { GITHUB_BRANCH, GITHUB_REPO, GITHUB_USERNAME } from '../lib/const'

export const packageJson = (name: string) =>
  `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/templates/${name}/package.json`

export const tarFile = () =>
  `https://codeload.github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/tar.gz/${GITHUB_BRANCH}`

export const templatePath = (name: string) =>
  `${GITHUB_REPO}-${GITHUB_BRANCH}/templates/${name}`
