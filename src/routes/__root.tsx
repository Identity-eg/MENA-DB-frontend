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

import type { QueryClient } from '@tanstack/react-query'
import type { TUser } from '@/types/user'
import { getMeQueryOptions } from '@/apis/user/get-me'
import { useAuthStore } from '@/stores/auth'
import { getIsomorphicAccessToken } from '@/apis/request/request-interceptor'
import { NotFoundPage } from '@/components/layout/not-found-page'
import { ACCESS_TOKEN_NAME } from '@/constants/auth'

interface MyRouterContext {
  queryClient: QueryClient
  user: TUser | null
}

const getTokenFromServer = createServerFn().handler(() => {
  return getCookie(ACCESS_TOKEN_NAME)
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const accessToken = getIsomorphicAccessToken()

    // Debug: Log authentication state in production SSR
    if (
      typeof window === 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      console.log('SSR Auth Debug - Token exists:', !!accessToken)
      console.log('SSR Auth Debug - Token name:', 'frntAccTkn')
    }

    if (!accessToken) {
      if (
        typeof window === 'undefined' &&
        process.env.NODE_ENV === 'production'
      ) {
        console.log('SSR Auth Debug - No token found, user will be null')
      }
      return { user: null }
    }

    try {
      const user =
        await context.queryClient.ensureQueryData(getMeQueryOptions())
      if (
        typeof window === 'undefined' &&
        process.env.NODE_ENV === 'production'
      ) {
        console.log('SSR Auth Debug - User loaded successfully:', !!user)
      }
      return { user }
    } catch (error) {
      if (
        typeof window === 'undefined' &&
        process.env.NODE_ENV === 'production'
      ) {
        console.error('SSR Auth Debug - Failed to load user:', error)
      }
      return { user: null }
    }
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
