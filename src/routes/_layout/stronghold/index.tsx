// node_modules
import { Plus } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

// components
import { StrongholdPluginInitDialog } from '@/components/stronghold/stronghold-plugin-init-dialog'
import { Button } from '@/components/ui/button'
import { TextLoader } from '@/components/ui/loader'

// stores
import { useStrongholdVaults } from '@/stores/stronghold/stronghold-vaults'

export const Route = createFileRoute('/_layout/stronghold/')({
  component: RouteComponent,
})

const StrongholdVaults = () => {
  const { queries: strongholdVaultsQueries } = useStrongholdVaults()

  let vaults
  if (strongholdVaultsQueries.listVaults.isFetching) {
    vaults = <TextLoader text="fetching vaults" />
  } else if (strongholdVaultsQueries.listVaults.error) {
    vaults = <div>{strongholdVaultsQueries.listVaults.error.message}</div>
  } else if (
    strongholdVaultsQueries.listVaults.data &&
    strongholdVaultsQueries.listVaults.data.length
  ) {
    vaults = strongholdVaultsQueries.listVaults.data.map((vaultName) => (
      <div>{vaultName}</div>
    ))
  } else if (
    strongholdVaultsQueries.listVaults.data &&
    !strongholdVaultsQueries.listVaults.data.length
  ) {
    vaults = <div>No vaults found</div>
  }

  return (
    <div className="flex flex-col w-[95%]">
      <div className="flex flex-row w-full justify-center"></div>
      <div className="flex flex-row w-full justify-center">{vaults}</div>
    </div>
  )
}

function RouteComponent() {
  return (
    <main>
      <StrongholdPluginInitDialog />
      <section>
        <StrongholdVaults />
      </section>
    </main>
  )
}
