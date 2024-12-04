// node_modules
import { createLazyFileRoute } from '@tanstack/react-router'

// components
import { useStronghold } from '@/stores/stronghold'


export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const { queries } = useStronghold()
  
  console.log(queries.strongholdPluginSaltFileExistsQuery.error)
  return (
    <div className="p-2">
      asdfasfdsafasdf
      {
        queries.strongholdPluginSaltFileExistsQuery.error
          ? <div>{JSON.stringify(queries.strongholdPluginSaltFileExistsQuery.error)}</div>
          : <div>{JSON.stringify(queries.strongholdPluginSaltFilePathQuery.data)}</div>
      }
    </div>
  )
}