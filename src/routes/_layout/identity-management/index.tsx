import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/identity-management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/identity-management"!</div>
}
