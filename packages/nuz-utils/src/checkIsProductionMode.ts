function checkIsProductionMode(): boolean {
  return process.env.NODE_ENV === 'production'
}

export default checkIsProductionMode
