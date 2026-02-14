import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { TUser } from '@/types/user'
import { getMeQueryOptions } from '@/apis/user/get-me'
import { useEffect } from 'react'
import { getServerAccessToken } from '@/lib/auth'
import { useAuthStore } from '@/stores/auth'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions())
    return { user }
  },
  notFoundComponent: () => <div>Not found Page</div>,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Compliance Requests | Third-Party Risk & Compliance',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

const useSyncClientCredentials = () => {
  const { setAccessToken } = useAuthStore()

  const fetchAccessToken = async () => {
    const tokenFromServer = await getServerAccessToken()
    setAccessToken(tokenFromServer)
  }

  useEffect(() => {
    fetchAccessToken()
  }, [])
}

function RootDocument({ children }: { children: React.ReactNode }) {
  useSyncClientCredentials()
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
