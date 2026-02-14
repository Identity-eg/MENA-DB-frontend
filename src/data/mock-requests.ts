import type { Request, Comment } from '@/types'

export const mockComments: Comment[] = [
  {
    id: 'c1',
    requestId: 'RPS514615',
    authorType: 'system',
    body: 'Request submitted for evaluation.',
    createdAt: '2026-01-27T19:11:00Z',
  },
  {
    id: 'c2',
    requestId: 'RPS514615',
    authorType: 'admin',
    authorEmail: 'compliance@example.com',
    body: 'Quotation sent. Please review and pay to proceed.',
    createdAt: '2026-01-28T10:00:00Z',
  },
]

export const mockRequests: Request[] = [
  {
    id: 'RPS514615',
    type: 'Company',
    status: 'Completed',
    subjects: [
      {
        id: 's1',
        type: 'Company',
        companyName: 'Acme Holdings Ltd',
        country: 'United Arab Emirates',
        registrationNumber: '123456',
        legalType: 'LLC',
      },
    ],
    services: [
      {
        id: 'rs1',
        serviceId: 'risk-intel',
        serviceName: 'Risk Intelligence Report',
        estimatedPriceUsd: 150,
        estimatedTatDays: 3,
        finalPriceUsd: 150,
        finalTatDays: 3,
        status: 'completed',
        pdfUrl: '#',
        included: true,
      },
      {
        id: 'rs2',
        serviceId: 'litigation',
        serviceName: 'Litigation Checks',
        estimatedPriceUsd: 120,
        estimatedTatDays: 5,
        finalPriceUsd: 120,
        finalTatDays: 5,
        status: 'completed',
        pdfUrl: '#',
        included: true,
      },
    ],
    totalPriceUsd: 270,
    customerEmail: 'client@example.com',
    createdAt: '2026-01-27T19:11:00Z',
    updatedAt: '2026-01-30T14:00:00Z',
    comments: mockComments,
  },
  {
    id: 'RPS507345',
    type: 'Individual',
    status: 'WaitingForPayment',
    subjects: [
      {
        id: 's2',
        type: 'Individual',
        fullName: 'John Smith',
        email: 'john@example.com',
        nationality: 'United States',
        idNumber: 'A36843985',
      },
    ],
    services: [
      {
        id: 'rs3',
        serviceId: 'risk-intel',
        serviceName: 'Risk Intelligence Report',
        estimatedPriceUsd: 150,
        estimatedTatDays: 3,
        finalPriceUsd: 150,
        finalTatDays: 3,
        status: 'included',
        included: true,
      },
    ],
    totalPriceUsd: 150,
    customerEmail: 'john@example.com',
    createdAt: '2026-01-26T14:30:00Z',
    updatedAt: '2026-01-28T09:00:00Z',
  },
  {
    id: 'RPS501200',
    type: 'Individual',
    status: 'Expired',
    subjects: [
      {
        id: 's3',
        type: 'Individual',
        fullName: 'Jane Doe',
        nationality: 'United Kingdom',
        idNumber: 'B12345678',
      },
    ],
    services: [
      {
        id: 'rs4',
        serviceId: 'identification',
        serviceName: 'Identification (Data Quality)',
        estimatedPriceUsd: 80,
        estimatedTatDays: 2,
        status: 'pending',
        included: true,
      },
    ],
    totalPriceUsd: 80,
    customerEmail: 'jane@example.com',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-25T23:59:00Z',
  },
]
