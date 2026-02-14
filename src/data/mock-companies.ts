import type { Company } from '@/types'

export const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    arabicName: 'شركة أكمة القابضة',
    englishName: 'Acme Holdings Ltd',
    country: 'United Arab Emirates',
    registrationNumber: '123456',
    legalType: 'LLC',
    isUnlocked: true,
  },
  {
    id: 'comp-2',
    arabicName: 'ديفوتيم السعودية',
    englishName: 'Devoteam Saudi Arabia',
    country: 'Saudi Arabia',
    isUnlocked: false,
  },
  {
    id: 'comp-3',
    arabicName: 'مجموعة الخليج للاستثمار',
    englishName: 'Gulf Investment Group',
    country: 'Qatar',
    isUnlocked: false,
  },
]
