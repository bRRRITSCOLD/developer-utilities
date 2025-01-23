import { Client, Stronghold as TauriStronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir, appLocalDataDir } from '@tauri-apps/api/path';
import { exists, BaseDirectory, writeFile, mkdir } from '@tauri-apps/plugin-fs';
import { info, error, trace } from '@tauri-apps/plugin-log';
import { invoke } from '@tauri-apps/api/core';
import Database from '@tauri-apps/plugin-sql';


// libs
import { Resource, ResourceConstructorParams } from './resource';
import { AppLocalDataDirectory } from './directory';
import { InternalFile } from './file';
import { delay } from './common';

export type StrongholdPluginConfig = { saltFilename: 'salt.txt'; baseDir: BaseDirectory.AppLocalData; };
export type StrongholdPluginConnections = { db: Database };
export type StrongholdPluginClients = {};
export type StrongholdPluginResources = {};

// commands
export const PLUGIN_INIT = 'plugin_init'

export class StrongholdPluginIpc {
  public static async pluginInit () {
    trace(`${PLUGIN_INIT} command invoke...`)

    return await invoke<void>(
      PLUGIN_INIT,
    )
  }
}

export class StrongholdPlugin extends Resource<StrongholdPluginConfig, StrongholdPluginConnections, StrongholdPluginClients, StrongholdPluginResources> {

  
  constructor () {
    super({ config: { saltFilename: 'salt.txt', baseDir: BaseDirectory.AppLocalData }, connections: { db: undefined as unknown as Database} })
  }

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

  public async init (salt?: string) {
    console.log('INIT')
    const appLocalDataDirectory = await this.appLocalDataDirectory()
  
    if (!(await appLocalDataDirectory.exists())) {
      trace(`[{}StrongholdPlugin#init] appLocalDataDirectory does not exist, mkdir ${appLocalDataDirectory.path}`)

      await appLocalDataDirectory.mkdir()
    }

    const saltFile = await this.saltFile(salt)

    if (!(await saltFile.exists())) {
      trace(`[{}StrongholdPlugin#init] saltFile does not exist, writeFile ${await saltFile.path}`)

      await saltFile.writeFile()
    }

    this.connections!.db = await Database.load('sqlite:developer-utilities.stronghold.db');
  
    return await StrongholdPluginIpc.pluginInit()
  }

  async addVault (params: { name: string; password: string; }): Promise<StrongholdVault>  {
    const strongholdVault = await StrongholdVault.init(params)

    await this.connections?.db.execute(
      "INSERT into vault (name) VALUES ($1);",
      [params.name]
    )

    return strongholdVault
  }

  async listVaults (): Promise<string[]> {
    const data = await this.connections?.db.select<{ id: number; name: string; }[]>(
      "SELECT * FROM vault;"
    )
  
    return (data || []).map(item => item.name)
  }

  async getVault (name: string, password: string): Promise<StrongholdVault> {
    const data = await this.connections?.db.select<{ id: number; name: string; }>(
      "SELECT * FROM vault WHERE name = $1;",
      [name]
    )

    if (!data) {
      throw new Error('Vault does not exist')
    }
  
    return await StrongholdVault.init({ name, password })
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

    await this.connections!.stronghold.save()

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
    await this.clients!.stronghold.getStore().remove(key)

    await this.connections!.stronghold.save()

    return true;
  }
}
