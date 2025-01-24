import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid'
import { atom, useAtom } from 'jotai'
import { error } from '@tauri-apps/plugin-log';

// store
import { Store } from '@/lib/store'

// libs
import { StrongholdPlugin } from '@/lib/stronghold';

export type StrongholdAtom = {
  id: string;
  plugin: StrongholdPlugin;
  initDate?: Date;
}

const strongholdAtom = atom<StrongholdAtom>({
  id: uuid(),
  plugin: new StrongholdPlugin(),
  initDate: undefined,
})

const saltFileExistsQueryKey = ['utilities', 'stronghold', 'salt-file']
const saltFilePathQueryKey = ['utilities', 'stronghold', 'salt-file-path']

export const useStrongholdPlugin = () => {
  const queryClient = useQueryClient()
  // state
  const [stronghold, setStronghold] = useAtom(strongholdAtom)

  // queries
  const saltFileExists = useQuery({
    queryKey: saltFileExistsQueryKey,
    queryFn: async () => {
      return await (await stronghold.plugin.saltFile()).exists()
    },
    retry: false
  }, queryClient)

  const saltFilePath = useQuery({
    queryKey: saltFilePathQueryKey,
    queryFn: async () => {
      return (await stronghold.plugin.saltFile()).path
    },
    retry: false
  }, queryClient)

  // Mutations
  const init = useMutation({
    mutationFn: async (salt?: string) => {
      await stronghold.plugin.init(salt!)

      setStronghold((state) => ({
        ...state,
        initDate: new Date(),
      }))
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: saltFileExistsQueryKey })
      await queryClient.invalidateQueries({ queryKey: saltFilePathQueryKey })
    },
    onError: (err: Error | string) => {
      error(`useStrongholdPlugin init mutation onError err ${err}`)
    },
    scope: { id: `useStrongholdPlugin init mutation` },
  }, queryClient)

  // TODO: needs to remove vaults too (pop up/dialog needed for user to confirm as the action is nuclear)
  const removeSaltFile = useMutation({
    mutationFn: async () => {
      await (await stronghold.plugin.saltFile()).remove()

      setStronghold((state) => ({
        ...state,
        initDate: undefined,
      }))
    },
    onSuccess: async () => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: saltFileExistsQueryKey })
      await queryClient.invalidateQueries({ queryKey: saltFilePathQueryKey })
    },
    onError: (err: Error | string) => {
      error(`useStrongholdPlugin removeSaltFile mutation onError err ${err}`)
    },
    scope: { id: `useStrongholdPlugin removeSaltFile mutation` },
  }, queryClient)

  return new Store({
    state: {
      ...stronghold,
    },
    queries: {
      saltFileExists,
      saltFilePath,
    },
    mutations: {
      init,
      removeSaltFile
    }
  })
}
