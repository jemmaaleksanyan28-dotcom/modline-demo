'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StoreSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  zarinpalMerchantId: string
  enableNotifications: boolean
  enableSMS: boolean
  maintenanceMode: boolean
}

interface SettingsStore {
  settings: StoreSettings
  updateSettings: (settings: Partial<StoreSettings>) => void
  resetSettings: () => void
}

const defaultSettings: StoreSettings = {
  storeName: 'فروشگاه مدلاین',
  storeEmail: 'info@modline.local',
  storePhone: '+98 21 1234 5678',
  zarinpalMerchantId: '',
  enableNotifications: true,
  enableSMS: false,
  maintenanceMode: false,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (next) =>
        set((state) => ({ settings: { ...state.settings, ...next } })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'modline-settings',
    }
  )
)
