import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/jwt')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/jwt"!</div>
}
