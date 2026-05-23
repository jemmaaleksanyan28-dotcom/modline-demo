import type { Address, User } from '@/lib/types'

export type DemoRole = 'admin' | 'user'

export interface DemoUserRecord extends Omit<User, 'addresses'> {
  password: string
}

const now = '2026-05-23T00:00:00.000Z'

export const demoUsers: DemoUserRecord[] = [
  {
    id: 'demo-admin',
    email: 'admin@modline.local',
    password: 'admin123',
    firstName: 'مدیر',
    lastName: 'دمو',
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-user',
    email: 'user@modline.local',
    password: 'user123456',
    firstName: 'کاربر',
    lastName: 'دمو',
    role: 'user',
    createdAt: now,
    updatedAt: now,
  },
]

export const demoAddresses: Record<string, Address[]> = {
  'demo-user': [
    {
      id: 'demo-address-1',
      firstName: 'کاربر',
      lastName: 'دمو',
      phone: '09120000000',
      addressLine1: 'تهران، خیابان نمونه، پلاک ۱۲',
      addressLine2: 'واحد ۴',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1234567890',
      country: 'ایران',
      isDefault: true,
    },
  ],
  'demo-admin': [
    {
      id: 'demo-address-admin',
      firstName: 'مدیر',
      lastName: 'دمو',
      phone: '09121111111',
      addressLine1: 'تهران، دفتر مرکزی مدلاین',
      addressLine2: '',
      city: 'تهران',
      state: 'تهران',
      postalCode: '1111111111',
      country: 'ایران',
      isDefault: true,
    },
  ],
}

export function findDemoUserByEmail(email: string) {
  return demoUsers.find((user) => user.email === email.toLowerCase()) || null
}

export function findDemoUserById(id: string) {
  return demoUsers.find((user) => user.id === id) || null
}

export function publicDemoUser(user: DemoUserRecord): User {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    addresses: demoAddresses[user.id] || [],
  }
}

export function listPublicDemoUsers(): User[] {
  return demoUsers.map(publicDemoUser)
}
