import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid'
import { atom, useAtom } from 'jotai'

// store
import { Store as InternalStore} from '@/lib/store'

// libs
import { Stronghold, StrongholdPlugin } from '@/lib/stronghold';
import { error, info } from '@tauri-apps/plugin-log';


export type ApiSecrets = {
  apiKey?: string
}

const FLAT_FILES_S3_ENDPOINT = 'https://files.polygon.io'
const FLAT_FILES_BUCKET = 'flatfiles'

export type FlatFilesSecrets = {
  accessKeyId?: string;
  secretAccessKey?: string;
  s3Endpoint: typeof FLAT_FILES_S3_ENDPOINT;
  bucket: typeof FLAT_FILES_BUCKET;
}

export type Secrets = {
  api: ApiSecrets;
  flatFiles: FlatFilesSecrets;
}

export type StrongholdAtom = {
  id: string;
  plugin: StrongholdPlugin;
  initDate?: Date;
}

// const getSecretsStrongholdClient = (strongholdAtom: StrongholdAtom) => {
//   if (strongholdAtom.stronghold?.clients.pluginStronghold) {
//     return strongholdAtom.stronghold?.clients.pluginStronghold
//   } else {
//     throw new Error('Initialize stronghold')
//   }
// }

const strongholdPluginSaltFileExistsQueryKey = 'strongholdPluginSaltFileExistsQuery'

// const baseFlatFilesSecrets: FlatFilesSecrets = {
//   s3Endpoint: FLAT_FILES_S3_ENDPOINT,
//   bucket: FLAT_FILES_BUCKET
// }

const strongholdAtom = atom<StrongholdAtom>({
  id: uuid(),
  plugin: new StrongholdPlugin({}),
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
      return await stronghold.plugin.saltFileExists()
    },
  })

  // Mutations
  const strongholdPluginInitMutation = useMutation({
    mutationFn: async (salt: string) => {
      try {
        await stronghold.plugin.init(salt)
        
        setStronghold((state) => ({
          ...state,
          initDate: new Date(),
        }))

      } catch (err) {
        error(`strongholdPluginInitMutation catch err ${(err as any).message}`)
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [strongholdPluginSaltFileExistsQueryKey] })
    },
    onError: (err) => {
      error(`strongholdPluginInitMutation onError err ${(err as any).message}`)
    },
    scope: { id: `strongholdPluginInitMutation` },
  })

  // const updateSecretsMutation = useMutation({
  //   mutationFn: async (params: Partial<Secrets>) => {
  //     const client = getSecretsStrongholdClient(stronghold)

  //     const secrets = await getRecord<Secrets>(
  //       client.getStore(),
  //       SECRETS_STRONGHOLD_KEY
  //     )

  //     await insertRecord<Secrets>(
  //       client.getStore(),
  //       SECRETS_STRONGHOLD_KEY,
  //       {
  //         api: {
  //           ...secrets?.api || {},
  //           ...params.api || {}
  //         },
  //         flatFiles: {
  //           ...secrets?.flatFiles || baseFlatFilesSecrets,
  //           ...params.flatFiles || {}
  //         }
  //       }
  //     )
  //     stronghold.stronghold?.unload()
  //     await stronghold.stronghold?.save()
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: [SECRETS_STRONGHOLD_KEY] })
  //   },
  //   scope: { id: `updateSecretsMutation` },
  // })

  return new InternalStore({
    state: {
      ...stronghold,
    },
    queries: {
      strongholdPluginSaltFileExistsQuery
    },
    mutations: {
      strongholdPluginInitMutation,
      // updateSecretsMutation
    }
  })
}

