import { appLocalDataDir } from "@tauri-apps/api/path";
import { exists, ExistsOptions, mkdir, MkdirOptions } from "@tauri-apps/plugin-fs";

export class InternalDirectory {
  path: string

  constructor (path: string) {
    this.path = path
  }

  async exists (options?: ExistsOptions) {
    return await exists(this.path, options)
  }

  async mkdir (options?: MkdirOptions) {
    return mkdir(this.path, options)
  }
}

export class AppLocalDataDirectory extends InternalDirectory {
  public static async init () {
    return new AppLocalDataDirectory(await appLocalDataDir())
  }
}