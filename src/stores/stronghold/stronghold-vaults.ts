import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { error } from '@tauri-apps/plugin-log';

// store
import { Store } from '@/lib/store'

// stores
import { useStrongholdPlugin } from './stronghold-plugin';

// LIBS
import { randomDelayTest } from '@/lib/common';


const listVaultsQueryKey = ['utilities', 'stronghold', 'vaults']

export const useStrongholdVaults = () => {
  const { state: strongholdPluginState } = useStrongholdPlugin()

  const queryClient = useQueryClient()

  // queries
  const listVaults = useQuery({
    queryKey: listVaultsQueryKey,
    queryFn: async () => {
      await randomDelayTest()
      return await strongholdPluginState.plugin.listVaults()
    },
    enabled: !!strongholdPluginState.plugin.connections?.db,
    retry: false
  }, queryClient)

  // Mutations
  const createVault = useMutation({
    mutationFn: async ({ name, password }: { name: string, password: string }) => {
      await strongholdPluginState.plugin.addVault({ name, password })
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: listVaultsQueryKey })
    },
    onError: (err: Error | string) => {
      error(`pluginInitMutation onError err ${err}`)
    },
    scope: { id: `pluginInitMutation` },
  })

  return new Store({
    queries: {
      listVaults
    },
    mutations: {
      createVault
    }
  })
}