import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { useEffect } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { getCookie } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import { logger } from '../lib/logger'
import type { QueryClient } from '@tanstack/react-query'
import type { TUser } from '@/types/user'
import { getMeQueryOptions } from '@/apis/user/get-me'
import { useAuthStore } from '@/stores/auth'
import { getIsomorphicAccessToken } from '@/apis/request/request-interceptor'
import { NotFoundPage } from '@/components/layout/not-found-page'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
}

const getTokenFromServer = createServerFn().handler(() => {
  return getCookie('accessToken')
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const accessToken = getIsomorphicAccessToken()
    if (!accessToken) {
      return { user: null }
    }
    const user = await context.queryClient.ensureQueryData(getMeQueryOptions())
    return { user }
  },
  notFoundComponent: NotFoundPage,
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
  errorComponent: ({ error }) => {
    logger.error({ msg: 'Unhandled Rendering Error', error })
    return (
      <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded">
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="mt-2">We've encountered an unexpected error. Our team has been notified.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
    )
  },
})

const useSyncClientCredentials = () => {
  const { setAccessToken } = useAuthStore()

  const fetchAccessToken = async () => {
    const tokenFromServer = await getTokenFromServer()
    if (tokenFromServer) {
      setAccessToken(tokenFromServer)
    }
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
        <NuqsAdapter>{children}</NuqsAdapter>
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
