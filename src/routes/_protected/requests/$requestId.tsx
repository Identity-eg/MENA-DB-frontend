import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Loader2,
  Send,
  User,
} from 'lucide-react'
import type { TCompany } from '@/types/company'
import type { TIndividual } from '@/types/individual'
import type { TReport } from '@/types/report'
import type { RequestStatusValue, TRequest } from '@/types/request'
import { REQUEST_STATUS } from '@/types/request'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { StatusPill } from '@/components/StatusPill'
import { PageHeader } from '@/components/page-header'
import {
  getRequestQueryOptions,
  useGetRequest,
} from '@/apis/requests/get-request'

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

function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

function formatRequestDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

type SubjectItem = {
  id: string
  name: string
  type: 'Company' | 'Individual'
  nationality: string
  reports: Array<TReport>
}

function buildSubjects(request: TRequest): Array<SubjectItem> {
  const companies: Array<SubjectItem> = request.companies.map(
    (c: TCompany) => ({
      id: `company-${c.id}`,
      name: c.nameAr || c.nameEn,
      type: 'Company',
      nationality: c?.country?.nameEn,
      reports: request.reports,
    }),
  )
  const individuals: Array<SubjectItem> = request.individuals.map(
    (i: TIndividual) => ({
      id: `individual-${i.id}`,
      name: i.fullName,
      type: 'Individual',
      nationality: i.nationality ?? '—',
      reports: request.reports,
    }),
  )
  return [...companies, ...individuals]
}

/** Ordered flow for timeline (Prisma RequestStatus) */
const TIMELINE_STATUSES: Array<RequestStatusValue> = [
  REQUEST_STATUS.UNDER_REVIEW,
  REQUEST_STATUS.INVOICE_GENERATED,
  REQUEST_STATUS.PAID,
  REQUEST_STATUS.PROCESSING,
  REQUEST_STATUS.COMPLETED,
]

function RequestDetailsLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">
        Loading request...
      </p>
    </div>
  )
}

export const Route = createFileRoute('/_protected/requests/$requestId')({
  component: RequestDetailsPage,
  loader: async ({ context, params }) => {
    const requestId = Number(params.requestId)
    if (Number.isNaN(requestId)) throw notFound()
    try {
      await context.queryClient.ensureQueryData(
        getRequestQueryOptions(requestId),
      )
    } catch {
      throw notFound()
    }
  },
  pendingComponent: RequestDetailsLoadingFallback,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-lg font-medium">Request not found</p>
      <p className="text-sm text-muted-foreground">
        This request doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link to="/requests">
        <Button variant="outline" className="mt-4">
          Back to requests
        </Button>
      </Link>
    </div>
  ),
})

function RequestDetailsPage() {
  const { requestId } = Route.useParams()
  const id = Number(requestId)
  const { data } = useGetRequest(id)
  const request = data.data

  const subjects = useMemo(() => buildSubjects(request), [request])
  const [activeSubjectId, setActiveSubjectId] = useState<string>('')

  useEffect(() => {
    if (subjects.length > 0) {
      setActiveSubjectId((prev) =>
        subjects.some((s) => s.id === prev) ? prev : subjects[0].id,
      )
    } else {
      setActiveSubjectId('')
    }
  }, [subjects])

  const status = request.status
  const config = statusConfig[status]
  const foundSubject = subjects.find((s) => s.id === activeSubjectId)
  const activeSubject = foundSubject ?? subjects[0]
  const selectedSubject = subjects.length > 0 ? activeSubject : null
  const estimatedPrice = request.estimatedPrice
  const finalPrice = request.finalPrice

  const currentStepIndex = TIMELINE_STATUSES.indexOf(status)
  const isRejectedOrCancelled =
    status === REQUEST_STATUS.REJECTED || status === REQUEST_STATUS.CANCELLED
  const submittedDate = formatRequestDate(request.createdAt)
  const timeline = useMemo(
    () =>
      TIMELINE_STATUSES.map((s, idx) => {
        const active = idx <= currentStepIndex
        const date =
          active && !isRejectedOrCancelled
            ? idx === 0
              ? submittedDate
              : '—'
            : 'Pending'
        return {
          status: s,
          label: statusConfig[s].label,
          date,
          active: active || (idx === currentStepIndex && isRejectedOrCancelled),
        }
      }),
    [currentStepIndex, isRejectedOrCancelled, submittedDate],
  )

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
              <PageHeader title={formatRequestId(request.id)} />
              <StatusPill status={status} className="shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground pl-11">
              {subjects.length > 0
                ? `${subjects.length} subject${subjects.length === 1 ? '' : 's'} submitted on ${submittedDate}`
                : `Submitted on ${submittedDate}`}
            </p>
          </div>

          <div className="flex flex-wrap items-stretch gap-4">
            <div className="flex h-full items-center gap-2">
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

      {/* Timeline stepper (read-only) */}
      <nav aria-label="Request status" className="overflow-x-auto pb-2">
        <div className="flex min-w-max justify-between gap-1 px-1">
          {timeline.map((step, idx) => (
            <div
              key={step.status}
              role="listitem"
              aria-current={status === step.status ? 'step' : undefined}
              className={cn(
                'flex min-w-[100px] max-w-[140px] flex-col items-center gap-2 rounded-lg p-2 text-center',
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
            </div>
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
            {subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground px-1 py-4">
                No subjects in this request.
              </p>
            ) : (
              subjects.map((s) => (
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
                      {s.type} · {s.reports.length} report
                      {s.reports.length !== 1 ? 's' : ''}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main: Active subject & deliverables */}
        <main className="lg:col-span-3 space-y-6">
          {selectedSubject ? (
            <Card className="overflow-hidden rounded-xl">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b bg-muted/5">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {selectedSubject.type === 'Individual' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <CardTitle
                      className="text-xl font-semibold"
                      dir={
                        selectedSubject.type === 'Individual' ? 'rtl' : 'ltr'
                      }
                    >
                      {selectedSubject.name}
                    </CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {selectedSubject.type} · {selectedSubject.nationality}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 py-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Assigned Services & Reports
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedSubject.reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary/20 hover:bg-muted/20"
                    >
                      <div className="min-w-0 space-y-1.5">
                        <p className="text-sm font-semibold leading-tight">
                          {report.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs tabular-nums text-muted-foreground">
                            ${report?.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {status === REQUEST_STATUS.COMPLETED ? (
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
          ) : (
            <Card className="rounded-xl">
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                {subjects.length === 0
                  ? 'No subjects in this request.'
                  : 'Select a subject from the list.'}
              </CardContent>
            </Card>
          )}

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
                  {selectedSubject
                    ? `"Reports for ${selectedSubject.name} are ready for download."`
                    : 'Ask a question about this request.'}
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
