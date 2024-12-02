import { createLazyFileRoute } from '@tanstack/react-router'
import { useStronghold } from "@/stores/stronghold";
import JsonView from '@uiw/react-json-view';

export const Route = createLazyFileRoute('/about')({
  component: About,
})

export function About() {
  const { state } = useStronghold()

  return (
    <JsonView value={state} />
  )
}