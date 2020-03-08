const onRoute = fn => async (request, response, next) => {
  try {
    return await fn(request, response, next)
  } catch (error) {
    return response.status(500).json({
      error,
    })
  }
}

export default onRoute
