import dns from 'dns'

const DEFAULT_HOSTNAME = 'google.com'

function checkIsOnline(url: string = DEFAULT_HOSTNAME): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    dns.lookup(url, (error: NodeJS.ErrnoException | null) => {
      if (error) {
        return reject(false)
      }

      return resolve(true)
    })
  })
}

export default checkIsOnline
