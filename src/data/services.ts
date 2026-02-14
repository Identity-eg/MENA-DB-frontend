import type { Service } from '@/types'

export const servicesCatalog: Service[] = [
  {
    id: 'risk-intel',
    name: 'Risk Intelligence Report',
    description: 'PEP, sanctions, watchlists, adverse media',
    estimatedPriceUsd: 150,
    estimatedTatDays: 3,
    allowedType: 'Both',
    enabled: true,
  },
  {
    id: 'litigation',
    name: 'Litigation Checks',
    description: 'Court records and litigation history',
    estimatedPriceUsd: 120,
    estimatedTatDays: 5,
    allowedType: 'Both',
    enabled: true,
  },
  {
    id: 'corporate-links',
    name: 'Corporate Links',
    description: 'Reverse directorship, ownership structure',
    estimatedPriceUsd: 200,
    estimatedTatDays: 4,
    allowedType: 'Company',
    enabled: true,
  },
  {
    id: 'identification',
    name: 'Identification (Data Quality)',
    description: 'Identity verification and data quality checks',
    estimatedPriceUsd: 80,
    estimatedTatDays: 2,
    allowedType: 'Individual',
    enabled: true,
  },
  {
    id: 'financial-wealth',
    name: 'Financial & Wealth',
    description: 'Asset tracking and financial profiling',
    estimatedPriceUsd: 250,
    estimatedTatDays: 7,
    allowedType: 'Both',
    enabled: true,
  },
]
