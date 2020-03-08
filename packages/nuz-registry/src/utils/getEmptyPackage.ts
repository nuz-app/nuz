const getEmptyPackage = () => ({
  name: null,
  tags: {
    upstream: null,
    fallback: null,
  },
  schedule: {},
  versions: {},
})

export default getEmptyPackage
