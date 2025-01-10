import { StrongholdPluginInitDialog } from '@/components/stronghold/stronghold-plugin-init-dialog'
import { TextLoader } from '@/components/ui/loader'
import { useStronghold } from '@/stores/stronghold'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

export const Route = createFileRoute('/_layout/stronghold')({
  component: RouteComponent,
})

function RouteComponent() {
  const { queries, mutations } = useStronghold()

  const open = useMemo(() => {
    return queries.pluginSaltFileExistsQuery.data === false ||
      mutations.pluginInitMutation.error !== null
  }, [queries.pluginSaltFileExistsQuery.data, mutations.pluginInitMutation.error])

  const loading = useMemo(() => {
    return queries.pluginSaltFilePathQuery.isFetching || queries.pluginSaltFileExistsQuery.isFetching || queries.listVaultsQuery.isFetching
  }, [queries.pluginSaltFilePathQuery.isFetching, queries.pluginSaltFileExistsQuery.isFetching, queries.listVaultsQuery.isFetching])

  useEffect(() => {
    (async () => {
      if (queries.pluginSaltFileExistsQuery.data) {
        await mutations.pluginInitMutation.mutateAsync('')
      }
    })()
  }, [queries.pluginSaltFileExistsQuery.data])

  let content
  if (loading) {
    content = <TextLoader />
  } else {
    content = <div>Hello "/__layout/stronghold"!</div>
  }

  return <section className="">
    <StrongholdPluginInitDialog open={open} />
    {content}
  </section>
}
