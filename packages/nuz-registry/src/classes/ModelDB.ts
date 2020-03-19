import { PublishInfo, PublishOptions, RollbackInfo } from '../types'

declare class ModelDB {
  prepage(): Promise<any>

  /**
   * Create a token
   * @param secretKey serect key
   * @param scope scope
   */
  createToken(
    secretKey: string | undefined,
    scope: string[],
  ): Promise<{ token: string }>
  /**
   *  Delete a token
   * @param secretKey serect key
   * @param token token
   */
  deleteToken(
    secretKey: string | undefined,
    token: string,
  ): Promise<{ deleted: number }>

  /**
   * Set scope by token
   * @param secretKey serect key
   * @param token token
   * @param scope scope
   */
  setScope(
    secretKey: string | undefined,
    token: string,
    scope: string[],
  ): Promise<{ updated: number }>
  /**
   * Remove some scope from permission by token
   * @param secretKey serect key
   * @param token token
   * @param scope scope
   */
  removeScope(
    secretKey: string | undefined,
    token: string,
    scope: string[],
  ): Promise<{ updated: number }>
  /**
   * Extend scope for permission by token
   * @param secretKey serect key
   * @param token token
   * @param scope scope
   */
  extendScope(
    secretKey: string | undefined,
    token: string,
    scope: string[],
  ): Promise<{ updated: number }>

  /**
   * Get module by name
   * @param name package name
   */
  getModule(name: string): Promise<any>
  /**
   * Publish module
   * @param token token
   * @param publishInfo module info
   * @param options publish options
   */
  publishModule(
    token: string,
    publishInfo: PublishInfo,
    options: PublishOptions,
  ): Promise<any>
  /**
   * Rollback module
   * @param token token
   * @param publishInfo module info
   */
  rollbackModule(
    token: string,
    rollbackInfo: RollbackInfo,
  ): Promise<{
    _id: any
    name: string
    rollbacked: RollbackInfo
    updated: number
  }>

  /**
   * Lock module
   * @param token token
   * @param name module name
   */
  lockModule(token: string, name: string): Promise<any>
  /**
   * Unlock module
   * @param token token
   * @param name module name
   */
  unlockModule(token: string, name: string): Promise<any>

  /**
   * Get config
   */
  getConfig(): Promise<any>
}

export default ModelDB
