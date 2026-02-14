import { cn } from '@/lib/utils'
import { REQUEST_STATUS } from '@/types/company-request'

const statusConfig: Record<string, { label: string; className: string }> = {
  [REQUEST_STATUS.UNDER_REVIEW]: {
    label: 'Under review',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  [REQUEST_STATUS.INVOICE_GENERATED]: {
    label: 'Invoice generated',
    className: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  [REQUEST_STATUS.COMPLETED]: {
    label: 'Completed',
    className: 'bg-green-600 text-white border-none',
  },
  [REQUEST_STATUS.PAID]: {
    label: 'Paid',
    className: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  [REQUEST_STATUS.REJECTED]: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  [REQUEST_STATUS.PROCESSING]: {
    label: 'Processing',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  [REQUEST_STATUS.CANCELLED]: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
}

interface StatusPillProps {
  status: string
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] ?? {
    label: status.replace(/_/g, ' '),
    className: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
