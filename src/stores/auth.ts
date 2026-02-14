import { create } from 'zustand'

export interface AuthSlice {
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  clearAccessToken: () => void
}

export const useAuthStore = create<AuthSlice>((set) => ({
  accessToken: null,

  setAccessToken: (token) =>
    set(() => ({
      accessToken: token,
    })),

  clearAccessToken: () =>
    set(() => ({
      accessToken: null,
    })),
}))
