import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid'
import { atom, useAtom } from 'jotai'
import { error } from '@tauri-apps/plugin-log';

// store
import { Store as InternalStore} from '@/lib/store'

// libs
import { StrongholdPlugin } from '@/lib/stronghold';

export type StrongholdAtom = {
  id: string;
  plugin: StrongholdPlugin;
  initDate?: Date;
}

const strongholdPluginSaltFileExistsQueryKey = 'strongholdPluginSaltFileExistsQuery'
const strongholdPluginSaltFilePathQueryKey = 'strongholdPluginSaltFilePathQuery'

const strongholdAtom = atom<StrongholdAtom>({
  id: uuid(),
  plugin: new StrongholdPlugin(),
  initDate: undefined
})

export const useStronghold = () => {
  const queryClient = useQueryClient()
  // state
  const [stronghold, setStronghold] = useAtom(strongholdAtom)

  // queries
  const strongholdPluginSaltFileExistsQuery = useQuery({
    queryKey: [strongholdPluginSaltFileExistsQueryKey],
    queryFn: async () => {
      return await (await stronghold.plugin.saltFile()).exists()
    },
    retry: false
  })

  const strongholdPluginSaltFilePathQuery = useQuery({
    queryKey: [strongholdPluginSaltFilePathQueryKey],
    queryFn: async () => {
      return (await stronghold.plugin.saltFile()).path
    },
    retry: false
  })

  // Mutations
  const strongholdPluginInitMutation = useMutation({
    mutationFn: async (salt: string) => {
      await stronghold.plugin.init(salt)
      
      setStronghold((state) => ({
        ...state,
        initDate: new Date(),
      }))
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [strongholdPluginSaltFileExistsQueryKey] })
      queryClient.invalidateQueries({ queryKey: [strongholdPluginSaltFilePathQueryKey] })
    },
    onError: (err) => {
      error(`strongholdPluginInitMutation onError err ${err}`)
    },
    scope: { id: `strongholdPluginInitMutation` },
  })

  return new InternalStore({
    state: {
      ...stronghold,
    },
    queries: {
      strongholdPluginSaltFileExistsQuery,
      strongholdPluginSaltFilePathQuery
    },
    mutations: {
      strongholdPluginInitMutation,
    }
  })
}

