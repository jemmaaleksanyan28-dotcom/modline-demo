'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((state) => state.fetchUser)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    if (!isInitialized) {
      fetchUser()
    }
  }, [fetchUser, isInitialized])

  return <>{children}</>
}
