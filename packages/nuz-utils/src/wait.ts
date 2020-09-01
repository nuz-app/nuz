function wait(time: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export default wait
