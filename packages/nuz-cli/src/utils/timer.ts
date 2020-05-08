const timer = () => {
  const startTime = Date.now()
  return () => Date.now() - startTime
}

export default timer
