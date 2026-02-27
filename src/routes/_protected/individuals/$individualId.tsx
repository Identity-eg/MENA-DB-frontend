import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/individuals/$individualId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/individuals/$individualId"!</div>
}
