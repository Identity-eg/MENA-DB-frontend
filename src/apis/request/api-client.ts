import axios from 'axios'

import { responseErrorInterceptor } from './response-interceptor'
import { requestSuccessInterceptor } from './request-interceptor'

// Client: baked in at build time (docker build --build-arg VITE_API_URL=...).
// Server (SSR): use runtime env or internal Docker host (backend serves under /api).
const BASE_URL =
  typeof window !== 'undefined'
    ? (import.meta.env.VITE_API_URL ?? '')
    : (process.env.API_SERVER_URL ??
       process.env.VITE_API_URL ??
       'http://backend:5000/api')

/** Request timeout (ms) – prevents infinite loading when backend is unreachable */
const REQUEST_TIMEOUT = 30_000

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(requestSuccessInterceptor, (error) =>
  Promise.reject(error),
)
apiClient.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor,
)
