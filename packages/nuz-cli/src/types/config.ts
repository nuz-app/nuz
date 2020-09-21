import { UserAccessTokenTypes } from '@nuz/shared'

export enum ConfigurationFields {
  registry = 'registry',
  cdn = 'cdn',
  storageType = 'storageType',
}

export interface ConfigurationData {
  [ConfigurationFields.registry]: string
  [ConfigurationFields.cdn]: string
}

export enum AuthenticationFields {
  id = 'id',
  username = 'username',
  token = 'token',
  type = 'type',
  loggedAt = 'loggedAt',
}

export interface AuthenticationData {
  [AuthenticationFields.id]: string
  [AuthenticationFields.username]: string
  [AuthenticationFields.token]: string
  [AuthenticationFields.type]: UserAccessTokenTypes
  [AuthenticationFields.loggedAt]: Date | undefined
}
