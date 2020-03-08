import { PublishInfo, PublishOptions } from '../types'

declare class ModelDB {
  prepage(): Promise<any>

  /**
   * Create a token
   * @param secretKey serect key
   * @param scope scope
   */
  createToken(secretKey: string, scope: string[]): Promise<{ token: string }>
  /**
   *  Delete a token
   * @param secretKey serect key
   * @param token token
   */
  deleteToken(secretKey: string, token: string): Promise<{ deleted: number }>

  /**
   * Set scope by token
   * @param secretKey serect key
   * @param token token
   * @param scope scope
   */
  setScope(
    secretKey: string,
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
    secretKey: string,
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
    secretKey: string,
    token: string,
    scope: string[],
  ): Promise<{ updated: number }>

  /**
   * Get module by name
   * @param name package name
   */
  getModule(name: string): Promise<any>
  publishModule(
    token: string,
    publishInfo: PublishInfo,
    options: PublishOptions,
  ): Promise<any>
  lockModule(token: string, name: string): Promise<any>
  unlockModule(token: string, name: string): Promise<any>

  getConfig(): Promise<any>
}

export default ModelDB
