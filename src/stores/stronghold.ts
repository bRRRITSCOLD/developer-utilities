import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid'
import { atom, useAtom } from 'jotai'
import { error } from '@tauri-apps/plugin-log';

// store
import { Store } from '@/lib/store'

// libs
import { StrongholdPlugin } from '@/lib/stronghold';
import Database from '@tauri-apps/plugin-sql';

export type StrongholdAtom = {
  id: string;
  plugin: StrongholdPlugin;
  initDate?: Date;
}

const pluginSaltFileExistsQueryKey = 'pluginSaltFileExistsQuery'
const pluginSaltFilePathQueryKey = 'pluginSaltFilePathQuery'
const listVaultsQueryKey = 'listVaultsQuery'

const strongholdAtom = atom<StrongholdAtom>({
  id: uuid(),
  plugin: new StrongholdPlugin(),
  initDate: undefined,
})

export const useStronghold = () => {
  const queryClient = useQueryClient()
  // state
  const [stronghold, setStronghold] = useAtom(strongholdAtom)

  // queries
  const pluginSaltFileExistsQuery = useQuery({
    queryKey: [pluginSaltFileExistsQueryKey],
    queryFn: async () => {
      return await (await stronghold.plugin.saltFile()).exists()
    },
    retry: false
  }, queryClient)

  const pluginSaltFilePathQuery = useQuery({
    queryKey: [pluginSaltFilePathQueryKey],
    queryFn: async () => {
      return (await stronghold.plugin.saltFile()).path
    },
    retry: false
  }, queryClient)

  const listVaultsQuery = useQuery({
    queryKey: [listVaultsQueryKey],
    queryFn: async () => {
      return await stronghold.plugin.listVaults()
    },
    enabled: !!stronghold.plugin.connections?.db,
    retry: false
  }, queryClient)

  // Mutations
  const pluginInitMutation = useMutation({
    mutationFn: async (salt?: string) => {
      await stronghold.plugin.init(salt!)

      setStronghold((state) => ({
        ...state,
        initDate: new Date(),
      }))
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: [pluginSaltFileExistsQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [pluginSaltFilePathQueryKey] }),
      await queryClient.invalidateQueries({ queryKey: [listVaultsQuery] })
    },
    onError: (err: Error | string) => {
      error(`pluginInitMutation onError err ${err}`)
    },
    scope: { id: `pluginInitMutation` },
  }, queryClient)

  // TODO: needs to remove vaults too (pop up/dialog needed for user to confirm as the action is nuclear)
  const removePluginSaltFileMutation = useMutation({
    mutationFn: async () => {
      await (await stronghold.plugin.saltFile()).remove()

      setStronghold((state) => ({
        ...state,
        initDate: undefined,
      }))
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: [pluginSaltFileExistsQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [pluginSaltFilePathQueryKey] })
    },
    onError: (err: Error | string) => {
      error(`removePluginSaltFileMutation onError err ${err}`)
    },
    scope: { id: `removePluginSaltFileMutation` },
  }, queryClient)

  const createVaultMutation = useMutation({
    mutationFn: async (name: string) => {
      await stronghold.plugin.addVault
      
      const db = await Database.load('sqlite:developer-utilities.stronghold.db');

      setStronghold((state) => ({
        ...state,
        initDate: new Date(),
        db
      }))
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: [pluginSaltFileExistsQueryKey] })
      await queryClient.invalidateQueries({ queryKey: [pluginSaltFilePathQueryKey] })
    },
    onError: (err: Error | string) => {
      error(`pluginInitMutation onError err ${err}`)
    },
    scope: { id: `pluginInitMutation` },
  })

  return new Store({
    state: {
      ...stronghold,
    },
    queries: {
      pluginSaltFileExistsQuery,
      pluginSaltFilePathQuery,
      listVaultsQuery
    },
    mutations: {
      pluginInitMutation,
      removePluginSaltFileMutation
    }
  })
}
