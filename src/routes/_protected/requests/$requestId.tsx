import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Send,
  User,
} from 'lucide-react'
import type { RequestStatusValue } from '@/types/company-request'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { StatusPill } from '@/components/StatusPill'
import { PageHeader } from '@/components/page-header'
import { REQUEST_STATUS } from '@/types/company-request'

/** Aligned with Prisma RequestStatus enum */
const statusConfig: Record<
  RequestStatusValue,
  { label: string; description: string }
> = {
  [REQUEST_STATUS.UNDER_REVIEW]: {
    label: 'Under review',
    description:
      'Your request has been received and is waiting for initial review.',
  },
  [REQUEST_STATUS.INVOICE_GENERATED]: {
    label: 'Invoice generated',
    description: 'Payment is required to begin the screening process.',
  },
  [REQUEST_STATUS.PAID]: {
    label: 'Paid',
    description: 'Payment received. Your request is queued for processing.',
  },
  [REQUEST_STATUS.PROCESSING]: {
    label: 'Processing',
    description:
      'Our analysts are currently working on your compliance reports.',
  },
  [REQUEST_STATUS.COMPLETED]: {
    label: 'Completed',
    description: 'The screening is complete. You can now download all reports.',
  },
  [REQUEST_STATUS.REJECTED]: {
    label: 'Rejected',
    description: 'This request was rejected.',
  },
  [REQUEST_STATUS.CANCELLED]: {
    label: 'Cancelled',
    description: 'This request was cancelled.',
  },
}

const mockSubjects = [
  {
    id: 's1',
    name: 'Ahmed Al-Sayed',
    type: 'Individual',
    nationality: 'Saudi Arabia',
    services: [
      {
        id: 'ser1',
        name: 'Risk Intelligence Report',
        status: 'Completed',
        price: '$150',
      },
      {
        id: 'ser2',
        name: 'Litigation Checks',
        status: 'Completed',
        price: '$100',
      },
    ],
  },
  {
    id: 's2',
    name: 'Future Tech Solutions LLC',
    type: 'Company',
    nationality: 'UAE',
    services: [
      {
        id: 'ser3',
        name: 'Corporate Intelligence',
        status: 'Completed',
        price: '$250',
      },
      {
        id: 'ser4',
        name: 'UBO Verification',
        status: 'Processing',
        price: '$200',
      },
    ],
  },
  {
    id: 's3',
    name: 'Sara Al-Hashimi',
    type: 'Individual',
    nationality: 'Kuwait',
    services: [
      {
        id: 'ser5',
        name: 'Risk Intelligence Report',
        status: 'Completed',
        price: '$150',
      },
    ],
  },
]

/** Ordered flow for timeline (Prisma RequestStatus) */
const TIMELINE_STATUSES: Array<RequestStatusValue> = [
  REQUEST_STATUS.UNDER_REVIEW,
  REQUEST_STATUS.INVOICE_GENERATED,
  REQUEST_STATUS.PAID,
  REQUEST_STATUS.PROCESSING,
  REQUEST_STATUS.COMPLETED,
]

export const Route = createFileRoute('/_protected/requests/$requestId')({
  component: RequestDetailsPage,
  loader: () => ({}),
})

