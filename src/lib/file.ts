import { exists, ExistsOptions, writeFile, WriteFileOptions } from "@tauri-apps/plugin-fs";

export class InternalFile {
  name: string

  directory: string

  contents?: Uint8Array | string

  constructor (name: string, directory: string, contents?: Uint8Array | string) {
    this.name = name
    this.directory = directory
    this.contents = contents
  }

  get path () {
    return `${this.directory}/${this.name}`
  }

  async exists (options?: ExistsOptions) {
    return await exists(this.path, options)
  }

  async writeFile (options?: WriteFileOptions) {
    let contents: Uint8Array

    if (typeof this.contents === 'string') {
      contents = new Uint8Array(Array.from(new TextEncoder().encode(this.contents)))
    } else if (this.contents instanceof Uint8Array) {
      contents = this.contents
    } else {
      throw new Error('Cannot determine contents type')
    }
  
    return writeFile(`${this.path}`, contents, options)
  }
}
