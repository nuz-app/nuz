import got from 'got'

async function checkIsUrlOk(url: string) {
  const response = await got(url).catch(e => e)
  return response.statusCode === 200
}

export default checkIsUrlOk
