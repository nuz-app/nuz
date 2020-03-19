const getEmptyPackage = () => ({
  name: undefined,
  tags: {
    upstream: undefined,
    fallback: undefined,
  },
  schedule: {},
  versions: {},
})

export default getEmptyPackage
