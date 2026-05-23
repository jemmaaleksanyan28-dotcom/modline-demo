'use client'

import { create } from 'zustand'
import type { User, Address } from '@/lib/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  login: (email: string, password: string) => Promise<User | null>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<User | null>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>
  updateAddress: (id: string, data: Partial<Address>) => Promise<boolean>
  removeAddress: (id: string) => Promise<boolean>
  setDefaultAddress: (id: string) => Promise<boolean>
  fetchUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchUser: async () => {
    try {
      set({ isLoading: true })
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      const data = await res.json()
      
      if (data.user) {
        set({ 
          user: { ...data.user, addresses: data.user.addresses || [] }, 
          isAuthenticated: true, 
          isLoading: false,
          isInitialized: true 
        })
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          isInitialized: true 
        })
      }
    } catch {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        isInitialized: true 
      })
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null })
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        set({ isLoading: false, error: data.error || 'Login failed' })
        return null
      }

      const safeUser = { ...data.user, addresses: data.user.addresses || [] }
      set({ user: safeUser, isAuthenticated: true, isLoading: false, isInitialized: true })
      return safeUser
    } catch {
      set({ isLoading: false, error: 'An error occurred during login' })
      return null
    }
  },

  register: async (email, password, firstName, lastName) => {
    try {
      set({ isLoading: true, error: null })
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      const data = await res.json()

      if (!res.ok) {
        set({ isLoading: false, error: data.error || 'Registration failed' })
        return null
      }

      const safeUser = { ...data.user, addresses: data.user.addresses || [] }
      set({ user: safeUser, isAuthenticated: true, isLoading: false, isInitialized: true })
      return safeUser
    } catch {
      set({ isLoading: false, error: 'An error occurred during registration' })
      return null
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true })
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      set({ user: null, isAuthenticated: false, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null })
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        set({ isLoading: false, error: result.error || 'Update failed' })
        return false
      }

      set({ user: { ...result.user, addresses: result.user.addresses || [] }, isLoading: false })
      return true
    } catch {
      set({ isLoading: false, error: 'An error occurred during update' })
      return false
    }
  },

  addAddress: async (address) => {
    try {
      set({ isLoading: true, error: null })
      const res = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(address),
      })

      const result = await res.json()

      if (!res.ok) {
        set({ isLoading: false, error: result.error || 'Failed to add address' })
        return false
      }

      // Refresh user data to get updated addresses
      await get().fetchUser()
      return true
    } catch {
      set({ isLoading: false, error: 'An error occurred' })
      return false
    }
  },

  updateAddress: async (id, data) => {
    try {
      set({ isLoading: true, error: null })
      const res = await fetch(`/api/auth/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        set({ isLoading: false, error: result.error || 'Failed to update address' })
        return false
      }

      // Refresh user data to get updated addresses
      await get().fetchUser()
      return true
    } catch {
      set({ isLoading: false, error: 'An error occurred' })
      return false
    }
  },

  removeAddress: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const res = await fetch(`/api/auth/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) {
        const result = await res.json()
        set({ isLoading: false, error: result.error || 'Failed to remove address' })
        return false
      }

      // Refresh user data to get updated addresses
      await get().fetchUser()
      return true
    } catch {
      set({ isLoading: false, error: 'An error occurred' })
      return false
    }
  },

  setDefaultAddress: async (id) => {
    return get().updateAddress(id, { isDefault: true })
  },
}))
