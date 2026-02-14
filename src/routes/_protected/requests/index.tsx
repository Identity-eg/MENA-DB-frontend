import { Link, createFileRoute } from '@tanstack/react-router'
import { CreditCard, Download, Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { TRequest } from '@/types/request'
import {
  getRequestsQueryOptions,
  useGetRequests,
} from '@/apis/requests/get-requests'
import { REQUEST_STATUS } from '@/types/request'
import { PageHeader } from '@/components/page-header'
import { StatusPill } from '@/components/StatusPill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/_protected/requests/')({
  component: RequestsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getRequestsQueryOptions())
    return {}
  },
})

function formatRequestId(id: number) {
  return `REQ-${String(id).padStart(6, '0')}`
}

function formatPrice(estimatedPrice: number, finalPrice: number | null) {
  const amount = finalPrice ?? estimatedPrice
  return `$${amount}`
}

function RequestsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data } = useGetRequests()
  const requests: Array<TRequest> = data.data

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      const requestIdStr = formatRequestId(req.id)
      const searchLower = search.toLowerCase()
      const companyMatch = req.companies.some(
        (c) =>
          c.nameEn.toLowerCase().includes(searchLower) ||
          (c.nameAr != null && c.nameAr.toLowerCase().includes(searchLower)),
      )
      const individualMatch = req.individuals.some((i) =>
        i.fullName.toLowerCase().includes(searchLower),
      )
      const matchSearch =
        !search ||
        requestIdStr.toLowerCase().includes(searchLower) ||
        companyMatch ||
        individualMatch
      const matchStatus = statusFilter === 'all' || req.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [requests, search, statusFilter])

  return (
    <div>
      <PageHeader
        title="My Requests"
        subtitle={`${filtered.length} request${filtered.length === 1 ? '' : 's'}`}
      />
      <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by request ID, company or individual"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v ?? 'all')}
        >
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value={REQUEST_STATUS.UNDER_REVIEW}>
              Under review
            </SelectItem>
            <SelectItem value={REQUEST_STATUS.INVOICE_GENERATED}>
              Invoice generated
            </SelectItem>
            <SelectItem value={REQUEST_STATUS.PAID}>Paid</SelectItem>
            <SelectItem value={REQUEST_STATUS.PROCESSING}>
              Processing
            </SelectItem>
            <SelectItem value={REQUEST_STATUS.COMPLETED}>Completed</SelectItem>
            <SelectItem value={REQUEST_STATUS.REJECTED}>Rejected</SelectItem>
            <SelectItem value={REQUEST_STATUS.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="min-w-0">
        <CardContent className="min-w-0 pt-6">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {requests.length === 0
                ? 'You have no requests yet. Request a screening package from a company page.'
                : 'No requests match your filters.'}
            </div>
          ) : (
            <div className="w-full max-w-full min-w-0 overflow-x-auto -mx-4 sm:mx-0">
              <Table className="min-w-2xl">
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead>Individuals</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono font-medium">
                        {formatRequestId(req.id)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {req.companies
                            .map((c) =>
                              c.nameAr ? `${c.nameEn} (${c.nameAr})` : c.nameEn,
                            )
                            .join(', ') || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {req.individuals
                            .map((i) => i.fullName)
                            .join(', ') || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {req.reports.map((r) => (
                            <Badge
                              key={r.id}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {r.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusPill status={req.status} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(req.estimatedPrice, req.finalPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {req.status === REQUEST_STATUS.INVOICE_GENERATED && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-purple-600 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/50"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          {req.status === REQUEST_STATUS.COMPLETED && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-green-600 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/50"
                            >
                              <Download size={16} />
                            </Button>
                          )}
                          <Link
                            to="/requests/$requestId"
                            params={{ requestId: String(req.id) }}
                          >
                            <Button variant="ghost" size="icon">
                              <Eye size={16} />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
