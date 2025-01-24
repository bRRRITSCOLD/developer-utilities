import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/identity-management/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/identity-management/settings"!</div>
}
