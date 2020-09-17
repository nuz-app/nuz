function checkIsCI(): boolean {
  return process.env.CI === 'true' // default is `false`
}

export default checkIsCI
