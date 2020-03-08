// tslint:disable-next-line: max-line-length
// https://api.github.com/repos/lamhieu-vk/nuz/contents/templates/${name}/package.json

export const templatePackageJson = (name: string) =>
  `https://api.github.com/repos/zeit/next.js/contents/examples/${name}/package.json`

export const repoTarFile = (branch: string = 'canary') =>
  `https://codeload.github.com/zeit/next.js/tar.gz/${branch}`

export const resolvePathTemplte = (name: string) =>
  `next.js-canary/examples/${name}`
