import { ModuleId } from '../types'

export interface UploadFilesData {
  id: ModuleId
  version: string
}

declare class Storage {
  prepare(): Promise<any>

  uploadFiles(data: UploadFilesData, files: any[]): Promise<any>

  createUrl(
    moduleId: ModuleId,
    version: string,
    filename: string,
  ): Promise<string>
}

export default Storage
