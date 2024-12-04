import { Client, Stronghold as TauriStronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir, appLocalDataDir } from '@tauri-apps/api/path';
import { exists, BaseDirectory, writeFile, mkdir } from '@tauri-apps/plugin-fs';
import { info, error, trace } from '@tauri-apps/plugin-log';
import { invoke } from '@tauri-apps/api/core';


// libs
import { Resource, ResourceConstructorParams } from './resource';
import { AppLocalDataDirectory } from './directory';
import { InternalFile } from './file';

export type StrongholdPluginConfig = { saltFilename: 'salt.txt'; baseDir: BaseDirectory.AppLocalData; };
export type StrongholdPluginConnections = {};
export type StrongholdPluginClients = {};
export type StrongholdPluginResources = {};

// commands
export const STRONGHOLD_PLUGIN_INIT = 'stronghold_plugin_init'

export class StrongholdPluginIpc {
  public static async strongholdPluginInit () {
    trace(`${STRONGHOLD_PLUGIN_INIT} command invoke...`)

    return await invoke<void>(
      STRONGHOLD_PLUGIN_INIT,
    )
  }
}

export class StrongholdPlugin extends Resource<StrongholdPluginConfig, StrongholdPluginConnections, StrongholdPluginClients, StrongholdPluginResources> {
  constructor () {
    super({ config: { saltFilename: 'salt.txt', baseDir: BaseDirectory.AppLocalData } })
  }

  #vaultCache: Map<string, StrongholdVault> = new Map()

  public async appLocalDataDirectory () {
    return await AppLocalDataDirectory.init()
  }

  public async saltFile (salt?: string) {
    return new InternalFile(
      `salt.txt`,
      (await this.appLocalDataDirectory()).path,
      salt || ''
    )
  }

  public async init (salt: string) {
    const appLocalDataDirectory = await this.appLocalDataDirectory()
  
    if (!(await appLocalDataDirectory.exists())) {
      trace('appLocalDataDirectory does not exist, mkdir...')

      await appLocalDataDirectory.mkdir()
    }

    const saltFile = await this.saltFile(salt)

    if (!(await saltFile.exists())) {
      trace('saltFile does not exist, writeFile...')

      await saltFile.writeFile()
    }

    return await StrongholdPluginIpc.strongholdPluginInit()
  }

  async addVault (params: { name: string; password: string; }): Promise<StrongholdVault>  {
    const strongholdVault = await StrongholdVault.init(params)

    this.#vaultCache.set(params.name, strongholdVault)

    return strongholdVault
  }

  async getVaultNames (): Promise<string[]> {
    return []
  }

  async getVault (name: string): Promise<StrongholdVault> {
    return new StrongholdVault({} as any)
  }

  async deleteVault (name: string): Promise<boolean> {
    return true
  }
}

export type StrongholdVaultConfig = { name: string; vaultPath: string; };
export type StrongholdVaultConnections = { stronghold: TauriStronghold; };
export type StrongholdVaultClients = { stronghold: Client; };
export type StrongholdVaultResources = {};

export class StrongholdVault extends Resource<StrongholdVaultConfig, StrongholdVaultConnections, StrongholdVaultClients, StrongholdVaultResources> {
  constructor (params: ResourceConstructorParams<StrongholdVaultConfig, StrongholdVaultConnections, StrongholdVaultClients, StrongholdVaultResources>) {
    super(params)
  }

  public static async init(params: { name: string, password: string }) {
    const { name, password } = params

    const vaultPath = `${await appDataDir()}/${name}.hold`;

    let stronghold: TauriStronghold
    try {
      stronghold = await TauriStronghold.load(vaultPath, password);
    } catch (err) {
      error(`init error ${(err as any).message}`)
      
      throw err
    }
  
    let client: Client;
    const clientName = name;
    try {
      client = await stronghold!.loadClient(clientName);
    } catch {
      client = await stronghold!.createClient(clientName);
    }
  
    return new StrongholdVault({
      config: { name, vaultPath },
      connections: { stronghold: stronghold! },
      clients: { stronghold: client },
      resources: {}
    })
  }

  public async insertRecord(key: string, value: string): Promise<boolean> {
    const data = Array.from(new TextEncoder().encode(value));

    await this.clients!.stronghold.getStore().insert(key, data);

    return true
  }

  public async getRecord(key: string): Promise<string | null> {
    let data: Uint8Array | string | null = await this.clients!.stronghold.getStore().get(key);

    if (data) {
      data = new TextDecoder().decode(new Uint8Array(data))
    }

    return data;
  }

  public async deleteRecord(key: string): Promise<boolean> {
    await this.clients!.stronghold.getStore().remove(key);

    return true;
  }
}
