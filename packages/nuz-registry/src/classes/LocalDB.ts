// import crypto from 'crypto'
// import _pick from 'lodash/pick'
// import Datastore from 'nedb'

// import { LocalDBOptions, PublishInfo, PublishOptions } from '../types'

// import getEmptyPackage from '../utils/getEmptyPackage'
// import getIntegrityUrl from '../utils/getIntegrityUrl'

// import ModelDB from './ModelDB'

// const convertVersion = (v: string) => v.replace(/\./g, ':')

// const useAsync = <T = unknown>(db, opareation, ...rest): Promise<T> =>
//   new Promise((resolve, reject) => {
//     db[opareation].call(db, ...rest, (error, result) => {
//       if (error) {
//         reject(error)
//       } else {
//         resolve(result)
//       }
//     })
//   })

// const getVersionInfo = async ({
//   library,
//   alias,
//   exportsOnly,
//   resolved: _resolved,
// }) => {
//   const promises = [getIntegrityUrl(_resolved.main)].concat(
//     (_resolved.styles || []).map(style => getIntegrityUrl(style)),
//   )
//   const [main, ...styles] = await Promise.all(promises.filter(Boolean))
//   const resolved = {
//     main,
//     styles,
//   }

//   return {
//     library,
//     alias,
//     exportsOnly,
//     resolved,
//   }
// }

// class LocalDB implements ModelDB {
//   private readonly db: {
//     keys: Datastore
//     packages: Datastore
//   }

//   constructor(private readonly secrectKey: string, options: LocalDBOptions) {
//     const { path } = options

//     this.db = {
//       keys: new Datastore(!path ? {} : `${path}/keys.db`),
//       packages: new Datastore(!path ? {} : `${path}/packages.db`),
//     }
//   }

//   private checkIsSecrectKey(key: string) {
//     const keyIsAllowed = key === this.secrectKey
//     if (!keyIsAllowed) {
//       throw new Error('Permission is denied')
//     }

//     return true
//   }

//   private async checkIsScopeKey(key: string, name: string) {
//     if (key === this.secrectKey) {
//       return true
//     }
//     console.log({ key, name })
//     const result = await useAsync(this.db.keys, 'find', {
//       key,
//       scope: { $elemMatch: name },
//     })

//     console.log({ result })
//     return !!result
//   }

//   async prepage() {
//     this.db.keys.loadDatabase()
//     this.db.packages.loadDatabase()
//   }

//   async createKey(verifyKey: string, scope: string[]) {
//     this.checkIsSecrectKey(verifyKey)

//     const uuid = [Date.now(), crypto.randomBytes(20).toString('hex')].join('-')
//     const key = crypto
//       .createHash('sha256')
//       .update(uuid)
//       .digest('hex')

//     const { _id } = await useAsync<{ _id: string }>(this.db.keys, 'insert', {
//       key,
//       scope,
//       updatedAt: new Date(),
//       createdAt: new Date(),
//     })

//     return { _id, key, scope }
//   }

//   async deleteKey(verifyKey: string, scopeKey: string) {
//     this.checkIsSecrectKey(verifyKey)

//     const result = await useAsync(this.db.keys, 'remove', { key: scopeKey })

//     console.log({ result })
//     return true
//   }

//   async setScope(verifyKey: string, scopeKey: string, scope: string[]) {
//     this.checkIsSecrectKey(verifyKey)

//     const result = await useAsync(
//       this.db.keys,
//       'update',
//       { key: scopeKey },
//       { $set: { scope } },
//     )

//     console.log({ result })
//     return true
//   }

//   async extendScope(verifyKey: string, scopeKey: string, scope: string[]) {
//     this.checkIsSecrectKey(verifyKey)

//     const result = await useAsync(
//       this.db.keys,
//       'update',
//       { key: scopeKey },
//       { $push: { scope } },
//     )

//     console.log({ result })
//     return true
//   }

//   async removeScope(verifyKey: string, scopeKey: string, scope: string[]) {
//     this.checkIsSecrectKey(verifyKey)

//     const result = await useAsync(
//       this.db.keys,
//       'update',
//       { key: scopeKey },
//       { $pop: { scope } },
//     )

//     console.log({ result })
//     return true
//   }

//   async getPackage(name: string) {
//     const result = await useAsync(this.db.packages, 'findOne', { name })

//     console.log({ result }, 'get package')
//     return result
//   }

//   async publishPackage(
//     scopeKey: string,
//     publishInfo: PublishInfo,
//     options: PublishOptions,
//   ) {
//     // const { makeFallback } = options
//     const {
//       name,
//       version: _version,
//       library,
//       alias,
//       exportsOnly,
//       resolved,
//     } = publishInfo

//     const keyIsAllowed = await this.checkIsScopeKey(scopeKey, name)
//     if (!keyIsAllowed) {
//       throw new Error('Permission is denied')
//     }

//     const version = convertVersion(_version)

//     const item = await this.getPackage(name)
//     if (!item) {
//       const data = getEmptyPackage()
//       data.name = name
//       data.tags.production = version
//       data.versions[version] = await getVersionInfo({
//         library,
//         alias,
//         exportsOnly,
//         resolved,
//       })

//       console.log({ data })
//       const result = await useAsync(this.db.packages, 'insert', data)
//       console.log({ result, data }, 'publish 1')
//     } else {
//       const versionInfo = await getVersionInfo({
//         library,
//         alias,
//         exportsOnly,
//         resolved,
//       })
//       const result = await useAsync(
//         this.db.packages,
//         'update',
//         { name },
//         {
//           $set: {
//             [version]: versionInfo,
//             'tags.production': version,
//             'tags.fallback': (item as any).production,
//           },
//         },
//       )
//       console.log({ result })
//     }
//   }

//   async getConfig(): Promise<any> {
//     return useAsync(this.db.packages, 'find', {})
//   }
// }

// export default LocalDB