function RequestDetailsPage() {
  const { requestId } = Route.useParams()
  const [status, setStatus] = useState<RequestStatusValue>(
    REQUEST_STATUS.COMPLETED,
  )
  const [activeSubjectId, setActiveSubjectId] = useState<string>(
    mockSubjects[0].id,
  )

  const config = statusConfig[status]
  const activeSubject =
    mockSubjects.find((s) => s.id === activeSubjectId) || mockSubjects[0]

  // From API: request.estimatedPrice, request.finalPrice; for mock, derive from subjects
  const estimatedPrice = mockSubjects.reduce((sum, s) => {
    return (
      sum +
      s.services.reduce(
        (sSum, svc) =>
          sSum + Number.parseInt(String(svc.price).replace(/\D/g, ''), 10) || 0,
        0,
      )
    )
  }, 0)
  const finalPrice: number | null =
    status === REQUEST_STATUS.COMPLETED ||
    status === REQUEST_STATUS.PAID ||
    status === REQUEST_STATUS.PROCESSING
      ? estimatedPrice
      : null

  const currentStepIndex = TIMELINE_STATUSES.indexOf(status)
  const timelineDates: Record<number, string> = {
    0: 'Jan 30, 10:20 AM',
    1: 'Jan 30, 12:00 PM',
    2: 'Jan 31, 09:15 AM',
    3: 'Jan 31, 10:00 AM',
    4: 'Feb 1, 02:30 PM',
  }
  const timeline = TIMELINE_STATUSES.map((s, idx) => {
    const active = idx <= currentStepIndex
    const isRejectedOrCancelled =
      status === REQUEST_STATUS.REJECTED || status === REQUEST_STATUS.CANCELLED
    const date =
      active && !isRejectedOrCancelled ? (timelineDates[idx] ?? '—') : 'Pending'
    return {
      status: s,
      label: statusConfig[s].label,
      date,
      active: active || (idx === currentStepIndex && isRejectedOrCancelled),
    }
  })

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header className="space-y-6 border-b pb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/requests"
                aria-label="Back to requests"
                className="inline-flex items-center justify-center rounded-lg outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9 -ml-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <PageHeader title={`Request ${requestId}`} />
              <StatusPill status={status} className="shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground pl-11">
              Multiple subjects submitted on January 30, 2026
            </p>
          </div>

          <div className="flex flex-wrap items-stretch gap-4">
            <div className="flex h-full items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Export All (ZIP)
              </Button>
              {status === REQUEST_STATUS.INVOICE_GENERATED && (
                <Button
                  size="sm"
                  className="gap-2 bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500 border-none shadow-sm"
                >
                  <CreditCard className="h-4 w-4" /> Pay ${estimatedPrice}
                </Button>
              )}
            </div>

            {/* Price summary */}
            <div className="flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3">
              <div className="space-y-0.5">
                <p className="text-[11px] text-muted-foreground">
                  Estimated total
                </p>
                <p className="text-xl font-bold tabular-nums tracking-tight">
                  ${estimatedPrice}
                </p>
              </div>
            </div>
            {finalPrice != null && (
              <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-[11px] font-semibold text-muted-foreground">
                    Final amount
                  </p>
                  <p className="text-xl font-bold tabular-nums tracking-tight text-primary">
                    ${finalPrice}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Timeline stepper */}
      <nav aria-label="Request status" className="overflow-x-auto pb-2">
        <div className="flex min-w-max justify-between gap-1 px-1">
          {timeline.map((step, idx) => (
            <button
              key={step.status}
              type="button"
              onClick={() => setStatus(step.status)}
              aria-current={status === step.status ? 'step' : undefined}
              className={cn(
                'flex min-w-[100px] max-w-[140px] flex-col items-center gap-2 rounded-lg p-2 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-muted/50',
                status === step.status && 'bg-muted/50',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all',
                  step.active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-muted/30 text-muted-foreground',
                  status === step.status &&
                    'ring-2 ring-primary ring-offset-2 ring-offset-background',
                )}
              >
                {idx + 1}
              </span>
              <span
                className={cn(
                  'text-xs font-medium leading-tight',
                  step.active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {step.date}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar: Subject selection */}
        <aside className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            Subjects in Request
          </h2>
          <div className="space-y-2" role="tablist" aria-label="Subjects">
            {mockSubjects.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={activeSubjectId === s.id}
                onClick={() => setActiveSubjectId(s.id)}
                className={cn(
                  'w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  activeSubjectId === s.id
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30 text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    activeSubjectId === s.id
                      ? 'bg-primary-foreground/20'
                      : 'bg-muted',
                  )}
                >
                  {s.type === 'Individual' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Building2 className="h-4 w-4" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-sm font-semibold"
                    dir={s.type === 'Individual' ? 'rtl' : 'ltr'}
                  >
                    {s.name}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-medium uppercase tracking-wider',
                      activeSubjectId === s.id
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground',
                    )}
                  >
                    {s.type} · {s.services.length} services
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main: Active subject & deliverables */}
        <main className="lg:col-span-3 space-y-6">
          <Card className="overflow-hidden rounded-xl">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b bg-muted/5">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {activeSubject.type === 'Individual' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </span>
                <div>
                  <CardTitle
                    className="text-xl font-semibold"
                    dir={activeSubject.type === 'Individual' ? 'rtl' : 'ltr'}
                  >
                    {activeSubject.name}
                  </CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {activeSubject.type} · {activeSubject.nationality}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 text-xs font-medium"
              >
                <FileText className="h-3.5 w-3.5" /> Full Subject ZIP
              </Button>
            </CardHeader>
            <CardContent className="px-5 py-5">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Assigned Services & Reports
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeSubject.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/20 hover:bg-muted/20"
                  >
                    <div className="min-w-0 space-y-1.5">
                      <p className="text-sm font-semibold leading-tight">
                        {service.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] font-semibold uppercase',
                            service.status === 'Completed'
                              ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800'
                              : 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800',
                          )}
                        >
                          {service.status}
                        </Badge> */}
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {service.price}
                        </span>
                      </div>
                    </div>
                    {status === REQUEST_STATUS.COMPLETED &&
                    service.status === 'Completed' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 shrink-0 gap-1.5 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary"
                      >
                        <Download className="h-3.5 w-3.5" /> Report
                      </Button>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-muted-foreground">
                        <Activity className="h-4 w-4 animate-pulse" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <Card className="rounded-xl">
              <CardContent className="flex items-start gap-4 p-5">
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    status === REQUEST_STATUS.COMPLETED
                      ? 'bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400'
                      : 'bg-primary/10 text-primary',
                  )}
                >
                  {status === REQUEST_STATUS.COMPLETED ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Activity className="h-5 w-5 animate-pulse" />
                  )}
                </span>
                <div className="min-w-0 space-y-1">
                  <h3 className="text-sm font-semibold">{config.label}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-muted/30">
              <CardContent className="flex flex-col gap-4 p-5">
                <p className="text-xs italic leading-relaxed text-muted-foreground">
                  &ldquo;Reports for {activeSubject.name} are ready for
                  download.&rdquo;
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about this subject…"
                    className="h-9 flex-1 text-sm"
                  />
                  <Button size="sm" className="h-9 shrink-0 px-3">
                    <Send className="h-3.5 w-3.5" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
