import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/stronghold/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/stronghold/settings"!</div>
}
