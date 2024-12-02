import { Client, Stronghold as TauriStronghold } from '@tauri-apps/plugin-stronghold';
import { appDataDir, appLocalDataDir } from '@tauri-apps/api/path';
import { exists, BaseDirectory, writeFile } from '@tauri-apps/plugin-fs';


// libs
import { Resource } from './resource';
import { info, error } from '@tauri-apps/plugin-log';
import { invoke } from '@tauri-apps/api/core';

export type StrongholdPluginConnections = {};
export type StrongholdPluginClients = {};
export type StrongholdPluginResources = {};

const INIT_STRONGHOLD_PLUGIN_COMMAND = 'initStrongholdPlugin'

export class StrongholdPlugin extends Resource<StrongholdConnections, StrongholdClients, StrongholdResources> {
  public saltFilename: 'salt.txt' = 'salt.txt'

  public baseDir: BaseDirectory.AppLocalData = BaseDirectory.AppLocalData

  public async saltFilePath () {
    return `${await appLocalDataDir()}/${this.saltFilename}`
  }

  public async saltFileExists () {
    return await exists(this.saltFilename, {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  public async init (salt: string) {
    if (!(await this.saltFileExists())) {
      await writeFile(this.saltFilename, new Uint8Array(Array.from(new TextEncoder().encode(salt))), {
        baseDir: this.baseDir,
      });
    }

    const [result] = await Promise.allSettled([
      invoke<void>(
        INIT_STRONGHOLD_PLUGIN_COMMAND,
        { salt }
      )
    ])

    if (result.status === 'rejected') {
      throw result.reason
    }

    return result.value
  }

  async addVault (params: { name: string; password: string; }): Promise<StrongholdVault>  {
    return new StrongholdVault({} as any)
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

export type StrongholdVaultConnections = { stronghold: TauriStronghold; };
export type StrongholdVaultClients = { stronghold: Client; };
export type StrongholdVaultResources = {};

export class StrongholdVault extends Resource<StrongholdVaultConnections, StrongholdVaultClients, StrongholdVaultResources> {
  public static async vaultPath() {
    return `${await appDataDir()}/vault.hold`;
  }

  public static async init(password: string) {
    let stronghold: TauriStronghold
    try {
      info('init before load')
      stronghold = await TauriStronghold.load(await this.vaultPath(), password);
      info('init after load')
    } catch (err) {
      error(`init error ${(err as any).message}`)
    }
  
    let client: Client;
    const clientName = 'stronghold';
    try {
      client = await stronghold!.loadClient(clientName);
    } catch {
      client = await stronghold!.createClient(clientName);
    }
  
    return new StrongholdVault({
      connections: { stronghold: stronghold! },
      clients: { stronghold: client },
      resources: {}
    })
  }
}

export type StrongholdConnections = { strongholdPlugin: TauriStronghold; };
export type StrongholdClients = { strongholdPlugin: Client; };
export type StrongholdResources = {};

export class Stronghold extends Resource<StrongholdConnections, StrongholdClients, StrongholdResources> {
  public static async vaultPath() {
    return `${await appDataDir()}/vault.hold`;
  }

  public static async init(password: string) {
    let stronghold: TauriStronghold
    try {
      info('init before load')
      stronghold = await TauriStronghold.load(await this.vaultPath(), password);
      info('init after load')
    } catch (err) {
      error(`init error ${(err as any).message}`)
    }
  
    let client: Client;
    const clientName = 'stronghold';
    try {
      client = await stronghold!.loadClient(clientName);
    } catch {
      client = await stronghold!.createClient(clientName);
    }
  
    return new Stronghold({
      connections: { strongholdPlugin: stronghold! },
      clients: { strongholdPlugin: client },
      resources: {}
    })
  }

  public constructor(params: { connections: StrongholdConnections; clients: StrongholdClients; resources: StrongholdResources }) {
    super(params)
  }

  public async insertRecord(key: string, value: string): Promise<string> {
    const data = Array.from(new TextEncoder().encode(value));
    await this.clients.strongholdPlugin.getStore().insert(key, data);
    return value
  }

  public async getRecord(key: string): Promise<string | null> {
    const data = await this.clients.strongholdPlugin.getStore().get(key);
    return data ? new TextDecoder().decode(new Uint8Array(data)) : data;
  }

  public async deleteRecord(key: string): Promise<string | null> {
    const data = await this.clients.strongholdPlugin.getStore().remove(key);
    return data ? new TextDecoder().decode(new Uint8Array(data)) : data;
  }
}